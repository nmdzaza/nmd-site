import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pipeline from './pages/Pipeline'
import Leads from './pages/Leads'
import Agents from './pages/Agents'
import Skills from './pages/Skills'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/skills" element={<Skills />} />
      </Route>
    </Routes>
  )
}

export default App
