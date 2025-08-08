import express from 'express'
import { cards } from '../data/store.js'

const router = express.Router()

router.get('/', (req, res) => {
  const userId = req.user.id
  const userCards = cards.filter(c => c.userId === userId)
  res.json(userCards)
})

router.get('/:id', (req, res) => {
  const userId = req.user.id
  const id = Number(req.params.id)
  const card = cards.find(c => c.id === id && c.userId === userId)
  if (!card) return res.status(404).json({ message: 'Tarjeta no encontrada' })
  res.json(card)
})

export default router
