import { Request, Response, Router } from "express";
import { Category, Product } from '../models';


const router = Router();

// Get All Products
router.get('/', async (req: Request, res: Response) => {
    try{
        const products = await Product.find().populate<{ category: { title: string; slug: string } }>("category", "title slug");
        if(!products) throw new Error('Products Not Found');

        res.render('AllProducts', {
            title: "All Products", 
            matchCat: "nocategory",
            products, 
            user: req.session.user,
        })
    }catch(error){
        console.log("from / route : ",  error);
    }
})


// Get product by category
router.get('/:category', async (req: Request, res: Response) => {
    try{
        const categorySlug = req.params.category;
        const category = await Category.findOne({ slug: categorySlug })
        if (!category) throw new Error("Category not found");
        
        const products = await Product.find({category: category._id}).populate<{ category: { title: string; slug: string } }>("category", "title slug");
        
        res.render('categoryProducts', {
            title: category.title,
            matchCat: category.title,
            products,
            // user: req.session.user
        })
    }catch(error){
        console.log(error);
    }
})


router.get('/:category/:product', async(req: Request, res: Response) => {
    try{
        
        const product = await Product.findOne({slug: req.params.product}).lean();
        if(!product) throw new Error('Not found Product');
        console.log("product Details : ",product)
        
        // auth part to prevent non-login users from showing details and add to cart later
        if(!req.session.user?.id){
            req.flash('errors', `You should login to have access on ${product.title} details`);
            return res.redirect('back');
        }

        const category = await Category.findOne({slug: req.params.category}).lean();
        console.log("category Details : ",category)
        if(!category) throw new Error('Not found Category');

        res.render('product',{
            title: product.title,
            matchCat: category.title,
            product,
            user: req.session.user
        })
    }catch(error){
        console.log(error);
    }
})


export default router;