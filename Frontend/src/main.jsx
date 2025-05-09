import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles/index.scss"
import App from './App.jsx'
import { EtablissementProvider } from '../src/Components/Context/EtablissementContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EtablissementProvider>
      <App />
    </EtablissementProvider>,
  </StrictMode>,
)
