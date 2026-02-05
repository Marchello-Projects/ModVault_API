import z from "zod"

export const CategoryCore: z.ZodType<any> = z.object({
    name: z.string()
        .min(10, { message: "Category name must be at least 10 characters long" })
        .max(50, { message: "Category name cannot exceed 50 characters" })
})