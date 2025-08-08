import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import accountRoutes from './routes/account.routes.js'
import cardRoutes from './routes/card.routes.js'
import { authMiddleware } from './middleware/auth.middleware.js'
import serviceRoutes from './routes/service.routes.js'


const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/accounts', authMiddleware, accountRoutes)
app.use('/cards', authMiddleware, cardRoutes)
app.use('/services', authMiddleware, serviceRoutes)

app.get('/health', (_req, res) => res.json({ ok: true }))

export default app
