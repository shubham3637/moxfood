import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  altNameGujarati?: string;
  slug: string;
  image?: string;
  iconName?: string;
  sortOrder?: number;
  createdAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    altNameGujarati: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, default: '' },
    iconName: { type: String, default: 'ShoppingBag' },
    sortOrder: { type: Number, default: 999 },
  },
  { timestamps: true }
);

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
