import multer from "multer"
import path from "path"
import fs from "fs/promises" 
import type { Request } from "express"

const uploadDir = "uploads"

const storage = multer.diskStorage({
    destination: async (req: Request, file, cb) => {
        try {
            await fs.mkdir(uploadDir, { recursive: true })
            cb(null, uploadDir)
        } catch (error: any) {
            cb(error, "")
        }
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, uniqueSuffix + ext)
    }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedMimeTypes = [
        'application/zip',               
        'application/x-zip-compressed',  
        'application/vnd.rar',           
        'application/x-rar-compressed',  
        'application/x-rar'              
    ]

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only .zip and .rar archives are allowed!'), false)
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 500 * 1024 * 1024 }
})