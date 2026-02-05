import z from "zod"

export const RoleEnum = z.enum(["USER", "ADMIN"])
