import { PrismaClient, Prisma } from "@prisma/client"
import type { CategoryInput } from "../schemas/category.ts"
import { NotFoundError, ConflictError } from "../errors/customErrors.ts"
const prisma = new PrismaClient()

export class CategoryService {
    async createCategory(data: CategoryInput) {
        try {
            return await prisma.category.create({
                data: { name: data.name }
            })
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictError(`A category named "${data.name}" already exists`)
            }
            console.error(`Unknown error while creating: ${error instanceof Error ? error.message : String(error)}`)
            throw error
        }
    }

    async getAllCategories() {
        try {
            return await prisma.category.findMany()
        } catch(error: unknown) {
            console.error(`Error getting categories: ${error instanceof Error ? error.message : String(error)}`)
            throw error
        }
    }

    async updateCategoryName(id: number, data: CategoryInput) {
        try {
            return await prisma.category.update({
                where: { id },
                data: {
                    name: data.name
                }
            })
        } catch(error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError(`Category with ID ${id} not found`)
            }

            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictError(`The name "${data.name}" is already taken`)
            }

            console.error(`Error updating category name: ${error instanceof Error ? error.message : String(error)}`)
            throw error
        }
    }

    async deleteCategory(id: number) {
        try {
            return await prisma.category.delete({
                where: { id }
            })
        } catch(error: unknown) {
             if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                console.error(`Category with id ${id} not found`)
            }
            console.error(`Error deleting category: ${error instanceof Error ? error.message : String(error)}`)
            throw error
        }
    }
}