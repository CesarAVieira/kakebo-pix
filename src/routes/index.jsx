import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import Home from '../pages/Home'
import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'

export default function RoutesApp() {
    const { user } = useAuth()

    return (
        <BrowserRouter>
            <Routes>
                {/* PÚBLICAS */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* PROTEGIDAS */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* FALLBACK */}
                <Route
                    path="*"
                    element={
                        <Navigate to={user ? '/dashboard' : '/'} replace />
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}
