import {Schema, model} from 'mongoose'
import {IProduct} from '../types/Product'

const productSchema = new Schema<IProduct>(
    {
      title: { type: String, required: true },
      slug: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, min: 1, required: true},
      images: [{ type: String, required: true }],
      category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category model
      stock: { type: Number, min: 1 ,required: true }, // decrease after every checkout session 
      soldItems: { type: Number, default: 0 },
      // add a soldItem property to store number of sold items over time after each order
    }, 
    { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);