import { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv'
import jwt from "jsonwebtoken"
import { AuthPayload } from "../types/authPayload.ts"

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

    if (!authHeader) {
        res.status(401).json({ message: "Token not provided" })
        return
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        res.status(401).json({ message: "Token format invalid" })
        return
    }

    try {
        const decode = jwt.verify(token, SECRET_KEY) as unknown as AuthPayload

        next()
    } catch (err) {
        res.status(401).json({ message: "Invalid token" })
    }
}