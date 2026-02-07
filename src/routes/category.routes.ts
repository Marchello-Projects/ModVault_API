import { Router } from "express"
import { newCategory, allCategories, updateCategory, delCategory } from "../controllers/category.controller.ts"
import { authMiddleware } from "../middlewares/authMiddleware.ts"
import { adminMiddleware } from "../middlewares/adminMiddleware.ts"

const router = Router() 

router.post('/create', authMiddleware, adminMiddleware, newCategory)
router.get('/all', authMiddleware, allCategories)
router.patch('/update/:id', authMiddleware, adminMiddleware, updateCategory)
router.delete('/delete/:id', authMiddleware, adminMiddleware, delCategory)

export default router