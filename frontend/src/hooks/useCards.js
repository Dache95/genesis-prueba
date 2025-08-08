import { useState, useEffect } from 'react'
import api from '../services/api'

export function useCards() {
  const [cards, setCards]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/cards')
      .then(r => setCards(r.data))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [])

  return { cards, loading, error }
}
