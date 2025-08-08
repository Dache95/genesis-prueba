import express from 'express'
import { accounts, serviceAccounts, movements } from '../data/store.js'
import { check, param, validationResult } from 'express-validator'

const router = express.Router()

router.get('/me', (req, res) => {
    const a = accounts.find(a => a.userId === req.user.id)
    if (!a) return res.status(404).json({ message: 'Cuenta no encontrada' })
    res.json(a)
})

router.get('/', (req, res) => {
    res.json(accounts.filter(a => a.userId === req.user.id))
})

router.get(
  '/:id',
  param('id', 'ID inválido').isInt({ gt: 0 }),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    next()
  },
  (req, res) => {
    const id = Number(req.params.id)
    const a = accounts.find(a => a.id === id && a.userId === req.user.id)
    if (!a) return res.status(404).json({ message: 'Cuenta no encontrada' })
    res.json(a)
  }
)

router.get(
  '/:id/movements',
  param('id', 'ID inválido').isInt({ gt: 0 }),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    next()
  },
  (req, res) => {
    const id = Number(req.params.id)
    res.json(movements.filter(m => m.accountId === id && m.userId === req.user.id))
  }
)

router.post(
  '/:id/transferencias',
  [
    param('id', 'ID inválido').isInt({ gt: 0 }),
    check('amount', 'Monto inválido').isFloat({ gt: 0 }),
    check('description', 'Descripción es requerida').notEmpty(),
    check('toAccountId').optional().isInt({ gt: 0 }),
    check('serviceId').optional().isInt({ gt: 0 })
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    next()
  },
  (req, res) => {
    const fromId = Number(req.params.id)
    const { toAccountId, serviceId, amount, description } = req.body

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
        toAcc.balance += amount
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
      }
    } else if (serviceId) {
      service = serviceAccounts.find(s => s.id === Number(serviceId))
    }

    res.json({ message: 'Transferencia realizada', debit, credit, service })
  }
)

export default router
