import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import completadaIcon from '../assets/completada.png'

const methods = [
  'Por número de tarjeta',
  'Propias',
  'Servicios'
]

export const Transferencias = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [cards, setCards] = useState([])
  const [services, setServices] = useState([])
  const [sourceId, setSourceId] = useState(null)
  const [fromAcc, setFromAcc] = useState(null)
  const [method, setMethod] = useState(methods[0])
  const [form, setForm] = useState({ destination: '', amount: '', description: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/accounts'),
      api.get('/cards'),
      api.get('/services')
    ]).then(([accRes, cardRes, svcRes]) => {
      setAccounts(accRes.data)
      setCards(cardRes.data)
      setServices(svcRes.data)
      if (accRes.data.length) setSourceId(accRes.data[0].id)
    })
  }, [])

  useEffect(() => {
    if (sourceId) {
      api.get(`/accounts/${sourceId}`)
        .then(r => setFromAcc(r.data))
    }
  }, [sourceId])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const isValid = form.destination && form.amount && form.description

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        amount: Number(form.amount),
        description: form.description
      }
      if (method === 'Propias') {
        payload.toAccountId = Number(form.destination)
      } else if (method === 'Por número de tarjeta') {
        const card = cards.find(c => c.cardNumber.replace(/\s/g, '') === form.destination.replace(/\s/g, ''))
        const destAcc = accounts.find(a => a.cardId === card?.id)
        payload.toAccountId = destAcc?.id
      } else if (method === 'Servicios') {
        payload.serviceId = Number(form.destination)
      }
      const { data } = await api.post(`/accounts/${sourceId}/transferencias`, payload)
      setSuccess(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error en la transferencia')
    }
  }

  if (!accounts.length || !fromAcc) return <p className='mt-10 text-center'>Cargando…</p>

  if (success) {
    const destName = success.service
      ? success.service.name
      : accounts.concat(services.map(s => ({ id: s.id, name: s.name })))
        .find(a => String(a.id) === String(success.credit?.accountId))?.name
    return (
      <main className='my-10 px-4 text-center'>
        <button onClick={() => navigate(-1)} className='text-gray-500 mb-4 text-xl'>&larr;</button>
        <img
            src={completadaIcon}
            alt="Transaccion completada icono"
            className='w-[150px] h-[150px] my-0 mx-auto'
          />
        <h1 className='text-purple-700 text-2xl font-bold mb-6'>¡Transferencia exitosa!</h1>
        <p className='mb-4'>
          Has transferido Q{success.debit.amount} a {destName}.
        </p>
        <button onClick={() => navigate('/')} className='bg-purple-700 text-white py-2 px-6 rounded'>
          Confirm
        </button>
      </main>
    )
  }

  return (
    <main className='my-10 px-4 max-w-md mx-auto'>
      <button onClick={() => navigate(-1)} className='text-gray-500 mb-4 text-xl'>&larr;</button>
      <h1 className='text-xl font-semibold mb-6'>Transferencia</h1>

      <label className='block text-sm font-medium mb-2'>Cuenta origen</label>
      <select
        value={sourceId}
        onChange={e => setSourceId(Number(e.target.value))}
        className='w-full border border-gray-300 rounded-lg p-2 mb-4'
      >
        {accounts.map(a => (
          <option key={a.id} value={a.id}>
            {a.name} (Q{a.balance.toLocaleString()})
          </option>
        ))}
      </select>

      <p className='text-sm text-gray-500 mb-4'>
        Saldo Disponible: <span className='font-bold'>Q{fromAcc.balance.toLocaleString()}</span>
      </p>

      <div className='flex space-x-2 overflow-x-auto mb-4'>
        {methods.map(m => (
          <button
            key={m}
            type='button'
            onClick={() => {
              setMethod(m)
              setForm({ destination: '', amount: '', description: '' })
            }}
            className={`flex-1 py-3 rounded-lg text-xs text-center ${
              method === m ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {method === 'Por número de tarjeta' && (
          <input
            name='destination'
            value={form.destination}
            onChange={handleChange}
            placeholder='0000 0000 0000 0000'
            className='w-full border border-gray-300 rounded-lg p-2'
          />
        )}
        {method === 'Propias' && (
          <select
            name='destination'
            value={form.destination}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg p-2'
          >
            <option value=''>Selecciona cuenta destino</option>
            {accounts
              .filter(a => a.id !== sourceId)
              .map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} – Q{a.balance.toLocaleString()}
                </option>
              ))}
          </select>
        )}
        {method === 'Servicios' && (
          <select
            name='destination'
            value={form.destination}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg p-2'
          >
            <option value=''>Selecciona servicio</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} – {s.accountNumber}
              </option>
            ))}
          </select>
        )}
        <input
          type='number'
          name='amount'
          min='1'
          max={fromAcc.balance}
          value={form.amount}
          onChange={handleChange}
          placeholder='Monto a transferir'
          className='w-full border border-gray-300 rounded-lg p-2'
        />
        <input
          type='text'
          name='description'
          value={form.description}
          onChange={handleChange}
          placeholder='Descripción'
          className='w-full border border-gray-300 rounded-lg p-2'
        />
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button
          type='submit'
          disabled={!isValid}
          className='w-full py-3 rounded-lg text-white bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
        >
          Confirm
        </button>
      </form>
    </main>
  )
}
