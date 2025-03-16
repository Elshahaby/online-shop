import { Document } from "mongoose";
export interface IPage extends Document {
    title: string;
    slug: string;
    content: string; 
    sorting: number; 
    createdAt: Date;
    updatedAt: Date;
}