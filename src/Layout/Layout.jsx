import Navbar from '../components/Navbar'
import '../styles/Layout.scss'

export default function Layout({ children }) {
    return (
        <div className="app-layout">
            <Navbar />

            <main className="app-content">
                {children}
            </main>
        </div>
    )
}