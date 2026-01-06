import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ActionsPanel() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const hasPixConfigured = Boolean(user?.pix?.chave)

    return (
        <div className="grid-info-panel actions-panel">
            <h3>Ações</h3>

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
                    className="action-button disabled"
                    disabled
                    title="Em breve"
                >
                    Editar Cofre
                </button>

            </div>
        </div>
    )
}