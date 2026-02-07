import type { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv'
import jwt from "jsonwebtoken"
import type { AuthPayload } from "../types/authPayload.ts"

dotenv.config()

export const SECRET_KEY = process.env.SECRET_KEY 

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined")
}

export const authMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token not provided" })
        return
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        res.status(401).json({ message: "Token format invalid" })
        return
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY) as AuthPayload

        (req as any).user = payload

        next()
    } catch (err) {
        res.status(401).json({ message: "Invalid token" })
    }
}