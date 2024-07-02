import { Router } from "express";

import authRouter from "../features/auth/auth_router.js"
import productsRouter from "../features/products/router.js"

const router = Router();

router.use('/auth', authRouter)
router.use('/products', productsRouter)

export default router;