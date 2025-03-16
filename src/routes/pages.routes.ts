import { Router, Request, Response } from 'express'
import { PageModel } from '../models';

const router = Router();


router.get('/', async(req: Request, res: Response) => {
    try{
        const page = await PageModel.findOne({slug: "home"});
        res.render('index', {
             title: page?.title, content: page?.content
            // , userId: req.session.userId 
        })
    }catch(error){
        console.log(error);
    }
})

router.get('/:slug', async(req: Request, res: Response) =>{
    try{
        const slug = req.params.slug;

        const page = await PageModel.findOne({slug})
        if(!page){
            res.redirect('/');
            return;
        }

        res.render('index', { 
            title: page.title, content: page.content,
            // userId: req.session.userId 
        })

    }catch(error){

    }
})

export default router;