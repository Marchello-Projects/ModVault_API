import { PrismaClient, Prisma } from "@prisma/client"
import fs from "fs/promises"
import path from "path"
import type { ModInput, ModTitleUpdateInput, ModDescriptionUpdateInput, ModCategoryUpdateInput } from "../schemas/mod.ts"
import { ConflictError, NotFoundError, ForbiddenError } from "../errors/customErrors.ts"

const prisma = new PrismaClient()
const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

export class ModService {
    private async _ensureModOwnership(modId: number, userId: number) {
        const mod = await prisma.mod.findUnique({
            where: { id: modId }
        })

        if (!mod) {
            throw new NotFoundError("Mod not found")
        }

        if (mod.authorId !== userId) {
            throw new ForbiddenError("You are not allowed to edit or delete this mod")
        }

        return mod
    }

    async getAllMods() {
        try {
            return await prisma.mod.findMany({
                include: {
                    categories: true,
                    author: { select: { username: true } }
                }
            })
        } catch(error: unknown) {
            console.error(`Error getting mods: ${error instanceof Error ? error.message : String(error)}`)
            throw error
        }
    }

    async createMod(userId: number, fileUrl: string, data: ModInput) {
        try {
            const categoriesConnect = data.categoryId.map((id) => ({ id }))

            return await prisma.mod.create({
                data: {
                    title: data.title,
                    description: data.description,
                    fileUrl: fileUrl,
                    author: { connect: { id: userId } },
                    categories: { connect: categoriesConnect }
                },
                include: {
                    categories: true,
                    author: { select: { username: true } }
                }
            })
        } catch(error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') throw new ConflictError(`The title "${data.title}" is already taken`)
                if (error.code === 'P2025') throw new NotFoundError("One or more selected categories do not exist")
            }
            console.error(`Error creating mod: ${error instanceof Error ? error.message : String(error)}`)
            throw error
        }
    } 

    async deleteMod(modId: number, userId: number) {
        const mod = await this._ensureModOwnership(modId, userId)

        if (mod.fileUrl) {
            try {
                const safeFileName = path.basename(mod.fileUrl)
                const absolutePath = path.join(UPLOAD_DIR, safeFileName)
                await fs.unlink(absolutePath)
            } catch(error: unknown) {
                const nodeError = error as NodeJS.ErrnoException
                if (nodeError.code !== 'ENOENT') {
                    console.error(`Error deleting file: ${nodeError.message}`)
                }
            }
        }

        await prisma.mod.delete({ where: { id: modId } })

        return { message: "Mod deleted successfully" }
    }

    async updateTitleMod(id: number, userId: number, data: ModTitleUpdateInput) {
        await this._ensureModOwnership(id, userId)

        try {
            return await prisma.mod.update({
                where: { id },
                data: { title: data.title }
            })
        } catch(error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') throw new NotFoundError(`Mod with ID ${id} not found`)
                if (error.code === 'P2002') throw new ConflictError(`The title "${data.title}" is already taken`)
            }
            console.error(`Error updating title: ${error instanceof Error ? error.message : String(error)}`)
            throw error
        }
    }

    async updateDescriptionMod(id: number, userId: number, data: ModDescriptionUpdateInput) {
        await this._ensureModOwnership(id, userId)

        try {
            return await prisma.mod.update({
                where: { id },
                data: { description: data.description }
            })
        } catch(error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError(`Mod with ID ${id} not found`)
            }
            console.error(`Error updating description: ${error instanceof Error ? error.message : String(error)}`)
            throw error
        }
    }

    async updateCategoryMod(id: number, userId: number, data: ModCategoryUpdateInput) {
        await this._ensureModOwnership(id, userId)

        try {
            return await prisma.mod.update({
                where: { id },
                data: {
                    categories: {
                        set: data.categoryId.map((catId) => ({ id: catId }))
                    }
                },
                include: { categories: true }
            })
        } catch(error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError(`One of the provided categories does not exist`)
            }
            console.error(`Error updating categories: ${error instanceof Error ? error.message : String(error)}`)
            throw error
        }
    }
}