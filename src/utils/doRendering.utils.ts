import { Request, Response } from "express";


export const doRenderingFun = (
    renderPath: string, message: string[]
) => {
    return (req: Request, res: Response) => {
        
        // Render the form again with errors and user input
        console.log(`Rendering : ${renderPath}`);
        req.flash('errors', message);
        
        if(renderPath === 'admin/addPage'){
            return res.render(renderPath, { userInput: req.body, title:'Add Page' });
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
        return res.send('Handle the rendered Path, man!!');
    }
}