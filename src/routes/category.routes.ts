import { Router } from "express"
import { newCategory, allCategories, updateCategory, delCategory } from "../controllers/category.controller.ts"
import { authMiddleware } from "../middlewares/authMiddleware.ts"
import { adminMiddleware } from "../middlewares/adminMiddleware.ts"

const router = Router() 

router.post('/', authMiddleware, adminMiddleware, newCategory)
router.get('/', authMiddleware, allCategories)
router.patch('/:id', authMiddleware, adminMiddleware, updateCategory)
router.delete('/:id', authMiddleware, adminMiddleware, delCategory)

export default router