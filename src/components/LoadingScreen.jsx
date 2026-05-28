import logo from '../assets/logo.png'
import '../styles/LoadingScreen.scss'

export default function LoadingScreen() {
    return (
        <main className="loading-screen" aria-busy="true" aria-live="polite">
            <div className="loading-glow loading-glow-primary" />
            <div className="loading-glow loading-glow-secondary" />

            <section className="loading-panel" aria-label="Carregando aplicativo">
                <div className="loading-logo-wrap">
                    <div className="loading-progress-ring" />
                    <img src={logo} alt="Kakebo Pix" className="loading-logo" />
                </div>

                <div className="loading-copy">
                    <span className="loading-eyebrow">Kakebo Pix</span>
                    <h1>Preparando seu cofrinho</h1>
                    <p>Sincronizando seus desafios e progresso.</p>
                </div>

                <div className="loading-bar" aria-hidden="true">
                    <span />
                </div>

                <div className="loading-steps" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>
            </section>
        </main>
    )
}
