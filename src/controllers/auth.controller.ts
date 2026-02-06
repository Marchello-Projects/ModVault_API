import type { Request, Response } from "express"
import { ZodError } from "zod"
import { AuthService } from "../services/auth.service.ts"
import { RegisterSchema, LoginSchema } from "../schemas/auth.ts"

const authService = new AuthService()

export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = RegisterSchema.parse(req.body)

        const result = await authService.register(validatedData)
        res.status(201).json(result)
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                errors: error.issues.map(err => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            })
        }

        if (error instanceof Error && error.message === "User already exists") {
            return res.status(409).json({ message: error.message })
        }

        res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const validatedData = LoginSchema.parse(req.body)

        const result = await authService.login(validatedData)
        res.status(200).json(result)
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Invalid credentials") {
            res.status(401).json({ message: "Invalid email or password" })
        } 
        
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userID = (req as any).user.id

        const user = await authService.getUserProfile(userID)

        res.json(user)
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "User not found") {
            res.status(404).json({ message: "User not found" })
        } 
            
        res.status(500).json({ message: "Internal server error" })
    }
}