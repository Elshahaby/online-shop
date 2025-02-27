import {Request, Response} from 'express'
import { Page, pageSchema } from '../validators/page.validator';
import { errorHandlerFunction } from '../middlewares/errorHandlerWithRedirection.middleware';
import { ZodError } from 'zod';
import { doRendering } from '../middlewares/errorHandlerWithRendering.middleware';
import { PageModel } from '../models'


// admin controllers

export const getAdminPages = async (req: Request, res:Response) => {
    try{
        const pages = await PageModel.find().sort({sorting: 1});  // ascending order by sorting properity
        res.render('admin/pages', { title: "Admin Pages", pages})
    }catch(error){
        const redirectPath:string = '/admin/pages';
        errorHandlerFunction(redirectPath)(error, req, res, () => {});
    }
}

export const getAddPages = (req: Request, res: Response) => {
   try{
    const userInput = {
        title: "",
        slug: "",
        content: ""
    }

    res.render('admin/addPage', { title:'Add Page',userInput });
   }catch(err){
    console.log(err);
   }
}

export const postAddPage = async (req: Request, res: Response) => {
    try{
        const pageInput: Page = pageSchema.parse(req.body);
        let { title, slug, content } = pageInput;

        if(!slug){
            slug = title.toLowerCase().trim()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
        }

        const findPage = await PageModel.findOne({ slug }); 
        if(findPage){
            req.flash('errors', 'Page slug exists, choose another')
            return res.redirect('/admin/pages/addPage');
        }

        // sorting 100 or any big number to make it shows in /admin/pages at the end of the list
        const page = await new PageModel({ title, slug, content, sorting: 100 });
        await page.save();

        req.flash('success', 'Page added');
        res.redirect('/admin/pages');

    }catch(error){

        const renderPath:string = 'admin/addPage';
        const redirectPath:string = '/admin/pages/addPage';
        if (renderPath && error instanceof ZodError) {
            doRendering(renderPath)(error, req, res, () => {})
        }else{
            errorHandlerFunction(redirectPath)(error, req, res, () => {});
        }
    }
}

export const postReorderPages = async (req: Request, res:Response) => {
    try{
        const ids: string[] = req.body.id;
       
        let count = 0;
        for(let i = 0; i < ids.length; i++){
            const id = ids[i];
            count++;

            await PageModel.findByIdAndUpdate(id, { sorting: count });
        }
    }catch(error){
        const redirectPath:string = '/admin/pages';
        errorHandlerFunction(redirectPath)(error, req, res, () => {});
    }
}

export const getEditPage = async (req: Request, res: Response) => {
    try{
        const pageToEdit = await PageModel.findOne({ slug: req.params.slug });
        res.render('admin/editPage', { title: "Edit Page", pageToEdit, slug: pageToEdit?.slug });

    }catch(error){
        const redirectPath:string = '/admin/pages';
        errorHandlerFunction(redirectPath)(error, req, res, () => {});
    }
}

export const postEditPage = async (req: Request, res: Response) => {
    try{
        const pageInput: Page = pageSchema.parse(req.body);
        let { title, slug, content } = pageInput;
        const id = req.body.id;

        if(!slug){
            slug = title.toLowerCase().trim()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
        }

        const findPage = await PageModel.findOne({ slug, _id:{'$ne':id} }); 
        if(findPage){
            req.flash('errors', 'Page slug exists, choose another')
            return res.render(`admin/editPage`, {
                title: 'Edit Page',
                errors: req.flash("errors"), 
                pageToEdit: req.body,
                slug: req.params.slug 
            });
        }

        const page = await PageModel.findByIdAndUpdate(id, { title, slug, content });
        if(page) await page.save();

        req.flash('success', 'Page Edited');
        res.redirect('/admin/pages');

    }catch(error){

        const renderPath:string = 'admin/editPage';
        const redirectPath:string = `/admin/pages/editpage/${req.params.slug}`;
        if (renderPath && error instanceof ZodError) {
            doRendering(renderPath)(error, req, res, () => {});
        }else{
            console.log("Done Error");
            errorHandlerFunction(redirectPath)(error, req, res, () => {});
        }
    }
}

export const deletePage = async (req: Request, res:Response) => {
    try{
        await PageModel.findByIdAndDelete(req.params.id);
        

        const pages = await PageModel.find().sort({sorting: 1});  // ascending order by sorting properity
        res.render('admin/pages',{ 
            title: "Admin Pages",
            message: 'Page Deleted successfully',
            pages
        })
    }catch(error){
        const redirectPath:string = '/admin/pages';
        errorHandlerFunction(redirectPath)(error, req, res, () => {});
    }
}