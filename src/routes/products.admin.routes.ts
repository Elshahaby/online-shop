import { Router } from "express";
import {
    getProductTable, getAddProduct, postAddProduct,
    getEditProduct, deleteExistingImageInEditProduct,
    postEditProduct, deleteProduct
} from '../controllers/products.admin.controller';

const router = Router();


router.get('/', getProductTable)

router.get('/addProduct', getAddProduct)
router.post('/addProduct' , postAddProduct)  

router.get('/editProduct/:slug', getEditProduct);
router.delete('/deleteImage', deleteExistingImageInEditProduct);
router.post('/editProduct/:slug', postEditProduct);

router.delete('/deleteProduct/:id', deleteProduct);

export default router;
