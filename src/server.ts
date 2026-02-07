import app from "./app.ts"
import { ensureAdminExists } from "./utils/initAdmin.ts"
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        await ensureAdminExists()

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
        
    } catch (error: any) {
        console.error(`Failed to start server: ${error}`)
        process.exit(1) 
    }
}

start()