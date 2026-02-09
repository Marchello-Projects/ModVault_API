import { Router } from "express"
import { getMods, createMod, deleteMod, updateTitle, updateDescription, updateCategory} from "../controllers/mod.controller.ts"
import { authMiddleware } from "../middlewares/authMiddleware.ts"
import { upload } from "../middlewares/filesMiddleware.ts"

const router = Router()

router.get("/", getMods)
router.post("/", authMiddleware, upload.single("file"), createMod)
router.delete("/:id", authMiddleware, deleteMod)
router.patch("/:id/title", authMiddleware, updateTitle)
router.patch("/:id/description", authMiddleware, updateDescription)
router.patch("/:id/category", authMiddleware, updateCategory)

export default router