import type { Request, Response } from "express"
import { ZodError } from "zod"
import { CategoryService } from "../services/category.service.ts"
import { CategorySchema } from "../schemas/category.ts"
import { NotFoundError, ConflictError } from "../errors/customErrors.ts"

const categoryService = new CategoryService()

export const newCategory = async (req: Request, res: Response) => {
    try {
        const validatedData = CategorySchema.parse(req.body)

        const result = await categoryService.createCategory(validatedData)
        res.status(201).json(result)
    } catch(error: unknown) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                errors: error.issues.map(err => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            })
        }

        if (error instanceof ConflictError) {
            return res.status(409).json({ message: error.message })
        }

        res.status(500).json({ message: `Internal server error: ${error instanceof Error ? error.message : String(error)}` })
    }
}

export const allCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories()
        res.status(200).json(categories)
    } catch (error: unknown) {
        res.status(500).json({ message: `Internal server error: ${error instanceof Error ? error.message : String(error)}` })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryID = Number(req.params.id)

        if (isNaN(categoryID)) {
            return res.status(400).json({ message: 'Invalid category id' })
        }

        const validatedData = CategorySchema.parse(req.body)

        const result = await categoryService.updateCategoryName(categoryID, validatedData)
        res.status(200).json(result)
    } catch(error: unknown) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                errors: error.issues.map(err => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            })
        }

        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message })
        }

        if (error instanceof ConflictError) {
            return res.status(409).json({ message: error.message })
        }

        res.status(500).json({ message: `Internal server error: ${error instanceof Error ? error.message : String(error)}` })
    }
}

export const delCategory = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid category id' })
        }

        await categoryService.deleteCategory(id)

        return res.status(204).send()
    } catch(error: unknown) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message })
        }

        res.status(500).json({ message: `Internal server error: ${error instanceof Error ? error.message : String(error)}` })
    }
}