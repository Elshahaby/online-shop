import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import path from "path";
import fs from 'fs-extra'
import { Category, Product } from "../models";
import { errorHandlerFunction } from "../middlewares/errorHandlerWithRedirection.middleware";
import { doRendering } from "../middlewares/errorHandlerWithRendering.middleware";
import { processImages, uploadMiddleware } from "../config/multer.config";
import { productSchema, zProduct } from "../validators/product.validator";
import { generateUniqueSlug } from "../utils/slugGenerator.utils";

export const getProductTable = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const count = await Product.countDocuments();
        const products = await Product.find().populate("category", "title"); // Fetch category title instead of ObjectId

        res.render('admin/products', { count, products, title: "Admin Products" });
    }catch(error){
        next(error);
    }
}

export const getAddProduct = async (req: Request, res: Response) => {
    try{
        const categories = await Category.find();
        const formData = {} ;
        res.render('admin/addProduct',{
            title: "Add Product",
            categories,
            formData
        })
    }catch(error){
        const redirectPath:string = '/admin/categories/addCategory';
        errorHandlerFunction(redirectPath)(error, req, res, () => {})  
    }
};

export const postAddProduct = async(req: Request, res: Response) => {
   try{

        await uploadMiddleware(req, res);

        if(req.body.stock) req.body.stock = Number(req.body.stock);
        if(req.body.price) req.body.price = Number(req.body.price);
        
        const productInput: zProduct = productSchema.parse({files: req.files, ...req.body});
        let {title, slug, description, category, price, stock } = productInput;

        // prevent duplication of title or slug
        const existingProduct = await Product.findOne({ title }); 
        if(existingProduct){
            throw Error('Product title exists before, choose another title')
        }

        if(slug){
            const existingSlug = await Product.findOne({ slug });
            if (existingSlug) {
                throw Error("Slug must be unique. Try a different title or slug.");
            }
        }else{
            slug = await generateUniqueSlug(title);
        }
        
        
        const productName = title.replace(/\s+/g, "_").toLowerCase();
        const imagePaths = await processImages(productName, req.files as Express.Multer.File[]);
        
        const newProduct = await new Product({ title, slug, description, price, stock, images: imagePaths, category });
        await newProduct.save(); // 🔹 The slug is automatically generated in the pre-save middleware
        
        // add id of the new product added to array of the products ids of the specific category choosed
        const findCategory = await Category.findOne({_id: category});
        if(!findCategory) throw new Error("Category not found");
        findCategory.products.push(newProduct.id);
        await findCategory.save();

        req.flash('success', 'Product added');
        res.redirect('/admin/products');

   }catch(error){
        const renderPath:string = '';
        const redirectPath:string = '/admin/products/addProduct';
        if (renderPath && error instanceof ZodError) {
            doRendering(renderPath)(error, req, res, () => {})
        }else{
            errorHandlerFunction(redirectPath)(error, req, res, () => {});
        }
   }
};

export const getEditProduct = async(req: Request, res: Response) => {
    try{
        const product = await Product.findOne({slug: req.params.slug});
        const formData = product;

        const categories = await Category.find();
        res.render('admin/editProduct',  {title: "Edit Product", formData, slug: formData?.slug, categories });
    }catch(error){
        const redirectPath:string = '/admin/products';
        errorHandlerFunction(redirectPath)(error, req, res, () => {});
    }
};

