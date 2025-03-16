import { Router } from "express";
import authRoutes from './auth.routes'
import adminPagesRoutes from './pages.admin.routes'
import adminCategoryRoutes from './categories.admin.routes'
import adminProductRoutes from './products.admin.routes'
import pagesRoutes from './pages.routes';
import productsRoutes from './products.routes';
import cartRoutes from './cart.routes'
import { isAdmin } from "../middlewares/adminAuth.middleware";
import { isAuth } from "../middlewares/webSiteAuth.middleware";

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin/categories', isAdmin, adminCategoryRoutes);
router.use('/admin/products', isAdmin, adminProductRoutes);
router.use('/admin/pages', isAdmin, adminPagesRoutes);
router.use('/products', productsRoutes);
router.use('/cart', isAuth, cartRoutes);
router.use('/', pagesRoutes);

export default router;