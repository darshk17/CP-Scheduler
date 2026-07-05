import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/style.css'
import './styles/calendar.css'
import './styles/contests.css'
import App from './App.jsx'

// Application Root mounting point
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)