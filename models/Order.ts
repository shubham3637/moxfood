import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  altNameGujarati?: string;
  unit: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ICustomerDetails {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  deliverySlot?: string;
}

export interface IOrder extends Document {
  orderId: string;
  customerDetails: ICustomerDetails;
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'UPI';
  paymentStatus: 'Pending' | 'Paid';
  status: 'Pending' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    altNameGujarati: { type: String, default: '' },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const CustomerDetailsSchema = new Schema<ICustomerDetails>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String, default: '' },
    deliverySlot: { type: String, default: 'Anytime Today' },
  },
  { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerDetails: { type: CustomerDetailsSchema, required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'UPI'], default: 'COD' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
