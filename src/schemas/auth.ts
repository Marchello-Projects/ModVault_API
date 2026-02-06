import z from "zod"

export const RegisterSchema = z.object({
  username: z.string({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" }),
    
  email: z.email({ message: "Invalid email address format" }),
  password: z.string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
})

export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email address format" }).or(z.string({ message: "Invalid username format" }).min(3)),
  password: z.string({ message: "Password is required" }),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>