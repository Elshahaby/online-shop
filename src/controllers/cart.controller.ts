import { Request, Response, Router } from "express";
import { Product } from '../models';
import paypal from '../config/paypal.config'
import { productType } from '../types/CartProduct'



export const getAddToCart = async(req: Request, res: Response) => {
    try{

        const slug = req.params.prod;
        const product = await Product.findOne({slug: slug});
        if(!product) throw new Error('product not found to add it in cart')

        // console.log("Check Type of Cart : ",typeof req.session.cart)
        if(typeof req.session.cart === "undefined"){
            req.session.cart = [];
            req.session.cart.push({
                title: product?.title,
                slug: slug,
                quantity: 1,
                price: product?.price,
                image: product?.images[0]
            })
        }else{
            const cart = req.session.cart;
            let newItem = true;

            for(let i=0; i < cart.length; i++){
                if(cart[i].slug === slug){
                    cart[i].quantity++;
                    newItem = false;
                    break;
                }
            }

            if(newItem){
                cart.push({
                    title: product?.title,
                    slug: slug,
                    quantity: 1,
                    price: product?.price,
                    image: product?.images[0].replace('/\\/g',"/")
                })
            }

        }
        // console.log("Updated Cart : \n", req.session.cart);

        req.flash("success", `${product?.title} Product Added To Cart`);
        res.redirect('back');

    }catch(error){
        console.log(error);
    }
};

export const getCheckoutPage = async(req: Request, res: Response) => {
    try{

        // console.log(req.session.cart)
        if(req.session.cart && req.session.cart.length === 0){
            delete req.session.cart;
            res.redirect('/cart/checkout');
            return;
        }

        res.render('checkout', {
            title: 'Checkout',
            cart: req.session.cart,
            matchCat: "nothing",
            // user: req.session.user
        })
    }catch(error){
        console.log(error);
    }
};

export const getUpdateQuantityOfCartProduct = async(req: Request, res: Response) => {
    try{
        const slug = req.params.prod;
        let cart = req.session.cart;
        const action = req.query.action;

        for(let i=0; i<cart.length; i++){
            if(cart[i].slug === slug){
                switch(action){
                    case "add":
                        cart[i].quantity++;
                        req.flash("success", `${slug} Product Updated In Cart !`);
                        break;
                    case "remove":
                        cart[i].quantity--;
                        if(cart[i].quantity === 0) cart.splice(i, 1);
                        req.flash("success", `${slug} Product Updated In Cart !`);
                        break;
                    case "clear":
                        cart.splice(i, 1);
                        if(cart.length === 0) delete req.session.cart;
                        req.flash("success", `${slug} Product Cleared from Cart !`);
                        break;
                    default:
                        console.log('update cart problem');
                        break;
                }
                break;
            }
        }
      
        res.redirect('/cart/checkout');

    }catch(error){
        console.log(error);
    }
};

export const deleteAllCart = async(req: Request, res: Response) => {
    try{
        delete req.session.cart;

        req.flash("success", `Cart Cleared !`);
        res.json({ success: true, message: "Cart has been Cleared successfully." });

    }catch(error){
        console.log(error)
    }
};

export const postBuyNowUsingPaypal = (req: Request, res: Response) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/cart/success",
            "cancel_url": "http://localhost:3000/cart/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": req.session.cart.map( (product: productType)  => ({
                    name : product.title,
                    quantity : product.quantity, 
                    price: product.price,
                    currency: "USD",
                    sku : product.slug
                }))
            },
            "amount": {
                "currency": "USD",
                "total": req.session.cart.reduce((sum: number, item: productType) => {
                    return item.price * item.quantity + sum;
                }, 0)
            },
            "description": "Hat for the best team ever"
        }]
    };

    paypal.payment.create(
        create_payment_json,
        function (error: paypal.SDKError, payment: paypal.Payment) {
            if (error) {
                console.log(error);
            } else {
                if(!payment.links) throw new Error("Not found payments links");
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
};

export const getPaypalSuccess = (req: Request, res: Response) => {
    const payerId: string = req.query.PayerID as string;    
    const paymentId: string = req.query.paymentId as string;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": req.session.cart.reduce((sum: number, item: productType) => {
                    return item.price * item.quantity + sum;
                }, 0)
            }
        }]
    };

    paypal.payment.execute(paymentId,
        execute_payment_json,
        function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                delete req.session.cart;
                req.flash('success', 'Payment Done Successfully')
                res.redirect('/');
            }
        });
};

export const getPaypalCancel = (req: Request, res: Response) => { 
    req.flash('errors', "Payment Canceled");
    res.redirect('/cart/checkout');
};