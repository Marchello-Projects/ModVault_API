import { JwtPayload } from "jsonwebtoken"

export interface AuthPayload extends JwtPayload {
    id: number
    username: string
}