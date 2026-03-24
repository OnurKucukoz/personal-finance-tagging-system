import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './app/AppLayout'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>
    </Routes>
  )
}
