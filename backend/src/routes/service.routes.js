import express from 'express'
import { serviceAccounts } from '../data/store.js'
const router = express.Router()
router.get('/', (req, res) => res.json(serviceAccounts))
export default router
