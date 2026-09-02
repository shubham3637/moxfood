'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  altNameGujarati?: string;
  unit: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
  totalItemsCount: number;
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  freeDeliveryThreshold: number;
  totalWeightGrams: number;
  billableKg: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'moxfood_cart_v1';

// Helper to parse unit string into weight in grams
export function parseUnitWeightGrams(unitStr: string): number {
  if (!unitStr) return 1000;
  const str = unitStr.toLowerCase().trim();

  // Match e.g. "250 g", "500g", "250 gram"
  const gramMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams)\b/);
  if (gramMatch) {
    return parseFloat(gramMatch[1]);
  }

  // Match e.g. "1 kg", "5.5kg", "5 litre"
  const kgMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilo|litre|l)\b/);
  if (kgMatch) {
    return parseFloat(kgMatch[1]) * 1000;
  }

  return 1000; // default 1 kg
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [items, isLoaded]);

  const addToCart = (product: any, quantityToAdd: number = 1) => {
    setItems((prevItems) => {
      // Support weight variant unique ID: product.cartId or product._id + unit
      const id =
        product.cartId ||
        (product._id ? `${product._id}_${product.unit || 'default'}` : (product.id || product.productId));

      const existingIndex = prevItems.findIndex((item) => item.productId === id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantityToAdd;
        return updated;
      } else {
        const newItem: CartItem = {
          productId: id,
          name: product.name,
          altNameGujarati: product.altNameGujarati || '',
          unit: product.unit || '1 kg',
          price: Number(product.price),
          mrp: Number(product.mrp || product.price),
          quantity: quantityToAdd,
          image: Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCartDrawer = () => {
    setIsCartOpen((prev) => !prev);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Total weight calculation
  const totalWeightGrams = items.reduce((sum, item) => {
    const singleGrams = parseUnitWeightGrams(item.unit);
    return sum + singleGrams * item.quantity;
  }, 0);

  const billableKg = totalWeightGrams > 0 ? Math.max(1, Math.ceil(totalWeightGrams / 1000)) : 0;
  // Default base fee (Flat ₹20/kg all over India)
  const deliveryCharge = items.length === 0 ? 0 : billableKg * 20;
  const grandTotal = subtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        toggleCartDrawer,
        totalItemsCount,
        subtotal,
        deliveryCharge,
        grandTotal,
        freeDeliveryThreshold: 0,
        totalWeightGrams,
        billableKg,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
