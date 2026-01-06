import { useAuth } from './context/AuthContext'
import RoutesApp from './routes'

export default function App() {
  const { loading } = useAuth()

  if (loading) return <p>Carregando...</p>

  return <RoutesApp />
}

