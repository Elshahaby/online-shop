export interface IProduct {
    name: string;
    description: string;
    price: number;
    images: string[];  // array of file paths for product images
    category: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}