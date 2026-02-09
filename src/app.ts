import express from 'express'
import authRoutes from './routes/auth.routes.ts'
import categoryRoutes from './routes/category.routes.ts'
import modRoutes from './routes/mod.routes.ts'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/category', categoryRoutes)
app.use('/mod', modRoutes)

export default app