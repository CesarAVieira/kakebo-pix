import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ActionsPanel({ canEditChallenge, onEditChallenge }) {
    const navigate = useNavigate()
    const { user } = useAuth()

    const hasPixConfigured = Boolean(user?.pix?.chave)

    return (
        <div className="grid-info-panel actions-panel">
            <h3>Acoes</h3>

            <div className="actions-list">
                <button
                    className="action-button"
                    onClick={() => navigate('/configuracoes')}
                >
                    {hasPixConfigured
                        ? 'Editar PIX'
                        : 'Configurar PIX'}
                </button>

                <button
                    className={`action-button ${canEditChallenge ? '' : 'disabled'}`}
                    disabled={!canEditChallenge}
                    title={
                        canEditChallenge
                            ? 'Editar cofre'
                            : 'Disponivel apenas antes do primeiro pagamento'
                    }
                    onClick={onEditChallenge}
                >
                    Editar Cofre
                </button>
            </div>
        </div>
    )
}
