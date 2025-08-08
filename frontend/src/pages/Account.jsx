import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAccounts } from '../hooks/useAccounts'
import { useCards }    from '../hooks/useCards'

export const Account = () => {
  const { user } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()
  const isAccount = location.pathname === '/account'
  const { accounts, loading: loadingAcc } = useAccounts()
  const { cards,    loading: loadingCard } = useCards()

  if (loadingAcc || loadingCard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando cuentas…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center px-4 py-4 bg-white shadow">
        <button onClick={() => navigate(-1)} className="text-gray-500 text-2xl mr-4">&larr;</button>
        <h1 className="text-xl font-semibold">Cuentas</h1>
      </header>

      <nav className="flex justify-center space-x-4 bg-white py-3">
        <Link
          to="/account"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isAccount ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Cuentas
        </Link>
        <Link
          to="/cards"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            !isAccount ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Tarjetas
        </Link>
      </nav>

      <main className="flex-1 overflow-auto px-4 py-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg="
            alt="Foto de perfil"
            className="w-16 h-16 rounded-full"
          />
          <p className="mt-2 text-purple-700 text-lg font-semibold">{user.name}</p>
        </div>

        <div className="space-y-4">
          {accounts.map(acc => {
            const card = cards.find(c => c.id === acc.cardId)
            return (
              <div key={acc.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                <div>
                  <p className="text-base font-medium">{acc.name}</p>
                  <p className="text-xs text-gray-500">Saldo</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{card?.cardNumber}</p>
                  <p className="mt-1 text-purple-700 font-semibold">
                    Q{acc.balance.toLocaleString()}.00
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
