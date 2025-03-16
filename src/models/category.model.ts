import { Schema, model } from "mongoose";
import { ICategory } from "../types/category";


const categorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, unique: true, lowercase: true, trim: true, },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }], // Reference to Product model
  },
  { timestamps: true }
);


export const Category = model<ICategory>("Category", categorySchema);

