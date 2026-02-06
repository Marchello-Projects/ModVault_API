import { Router } from "express"
import { register, login, getProfile } from "../controllers/auth.controller.ts"
import { authMiddleware } from "../middlewares/authMiddleware.ts"

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authMiddleware, getProfile)

export default router