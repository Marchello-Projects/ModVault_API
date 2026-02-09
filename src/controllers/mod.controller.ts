import type { Request, Response } from "express"
import { ZodError } from "zod"
import { ModService } from "../services/mod.service.ts"
import { ModSchema, ModTitleUpdateSchema, ModDescriptionUpdateSchema, ModCategoryUpdateSchema } from "../schemas/mod.ts"
import { NotFoundError, ConflictError, ForbiddenError } from "../errors/customErrors.ts"

const modService = new ModService()

export const getMods = async (req: Request, res: Response) => {
    try {
        const mods = await modService.getAllMods()
        res.status(200).json(mods)
    } catch(error: unknown) {
        res.status(500).json({ message: `Internal server error: ${error instanceof Error ? error.message : String(error)}` })
    }
}

export const createMod = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "Mod file is required" })
            return
        }

        const validatedData = ModSchema.parse(req.body)

        const newMod = await modService.createMod(
            req.user!.id, 
            req.file.filename, 
            validatedData
        )
        
        res.status(201).json(newMod)
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
             res.status(409).json({ message: error.message })
             return 
        }

        if (error instanceof NotFoundError) {
             res.status(404).json({ message: error.message }) 
             return 
        }
        
        console.error("Create mod error:", error)
        res.status(500).json({ message: "Internal server error" })
    }
} 

export const deleteMod = async (req: Request, res: Response) => {
    try {
        const modId = Number(req.params.id)

        if (isNaN(modId)) {
            res.status(400).json({ message: "Invalid Mod ID" })
            return
        }

        const result = await modService.deleteMod(modId, req.user!.id)
        res.status(200).json(result)

    } catch(error: unknown) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ message: error.message })
            return
        }
        if (error instanceof ForbiddenError) {
            res.status(403).json({ message: error.message })
            return
        }

        console.error("Delete mod error:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateTitle = async (req: Request, res: Response) => {
    try {
        const modId = Number(req.params.id)

        if (isNaN(modId)) {
            res.status(400).json({ message: "Invalid Mod ID" })
            return
        }

        const validatedData = ModTitleUpdateSchema.parse(req.body)
        const updatedMod = await modService.updateTitleMod(modId, req.user!.id, validatedData)

        res.status(200).json(updatedMod)

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
            res.status(404).json({ message: error.message })
            return
        }

        if (error instanceof ForbiddenError) {
            res.status(403).json({ message: error.message })
            return
        }

        if (error instanceof ConflictError) {
            res.status(409).json({ message: error.message })
            return
        }

        console.error("Update title error:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateDescription = async (req: Request, res: Response) => {
    try {
        const modId = Number(req.params.id)
        if (isNaN(modId)) {
            res.status(400).json({ message: "Invalid Mod ID" })
            return
        }

        const validatedData = ModDescriptionUpdateSchema.parse(req.body)
        const updatedMod = await modService.updateDescriptionMod(modId, req.user!.id, validatedData)

        res.status(200).json(updatedMod)

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
            res.status(404).json({ message: error.message })
            return
        }

        if (error instanceof ForbiddenError) {
            res.status(403).json({ message: error.message })
            return
        }

        console.error("Update description error:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const modId = Number(req.params.id)
        if (isNaN(modId)) {
            res.status(400).json({ message: "Invalid Mod ID" })
            return
        }

        const validatedData = ModCategoryUpdateSchema.parse(req.body)
        const updatedMod = await modService.updateCategoryMod(modId, req.user!.id, validatedData)

        res.status(200).json(updatedMod)

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
            res.status(404).json({ message: error.message })
            return
        }

        if (error instanceof ForbiddenError) {
            res.status(403).json({ message: error.message })
            return
        }

        console.error("Update category error:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}