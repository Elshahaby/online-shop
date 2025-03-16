import { Document, Types } from "mongoose";
export interface IProduct extends Document {
    title: string;
    slug: string;
    description: string;
    price: number;
    images: string[];  // array of file paths for product images
    category: Types.ObjectId; // Reference to the Category model
    stock: number;
    soldItems: number;
    createdAt: Date;
    updatedAt: Date;
}