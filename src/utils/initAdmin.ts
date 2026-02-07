import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

export const ensureAdminExists = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
        
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        })

        if (existingAdmin) {
            console.log('Admin account already exists')
            return
        }

        console.log('Admin account not found. Creating one...')
        
        const adminPassword = process.env.ADMIN_PASSWORD || 'securePassword123'
        const hashedPassword = await bcrypt.hash(adminPassword, 10)

        await prisma.user.create({
            data: {
                username: 'SuperAdmin',
                email: adminEmail,
                password: hashedPassword,
                role: Role.ADMIN 
            }
        })

        console.log('Admin account created successfully')
        
    } catch (error: any) {
        console.error(`Error creating admin account: ${error}`)
    }
}