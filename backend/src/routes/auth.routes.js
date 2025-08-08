import { Router } from 'express'
import { login } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { users } from '../data/store.js'
import { check, validationResult } from 'express-validator'

const router = Router()

router.post(
  '/login',
  [
    check('email', 'Email inválido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  login
)

router.get('/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id)
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  const { password, ...userData } = user
  res.json(userData)
})

export default router
