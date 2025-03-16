import { Document } from "mongoose";
export interface IUser extends Document {
    username: string;
    email: string;
    password: string; // Stored as plain text
    role: 'user' | 'admin'; 
    createdAt: Date;
    updatedAt: Date;
}