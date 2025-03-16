import { Request, Response } from "express";
import { Category } from '../models/index'
import { categorySchema, CategoryType } from '../validators/category.validator'
import { errorHandlerFunction } from "../middlewares/errorHandlerWithRedirection.middleware";
import { doRendering } from "../middlewares/errorHandlerWithRendering.middleware";
import { ZodError } from 'zod'
import { generateUniqueSlug } from "../utils/slugGenerator.utils";
import { app } from "../app";
import { loadCategories } from "../utils/loadCategories.utils";


export const getCategories = async (req: Request, res: Response) => {
    try{
        const categories = await Category.find();
        res.render('admin/categories', {
            categories, title: 'Admin Categories'
        })
    }catch(error){
        
        const renderPath:string = 'admin/categories';
        const redirectPath:string = '/admin/categories/addCategory';
        if (renderPath && error instanceof ZodError) {
            doRendering(renderPath)(error, req, res, () => {})
        }else{
            errorHandlerFunction(redirectPath)(error, req, res, () => {});
        }
    }
}

export const getAddCategory = (req: Request, res: Response) => {
    try{
        const userInput = { title: "" }

        res.render('admin/addCategory', { title: 'Add Category', userInput })
    }catch(error){
        const redirectPath:string = '/admin/categories/addCategory';
        errorHandlerFunction(redirectPath)(error, req, res, () => {})
    }
}

export const postAddCategory = async(req: Request, res: Response) => {
    try{
        const categoryInput: CategoryType = categorySchema.parse(req.body);
        let { title, slug } = categoryInput;

        // prevent duplication of title or slug
        const existingCategory = await Category.findOne({ title }); 
        if(existingCategory){
            throw Error('Category title exists before, choose another title')
        }

        if(slug){
            const existingSlug = await Category.findOne({ slug });
            if (existingSlug) {
                throw Error("Slug must be unique. Try a different title or slug.");
            }
        }else{
            slug = await generateUniqueSlug(title);
        }

        const category = await new Category({ title, slug });
        await category.save(); // 🔹 The slug is automatically generated in the pre-save middleware

        await loadCategories(app);

        req.flash('success', 'Category added');
        res.redirect('/admin/categories');
    }catch(error){
        
        const renderPath:string = 'admin/addCategory';
        const redirectPath:string = '/admin/categories/addCategory';
        if (renderPath && error instanceof ZodError) {
            doRendering(renderPath)(error, req, res, () => {})
        }else{
            errorHandlerFunction(redirectPath)(error, req, res, () => {});
        }
    }
}

export const getEditCategory = async (req: Request, res: Response) => {
    try{
        const catToEdit = await Category.findOne({ slug: req.params.slug });
        res.render('admin/editCategory', { title: "Edit Category", catToEdit, slug: catToEdit?.slug });

    }catch(error){
        const redirectPath:string = '/admin/categories';
        errorHandlerFunction(redirectPath)(error, req, res, () => {});
    }
}

export const postEditCategory = async (req: Request, res: Response) => {
    try{
        const categoryInput: CategoryType = categorySchema.parse(req.body);
        const { title } = categoryInput;
        const id = req.body.id;

        // prevent duplication of title or slug
        const existingCategory = await Category.findOne({ title, _id:{'$ne':id} }); 
        if(existingCategory){
            throw Error('Category title exists before, choose another or title')
        }

        let slug = await generateUniqueSlug(title, id);

        const category = await Category.findByIdAndUpdate(id, { title, slug }, {new: true, runValidators: true});;
        if(category) await category.save();
        else throw new Error("Category not found.");
        
        await loadCategories(app);

        req.flash('success', 'Category Edited');
        res.redirect('/admin/categories');
    }catch(error){
        
        const renderPath:string = 'admin/editCategory';
        const redirectPath:string = `/admin/categories/editCategory/${req.params.slug}`;
        if (renderPath && error instanceof ZodError) {
            doRendering(renderPath)(error, req, res, () => {})
        }else{
            errorHandlerFunction(redirectPath)(error, req, res, () => {});
        }
    }
}

export const deleteCategory = async (req: Request, res:Response) => {
    try{
        await Category.findByIdAndDelete(req.params.id);

        await loadCategories(app);

        res.json({ success: true, message: "Category deleted" });

    }catch(error){
        const redirectPath:string = '/admin/categories';
        errorHandlerFunction(redirectPath)(error, req, res, () => {});
    }
}