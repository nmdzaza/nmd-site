import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CategoryPage from './pages/CategoryPage'
import ToolDetail from './pages/ToolDetail'
import ComingSoon from './pages/ComingSoon'
import Metrics from './pages/Metrics'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/tool/:slug" element={<ToolDetail />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Route>
    </Routes>
  )
}

export default App
