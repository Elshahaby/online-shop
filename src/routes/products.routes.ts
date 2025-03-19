import { Router } from "express";
import {
    getAllProducts, getProductOfCategory,
    getProductInCategory
}from '../controllers/products.controller';

const router = Router();

// Get All Products
router.get('/', getAllProducts);

// Get products of specific category
router.get('/:category', getProductOfCategory)

// get a product from products of a specific category 
router.get('/:category/:product', getProductInCategory)


export default router;