export const deleteExistingImageInEditProduct = async (req: Request, res: Response) => { 
    try {
        const { productId, imagePath } = req.body;

        if (!productId || !imagePath) {
            res.status(400).json({ success: false, message: "Product ID and image path are required" });
            return;
        }

        // Find product by ID
        const product = await Product.findById(productId);

        console.log(product);
        console.log(imagePath);

        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        const normalizedProductImages = product.images.map(img => img.replace(/\\/g, "/"));

        // Check if the image exists in the product's image array
        if (!normalizedProductImages.includes(imagePath)) {
            res.status(400).json({ success: false, message: "Image not found in product" });
            return;
        }

        // Remove image from filesystem
        const absolutePath = path.join(__dirname, "../../", imagePath);
        if (await fs.pathExists(absolutePath)) {
            await fs.remove(absolutePath);
        }

        // Remove image from product array in database
        product.images = normalizedProductImages.filter(img => img !== imagePath);
        await product.save();
        
        console.log("show product form Delete image route",product);

        res.json({ success: true, message: "Image deleted", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const postEditProduct = async(req: Request, res: Response) => {
    const UPLOADS_DIR = path.join(__dirname, '../../uploads');
    const PROJECT_FOLDER = path.join(__dirname, '../../');
    
    // console.log(UPLOADS_DIR)
    // console.log(PROJECT_FOLDER);

    try{
        await uploadMiddleware(req, res);

        // if(req.body.stock) req.body.stock = Number(req.body.stock);
        // if(req.body.price) req.body.price = Number(req.body.price);
        
        const productInput: zProduct = productSchema.parse({files: req.files, ...req.body});
        let {title, slug, description, category, price, stock } = productInput;

        const existingImages: string[] = req.body.existingImages || []; // Get remaining images
        const productId = req.body.id;

        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found");

        // prevent duplication of title or slug
        const existingProduct = await Product.findOne({ title, _id: { $ne: productId } }); 
        if(existingProduct){
            throw Error('Product title exists before, choose another title')
        }

        if(slug){
            const existingSlug = await Product.findOne({ slug, _id: { $ne: productId} });
            if (existingSlug) {
                throw Error("Slug must be unique. Try a different title or slug.");
            }
        }else{
            slug = await generateUniqueSlug(title, productId);
        }


        // CHECK IF THE TITLE HAS CHANGED
        const oldProductName = product.title.replace(/\s+/g, "_").toLowerCase();
        const newProductName = title.replace(/\s+/g, "_").toLowerCase();
    
        console.log(oldProductName)
        console.log(newProductName)

        let updatedImages = [...existingImages];
        let newImages: string[] = [];

        if (oldProductName !== newProductName) {
            const oldFolder = path.join(UPLOADS_DIR, oldProductName);
            const newFolder = path.join(UPLOADS_DIR, newProductName);
            console.log("Old Folder", oldFolder);
            console.log("New Folder", newFolder);

            // Ensure new folder exists before moving images
            await fs.ensureDir(newFolder);

            // Move existing images to the new folder
            for (const imagePath of existingImages) {
                const oldImagePath = path.join(PROJECT_FOLDER, imagePath); 
                const newImagePath = oldImagePath.replace(oldProductName, newProductName);

                console.log("Old Image Path :", oldImagePath)
                console.log("New Image Path :", newImagePath)

                if (await fs.pathExists(oldImagePath)) {
                    await fs.move(oldImagePath, newImagePath, { overwrite: true });
                }
            }

            console.log("Before Updated Images : ", updatedImages);

            // Update image paths in the database
            updatedImages = existingImages.map((imgPath) =>
                imgPath.replace(oldProductName, newProductName)
            );

            console.log("After Updated Images : ", updatedImages);

            // Remove old folder if empty
            if (await fs.pathExists(oldFolder)) {
                await fs.remove(oldFolder);
            } 
        }
        
        // Ensure total images do not exceed 4
        let totalImages = 0;
        if(Array.isArray(req.files)) totalImages = updatedImages.length + req.files.length;
        if (totalImages > 4) {
            throw new Error("You can only have up to 4 images.");
        }
        
        // Process new images
        if (Array.isArray(req.files) && req.files.length > 0) {
            newImages = await processImages(newProductName, req.files) || [];
        }
        
        // If all images are deleted and no new images uploaded
        if (existingImages.length === 0 && newImages.length === 0) {
            const productFolder = path.join(UPLOADS_DIR, product.title.replace(/\s+/g, "_").toLowerCase());
            if (await fs.pathExists(productFolder)){
                await fs.remove(productFolder);
            }
        }

        // UPDATE PRODUCT IN DATABASE
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { title, slug, description, category, price, stock, images: [...updatedImages, ...newImages] },
            { new: true, runValidators: true }
        );
        
        req.flash("success", "Product updated successfully");
        res.redirect("/admin/products");
        
    }catch(error){
        const renderPath:string = ''; // admin/editProduct
        const redirectPath:string = `/admin/products/editProduct/${req.params.slug}`;
        if (renderPath && error instanceof ZodError) {
            doRendering(renderPath)(error, req, res, () => {})
        }else{
            errorHandlerFunction(redirectPath)(error, req, res, () => {});
        }
    }
};

export const deleteProduct = async(req: Request, res: Response) => {
    try{
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        
        await Product.findByIdAndDelete(req.params.id);
        
        const productFolder = path.join(__dirname, "../../uploads", product.title.replace(/\s+/g, "_").toLowerCase());
        console.log(productFolder);

        if (await fs.pathExists(productFolder)) {
            await fs.remove(productFolder);
            console.log(`Deleted folder: ${productFolder}`);
        }

        res.json({ success: true, message: "Product deleted successfully" });

    }catch(error){
        console.log(error);
    }
};