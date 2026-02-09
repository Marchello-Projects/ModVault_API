import z from "zod" 

export const ModSchema = z.object({
    title: z.string()
        .min(4, { message: "Mod title must be at least 3 characters long" })
        .max(50, { message: "Mod title must be at most 50 characters long" }),
    description: z.string()
        .min(10, { message: "Description must be at least 10 characters long" }),
    categoryId: z.preprocess((val) => {
        if (typeof val === "string") {
            try {
                return JSON.parse(val)
            } catch {
                return val.split(',').map(Number)
            }
        }
        return val
    }, z.array(z.number()).min(1, "Select at least one category"))
})

export const ModTitleUpdateSchema = z.object({
    title: z.string()
        .min(4, { message: "Mod title must be at least 3 characters long" })
        .max(50, { message: "Mod title must be at most 50 characters long" })
})

export const ModDescriptionUpdateSchema = z.object({
    description: z.string()
        .min(10, { message: "Description must be at least 10 characters long" })
})

export const ModCategoryUpdateSchema = z.object({
    categoryId: z.preprocess((val) => {
        if (typeof val === "string") {
            try {
                return JSON.parse(val)
            } catch {
                return val.split(',').map(Number)
            }
        }
        return val
    }, z.array(z.number()).min(1, "Select at least one category"))
})

export type ModInput = z.infer<typeof ModSchema>
export type ModTitleUpdateInput = z.infer<typeof ModTitleUpdateSchema>
export type ModDescriptionUpdateInput = z.infer<typeof ModDescriptionUpdateSchema>
export type ModCategoryUpdateInput = z.infer<typeof ModCategoryUpdateSchema>