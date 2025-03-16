import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ZodError } from "zod";


export const doRendering = (
    renderPath: string
): ErrorRequestHandler => {
    return (error: ZodError, req: Request, res: Response, next: NextFunction) => {
        
        // Render the form again with errors and user input
        console.log(`Rendering : ${renderPath}`);
        const errors = error.errors.map(err => err.message);
        req.flash('errors', errors);
        
        if(renderPath === 'admin/addPage'){
            return res.render(renderPath, { userInput: req.body, errors: req.flash("errors"), title:'Add Page' });
        }
        if(renderPath === 'admin/editPage'){

            return res.render(renderPath, { 
                title: 'Edit Page',
                // pass errors ensures the template receives the messages before they disappear and make the errors show at first button hit
                errors: req.flash("errors"), 
                pageToEdit: req.body,
                slug: req.params.slug  
            })
        }
        if(renderPath === 'admin/addCategory'){
            return res.render(renderPath, { userInput: req.body, errors: req.flash("errors"), title:'Add Category' });
        }
        if(renderPath === 'admin/editCategory'){
            return res.render(renderPath, {
                title: 'Edit Category',
                errors: req.flash('errors'),
                catToEdit: req.body,
                slug: req.params.slug
            })
        }
        
    }
}