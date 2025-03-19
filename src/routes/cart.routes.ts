import { Router } from "express";
import  { 
    getAddToCart, getCheckoutPage, deleteAllCart, 
    getUpdateQuantityOfCartProduct,
    postBuyNowUsingPaypal, getPaypalSuccess, getPaypalCancel
}  from '../controllers/cart.controller'
 
const router = Router();

router.get('/add/:prod', getAddToCart);

// get checkout page
router.get('/checkout', getCheckoutPage);

// get update cart
router.get('/update/:prod', getUpdateQuantityOfCartProduct);

router.delete('/clear', deleteAllCart);

// paypal payment
router.post('/buynow', postBuyNowUsingPaypal);
router.get('/success', getPaypalSuccess);
router.get('/cancel', getPaypalCancel);

export default router;