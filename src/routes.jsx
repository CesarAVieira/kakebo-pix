import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard'
import Historico from './pages/Historico'
import Configuracoes from './pages/Configuracoes'
import Grid from './components/Grid'
import ProtectedRoute from './routes/ProtectedRoute'

import { useAuth } from './context/AuthContext'

export default function AppRoutes() {
    const { user } = useAuth()

    return (
        <BrowserRouter>
            <Routes>
                {/* Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />


                {/* Protegidas */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/challenge/:id"
                    element={
                        <ProtectedRoute>
                            <Grid />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/historico"
                    element={
                        <ProtectedRoute>
                            <Historico />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/configuracoes"
                    element={
                        <ProtectedRoute>
                            <Configuracoes />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback inteligente */}
                <Route
                    path="*"
                    element={
                        <Navigate to={user ? '/dashboard' : '/'} />
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}
