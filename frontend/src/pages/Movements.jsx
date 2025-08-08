import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import debitoIcon from '../assets/debito.png'
import creditoIcon from '../assets/credito.png'

export const Movements = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [account, setAccount] = useState(null)
  const [card, setCard] = useState(null)
  const [movs, setMovs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/accounts/${id}`)
      .then(res => {
        setAccount(res.data)
        return api.get(`/cards/${res.data.cardId}`)
      })
      .then(res => {
        setCard(res.data)
        return api.get(`/accounts/${id}/movements`)
      })
      .then(res => setMovs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando movimientos…</p>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const sections = movs.reduce((acc, m) => {
    const d = m.date.split('T')[0]
    const key =
      d === today
        ? 'Today'
        : d === yesterday
        ? 'Yesterday'
        : new Date(d).toLocaleDateString('es-GT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
    acc[key] = acc[key] || []
    acc[key].push(m)
    return acc
  }, {})

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-purple-700 flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-white text-2xl">
          &larr;
        </button>
        <h1 className="text-white text-lg sm:text-xl font-semibold">Movimientos</h1>
        <div className="w-6" />
      </header>

      <main className="flex-1 overflow-auto px-4 py-6">
        <div className="mx-auto w-full max-w-md bg-white rounded-lg shadow p-4">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{card.name}</p>
          <p className="mt-2 text-sm tracking-widest">
            {`${card.cardNumber.split(' ')[0]} •••• •••• ${
              card.cardNumber.split(' ')[3]
            }`}
          </p>
          <p className="mt-2 text-lg font-bold">
            Q{account.balance.toLocaleString()}
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {Object.entries(sections).map(([sec, items]) => (
            <section key={sec}>
              <h2 className="text-gray-500 uppercase text-xs mb-2">{sec}</h2>
              <div className="space-y-4">
                {items.map(m => (
                  <div
                    key={m.id}
                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <img
                          src={m.type === 'debit' ? debitoIcon : creditoIcon}
                          alt={m.type === 'debit' ? 'Débito' : 'Crédito'}
                          className="w-6 h-6"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{m.description}</p>
                        <p className="text-xs text-gray-400">{m.category}</p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${
                        m.type === 'debit' ? 'text-red-500' : 'text-blue-500'
                      }`}
                    >
                      {m.type === 'debit'
                        ? `- Q${m.amount}`
                        : `+ Q${m.amount}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
