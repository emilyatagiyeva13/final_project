import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './router/router.jsx'
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../src/assets/scss/index.scss"
import './assets/scss/index.scss';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
