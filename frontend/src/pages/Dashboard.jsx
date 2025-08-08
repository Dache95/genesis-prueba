import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import campanaIcon from '../assets/campana.png'

export const Dashboard = () => {
  const { user, logout } = useAuth()
  const [account, setAccount] = useState(null)
  const [card, setCard] = useState(null)

  useEffect(() => {
    api.get('/accounts/me')
      .then(res => {
        setAccount(res.data)
        return api.get(`/cards/${res.data.cardId}`)
      })
      .then(res => setCard(res.data))
      .catch(err => console.error('Error al cargar datos:', err))
  }, [])

  if (!account || !card) {
    return <p className="min-h-screen flex items-center justify-center text-gray-500">Cargando datos…</p>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-purple-700 px-4 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg="
            alt="User profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-white text-lg">Hola, {user.name}</span>
        </div>
        <img src={campanaIcon} alt="Campana" className="w-6 h-6" />
      </header>

      <main className="flex-1 overflow-auto px-4 py-6">
        <div className="mx-auto w-full max-w-md bg-blue-500 rounded-lg p-6 shadow">
          <p className="text-white text-2xl font-semibold">{user.name}</p>
          <p className="text-white text-sm mt-2">{card.level}</p>
          <p className="text-white text-sm">{card.cardNumber}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-white text-lg font-bold">Q{account.balance.toLocaleString()}</span>
            <span className="text-white text-lg font-bold">{card.type}</span>
          </div>
        </div>

        <nav className="mt-6 flex justify-between max-w-md mx-auto">
          <Link
            to="/account"
            className="flex-1 text-center py-2 mx-1 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            Cuenta
          </Link>
          <Link
            to={`/account/${account.id}/transferencias`}
            className="flex-1 text-center py-2 mx-1 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            Transferencias
          </Link>
          <Link
            to={`/account/${account.id}/movements`}
            className="flex-1 text-center py-2 mx-1 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            Movimientos
          </Link>
        </nav>
      </main>

      <footer className="px-4 py-4">
        <button
          onClick={logout}
          className="w-full max-w-md mx-auto block bg-red-600 text-white py-3 rounded-lg text-center font-medium"
        >
          Cerrar Sesión
        </button>
      </footer>
    </div>
  )
}
