import express from 'express'
import { accounts, serviceAccounts, movements } from '../data/store.js'
const router = express.Router()

router.get('/me', (req, res) => {
  const a = accounts.find(a => a.userId === req.user.id)
  if (!a) return res.status(404).json({ message: 'Cuenta no encontrada' })
  res.json(a)
})

router.get('/', (req, res) => {
  res.json(accounts.filter(a => a.userId === req.user.id))
})

router.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  const a = accounts.find(a => a.id === id && a.userId === req.user.id)
  if (!a) return res.status(404).json({ message: 'Cuenta no encontrada' })
  res.json(a)
})

router.get('/:id/movements', (req, res) => {
  const id = Number(req.params.id)
  res.json(movements.filter(m => m.accountId === id && m.userId === req.user.id))
})

router.post('/:id/transferencias', (req, res) => {
  const fromId = Number(req.params.id)
  const { toAccountId, serviceId, amount, description } = req.body
  if (!amount || !description || !(toAccountId || serviceId)) return res.status(400).json({ message: 'Datos incompletos' })

  const from = accounts.find(a => a.id === fromId && a.userId === req.user.id)
  if (!from) return res.status(404).json({ message: 'Cuenta origen no encontrada' })
  if (from.balance < amount) return res.status(400).json({ message: 'Saldo insuficiente' })

  const now = new Date().toISOString()
  const nextId = movements.length + 1

  const debit = {
    id: nextId,
    userId: req.user.id,
    accountId: fromId,
    type: 'debit',
    amount,
    date: now,
    description,
    category: 'transfer'
  }
  movements.push(debit)
  from.balance -= amount

  let credit, service
  if (toAccountId) {
    const toAcc = accounts.find(a => a.id === Number(toAccountId))
    if (toAcc) {
      credit = {
        id: nextId + 1,
        userId: toAcc.userId,
        accountId: toAcc.id,
        type: 'credit',
        amount,
        date: now,
        description,
        category: 'transfer'
      }
      movements.push(credit)
      toAcc.balance += amount
    }
  } else if (serviceId) {
    service = serviceAccounts.find(s => s.id === Number(serviceId))
  }

  res.json({ message: 'Transferencia realizada', debit, credit, service })
})

export default router
