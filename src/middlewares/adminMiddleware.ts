import type { Request, Response, NextFunction } from "express"
import { Role } from "@prisma/client" 
import type { AuthPayload } from "../types/authPayload.ts"

export const adminMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const user = (req as any).user as AuthPayload | undefined

    if (!user) {
        res.status(401).json({ message: "User context not found" })
        return
    }

    if (user.role !== Role.ADMIN) {
        res.status(403).json({ message: "Access denied: Admins only" })
        return
    }

    next()
}   