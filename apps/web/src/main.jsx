import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FRONTEND_RESET_MARKER, resetFrontendData } from './lib/api.js'

const bootstrap = async () => {
  let forceReset = false
  let needsReset = false

  try {
    const params = new URLSearchParams(window.location.search)
    forceReset = params.get('reset') === '1'
    needsReset = forceReset || !localStorage.getItem(FRONTEND_RESET_MARKER)
  } catch {
    needsReset = true
  }

  if (needsReset) {
    await resetFrontendData()
  }

  if (forceReset) {
    const params = new URLSearchParams(window.location.search)
    params.delete('reset')
    const query = params.toString()
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    )
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()
