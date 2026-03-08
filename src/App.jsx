import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CategoryPage from './pages/CategoryPage'
import ToolDetail from './pages/ToolDetail'
import Pricing from './pages/Pricing'
import ComingSoon from './pages/ComingSoon'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/tool/:slug" element={<ToolDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Route>
    </Routes>
  )
}

export default App
