import { Router } from 'express'
import { login } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { users } from '../data/store.js'

const router = Router()

router.post('/login', login)

router.get('/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id)
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  const { password, ...userData } = user
  res.json(userData)
})

export default router
