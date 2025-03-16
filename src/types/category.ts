import { Document, Types } from "mongoose";

export interface ICategory extends Document {
    title: string;
    slug?: string;
    products: Types.ObjectId[]; // Array of product IDs belonging to this category
    createdAt: Date;
    updatedAt: Date;
}