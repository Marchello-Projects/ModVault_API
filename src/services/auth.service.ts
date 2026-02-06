import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient, Prisma } from '@prisma/client'
import type { 
    RegisterInput, 
    LoginInput
} from '../schemas/auth.ts'
import { SECRET_KEY } from '../middlewares/authMiddleware.ts'

const prisma = new PrismaClient()

export class AuthService {
    private generateToken(id: number, role: string) {
        if (!SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined")
        }

        return jwt.sign(
            { id, role },
            SECRET_KEY,
            { expiresIn: "24h" }
        )
    }

    private async getUserOrThrow(where: Prisma.UserWhereUniqueInput) {
        const user = await prisma.user.findUnique({
            where: where
        })

        if (!user) {
            throw new Error("User not found")
        }

        return user
    }

    async register(data: RegisterInput) {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }, { username: data.username }]
            }
        })

        if (existingUser) {
            throw new Error("User already exists")
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const newUser = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                role: "USER"
            }
        })

        const token = this.generateToken(newUser.id, newUser.role);

        const { password, ...userWithoutPassword } = newUser
        return { user: userWithoutPassword, token }
    }

    async login(data: LoginInput) {
        const user = await this.getUserOrThrow({ email: data.email })

        const isPasswordValid = await bcrypt.compare(data.password, user.password)

        if (!isPasswordValid) {
            throw new Error("Incorrect password")
        }

        const token = this.generateToken(user.id, user.role)

        return { token }
    }

    async getUserProfile(userID: number) {
        const user = await this.getUserOrThrow({ id: userID })

        const { password, ...userWithoutPassword } = user

        return userWithoutPassword
    }
}