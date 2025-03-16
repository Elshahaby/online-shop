import { Request, Response, Router } from "express";
import { Category, Product } from '../models';


const router = Router();

router.get('/add/:prod', async(req: Request, res: Response) => {
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

    }
})

// get checkout page
router.get('/checkout', async(req: Request, res: Response) => {
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
})

// get update cart
router.get('/update/:prod', async(req: Request, res: Response) => {
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
})

router.delete('/clear', async(req: Request, res: Response) => {
    try{
        delete req.session.cart;

        req.flash("success", `Cart Cleared !`);
        res.json({ success: true, message: "Cart has been Cleared successfully." });

    }catch(error){
        console.log(error)
    }
})

router.post('/buynow', async (req: Request, res: Response) => {
    try {
        console.log("approved Data: ", req.body);
        if (!req.session.cart) {
            req.flash('errors', 'Cart is already empty.')
            res.status(400).json({ error: "Cart is already empty." });    
            return;  
        }

        req.session.cart = [];
        req.session.save(err => {
            if (err) {
                console.error("Session error:", err);
                req.flash('errors', "Could not clear cart after payment" )
                res.status(500).json({ error: "Could not clear cart" });
                return;
            }
            req.flash('success', "Could not clear cart after payment" )
            res.json({ message: "Cart cleared after payment" });
        });
        
    } catch (error) {
        console.error("Error completing payment:", error);
        req.flash('errors', "Something went wrong.")
        res.status(500).json({ error: "Something went wrong." });
    }
})

export default router;