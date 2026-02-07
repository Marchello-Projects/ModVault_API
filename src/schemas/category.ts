import z from "zod"

export const CategorySchema = z.object({
    name: z.string()
        .min(4, { message: "Category name must be at least 3 characters long" })
        .max(50, { message: "Category name must be at most 50 characters long" })
})

export type CategoryInput = z.infer<typeof CategorySchema>