import pork from '../assets/pork.png'
import '../styles/LoadingScreen.scss'

const MESSAGES = [
    'Preparando seu cofrinho',
    'Sincronizando desafios',
    'Carregando progresso',
]

export default function LoadingScreen() {
    return (
        <main className="loading-screen" aria-busy="true" aria-live="polite">
            <div className="loading-glow" aria-hidden="true" />
            <img src={pork} alt="Kakebox Pix" className="loading-pig" />
            <div className="loading-bar-area">
                <div className="loading-bar-track" aria-hidden="true">
                    <span className="loading-bar-fill" />
                </div>
                <p className="loading-status" id="loading-status">
                    {MESSAGES[0]}
                </p>
            </div>
        </main>
    )
}
