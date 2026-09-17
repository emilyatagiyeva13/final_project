import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../src/assets/scss/index.scss"
import './assets/scss/index.scss';
import { ThemeProvider } from './context/ThemeContext.jsx'
import Router from './router/Router.jsx'
import Aos from 'aos'

Aos.init({
  duration: 600,
  once: true,
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <Router />

    </ThemeProvider>
  </StrictMode>,
)
