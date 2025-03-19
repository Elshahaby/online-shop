import { Router } from 'express';
import {
    getAllProducts, getCategoryBySlug
}from '../controllers/pages.controller';

const router = Router();

router.get('/', getAllProducts);
router.get('/:slug', getCategoryBySlug);

export default router;