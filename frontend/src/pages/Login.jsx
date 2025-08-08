import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import loginIcon from '../assets/login.png'

const Login = () => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const { login, loading }      = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login(email, password)
    if (res.ok) navigate('/', { replace: true })
    else setError(res.error)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-6'>
        <div>
          <h2 className='text-center text-purple-700 text-3xl sm:text-4xl font-bold'>Bienvenido</h2>
          <p className='mt-2 text-center text-gray-700'>Hola, inicia sesión para continuar</p>
        </div>

        <div className='flex justify-center'>
          <img
            src={loginIcon}
            alt='Login icono'
            className='w-40 h-40 sm:w-56 sm:h-56'
          />
        </div>

        <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
          <div>
            <label htmlFor='email-input' className='sr-only'>Usuario</label>
            <input
              id='email-input'
              name='email'
              type='email'
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='Usuario'
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
            />
          </div>
          <div>
            <label htmlFor='password-input' className='sr-only'>Contraseña</label>
            <input
              id='password-input'
              name='password'
              type='password'
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Contraseña'
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
            />
          </div>
          <div>
            <button
              type='submit'
              disabled={loading}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50'
            >
              {loading ? 'Entrando…' : 'Sign in'}
            </button>
          </div>
          {error && <p className='text-center text-red-500 text-sm'>{error}</p>}
        </form>

        <p className='mt-4 text-center text-sm text-gray-600'>
          ¿No tienes una cuenta?{' '}
          <span className='font-medium text-purple-700 hover:underline cursor-pointer'>
            Registrarse
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
