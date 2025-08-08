import { useState, useEffect } from 'react'
import api from '../services/api'

export function useAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    api.get('/accounts')
      .then(r => setAccounts(r.data))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [])

  return { accounts, loading, error }
}
