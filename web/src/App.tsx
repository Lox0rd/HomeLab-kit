import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Welcome } from './pages/Welcome'
import { Dashboard } from './pages/Dashboard'
import { Labs } from './pages/Labs'
import Metrics from './pages/Metrics'
import Docker from './pages/Docker'
import Services from './pages/Services'
import Network from './pages/Network'
import Storage from './pages/Storage'
import Security from './pages/Security'
import Backup from './pages/Backup'
import Diagnostics from './pages/Diagnostics'
import Settings from './pages/Settings'
import { AuthProvider } from './store/context'
import './styles/globals.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/docker" element={<Docker />} />
          <Route path="/services" element={<Services />} />
          <Route path="/network" element={<Network />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/security" element={<Security />} />
          <Route path="/backup" element={<Backup />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
