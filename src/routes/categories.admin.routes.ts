import { Router } from "express";
import { 
    getCategories, getAddCategory, postAddCategory,
    getEditCategory, postEditCategory, deleteCategory 
} from '../controllers/categories.controller'


const router = Router();

// categories routes
router.get('/', getCategories);

router.get('/addCategory', getAddCategory)

router.post('/addCategory', postAddCategory)

router.get('/editCategory/:slug', getEditCategory)

router.post('/editCategory/:slug', postEditCategory)

router.delete('/deleteCategory/:id', deleteCategory)

export default router;