import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductVariant {
  unit: string;
  price: number;
  mrp: number;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
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
  sortOrder?: number;
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
    slug: { type: String, trim: true, lowercase: true, index: true },
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
    sortOrder: { type: Number, default: 999 },
  },
  { timestamps: true }
);

// Pre-save hook to ensure slug is generated
ProductSchema.pre('save', function (this: IProduct) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
