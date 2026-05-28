import { useAuth } from './context/useAuth'
import LoadingScreen from './components/LoadingScreen'
import RoutesApp from './routes'

export default function App() {
  const { loading } = useAuth()

  if (loading) return <LoadingScreen />

  return <RoutesApp />
}
