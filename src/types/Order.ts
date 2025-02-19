import { Types } from 'mongoose'

export interface IOrder {
    user: Types.ObjectId; // Reference to the User model
    products: {
        product: Types.ObjectId;  // Reference to the product model
        quantity: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}