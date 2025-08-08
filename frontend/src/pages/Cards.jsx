import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export const Cards = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isCards = location.pathname === '/cards'

  const [cards, setCards] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/cards'), api.get('/accounts')])
      .then(([cardsRes, accRes]) => {
        setCards(cardsRes.data)
        setAccounts(accRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando tarjetas…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center px-4 py-4 bg-white shadow">
        <button onClick={() => navigate(-1)} className="text-gray-500 text-2xl mr-4">&larr;</button>
        <h1 className="text-xl font-semibold">Tarjetas</h1>
      </header>

      <nav className="flex justify-center space-x-4 bg-white py-3">
        <Link
          to="/account"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            !isCards ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Cuentas
        </Link>
        <Link
          to="/cards"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isCards ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Tarjetas
        </Link>
      </nav>

      <main className="flex-1 overflow-auto px-4 py-6">
        <div className="space-y-6">
          {cards.map(card => {
            const account = accounts.find(a => a.cardId === card.id) || {}
            const blocks = card.cardNumber.split(' ')
            const masked = `${blocks[0]} •••• •••• ${blocks[blocks.length - 1]}`
            const balance = account.balance?.toLocaleString('es-GT', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            const bgGradient =
              card.type === 'VISA'
                ? 'from-blue-700 to-blue-400'
                : 'from-yellow-500 to-yellow-300'

            return (
              <div
                key={card.id}
                className={`w-full max-w-md mx-auto p-6 rounded-xl shadow text-white bg-gradient-to-r ${bgGradient}`}
              >
                <p className="text-xl font-semibold">{user.name}</p>
                <p className="mt-1 text-sm">{card.name}</p>
                <p className="mt-4 text-lg tracking-widest">{masked}</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lg font-bold">Q{balance}</p>
                  <p className="text-sm font-semibold">{card.type}</p>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
