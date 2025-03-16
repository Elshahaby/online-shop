import { Router } from 'express'

import { 
    getAdminPages, getAddPages, postAddPage,
    postReorderPages, getEditPage, postEditPage, deletePage
 } from '../controllers/pages.admin.controller'
 
const router = Router();

// admin pages routes

router.get('/', getAdminPages );

router.get('/addPage', getAddPages)
router.post('/addPage', postAddPage)

// post reorder pages
router.post('/reorderPages', postReorderPages)

router.get('/editpage/:slug', getEditPage)
router.post('/editpage/:slug', postEditPage)

router.delete('/deletePage/:id', deletePage)

export default router;