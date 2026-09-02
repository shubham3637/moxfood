import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDraftOrderItem {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IDraftCustomerDetails {
  name: string;
  phone: string;
  address: string;
  pincode?: string;
  landmark?: string;
  state?: string;
  district?: string;
  deliverySlot?: string;
}

export interface IDraftOrder extends Document {
  draftId: string;
  razorpayOrderId: string;
  customerDetails: IDraftCustomerDetails;
  items: IDraftOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  couponCode?: string;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  status: 'Initiated' | 'Converted' | 'Abandoned';
  createdAt: Date;
  updatedAt: Date;
}

const DraftOrderItemSchema = new Schema<IDraftOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const DraftCustomerDetailsSchema = new Schema<IDraftCustomerDetails>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, default: '' },
    landmark: { type: String, default: '' },
    state: { type: String, default: '' },
    district: { type: String, default: '' },
    deliverySlot: { type: String, default: 'Anytime Today' },
  },
  { _id: false }
);

const DraftOrderSchema: Schema<IDraftOrder> = new Schema(
  {
    draftId: { type: String, required: true, unique: true },
    razorpayOrderId: { type: String, required: true, index: true },
    customerDetails: { type: DraftCustomerDetailsSchema, required: true },
    items: { type: [DraftOrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 0 },
    couponCode: { type: String, default: '' },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'RAZORPAY' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    status: {
      type: String,
      enum: ['Initiated', 'Converted', 'Abandoned'],
      default: 'Initiated',
    },
  },
  { timestamps: true }
);

const DraftOrder: Model<IDraftOrder> =
  mongoose.models.DraftOrder || mongoose.model<IDraftOrder>('DraftOrder', DraftOrderSchema);

export default DraftOrder;
