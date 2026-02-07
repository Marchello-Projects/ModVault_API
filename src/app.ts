import express from 'express'
import authRoutes from './routes/auth.routes.ts'
import categotyRoutes from './routes/category.routes.ts'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/category', categotyRoutes)

export default app