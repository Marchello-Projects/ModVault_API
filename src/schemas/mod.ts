import z from "zod"

export const ModCore: z.ZodType<any> = z.object({
    title: z.string()
        .min(10, { message: "Title must be at least 10 characters long" })
        .max(50, { message: "Title cannot exceed 50 characters" }),
    description: z.string()
        .min(50, { message: "Description must be at least 50 characters long" }),
    fileUrl: z.url({ message: "Invalid file URL" }),
    authorId: z.number().int({ message: "Author ID must be an integer" })
})