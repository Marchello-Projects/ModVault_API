import { JwtPayload } from "jsonwebtoken"
import { Role } from "@prisma/client"

export interface AuthPayload extends JwtPayload {
    id: number
    username: string
    role: Role
}