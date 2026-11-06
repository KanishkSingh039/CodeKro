import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setAuthToken } from './lib/api'

const hash = window.location.hash.replace(/^#/, '')
const token = new URLSearchParams(hash).get('token')
if (token) {
  setAuthToken(token)
  try {
    localStorage.setItem('codekro_auth', 'true')
  } catch (error) {
    void error
  }
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
