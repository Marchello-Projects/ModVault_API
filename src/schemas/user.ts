import z from "zod"
import { RoleEnum } from "./enums.ts"

export const UserCore: z.ZodType<any> = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    email: z.email({ message: "Invalid email address format" }), 
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    role: RoleEnum.default('USER')
})
