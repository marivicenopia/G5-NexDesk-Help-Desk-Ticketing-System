import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ApiService } from './services/api/ApiService'

function App() {
  const [count, setCount] = useState(0)
  const [tickets, setTickets] = useState<any[] | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })

  useEffect(() => {
    loadUserAndTickets()
  }, [])

  async function loadUserAndTickets() {
    setError(null)
    setLoading(true)
    try {
      const userRes = await ApiService.getCurrentUser()
      setUser(userRes.response)

      const ticketsRes = await ApiService.getTickets()
      setTickets(ticketsRes.response)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await ApiService.login(loginForm.username, loginForm.password)
      if (!res.ok) {
        setError(`Login failed (${res.status})`)
        return
      }

      await loadUserAndTickets()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    setLoading(true)
    setError(null)
    try {
      await ApiService.logout()
      setUser(null)
      setTickets(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>

        <p>
          {loading
            ? 'Loading...'
            : user
              ? `Logged in as ${user.username || user.userName || 'user'}`
              : 'Not logged in'}
        </p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!user && (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button type="submit">Login</button>
          </form>
        )}

        {user && (
          <>
            <button onClick={handleLogout}>Logout</button>

            <h3>Your Tickets</h3>
            <ul>
              {tickets?.map((t, index) => (
                <li key={index}>{t.title || `Ticket ${index + 1}`}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}

export default App
