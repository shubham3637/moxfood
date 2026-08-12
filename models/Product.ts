import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductVariant {
  unit: string;
  price: number;
  mrp: number;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  altNameGujarati?: string;
  category: string; // Slug or Name
  price: number;
  mrp: number;
  stock: number;
  unit: string; // Default or Primary unit, e.g. "250 g"
  variants?: IProductVariant[];
  images: string[];
  description?: string;
  isFeatured: boolean;
  isTrending?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    unit: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { _id: false }
);

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    altNameGujarati: { type: String, trim: true, default: '' },
    category: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    unit: { type: String, required: true, default: '1 kg' },
    variants: { type: [ProductVariantSchema], default: [] },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
