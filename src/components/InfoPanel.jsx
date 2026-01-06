export default function InfoPanel({ challenge }) {
    const currency = challenge.currency || 'R$'
    const completed =
        challenge.grid.every(cell => cell.paid)

    return (
        <div className="grid-info-panel info-panel">
            <h3>Informações do Cofre</h3>

            <ul className="info-list">
                <li>
                    <span>Estado</span>
                    <span
                        className={`status ${completed ? 'completed' : 'active'
                            }`}
                    >
                        {completed ? 'Completado' : 'Ativo'}
                    </span>
                </li>

                <li>
                    <span>Células Mínimo de</span>
                    <strong>
                        {currency} {challenge.min}
                    </strong>
                </li>

                <li>
                    <span>Células Máximo de</span>
                    <strong>
                        {currency} {challenge.max}
                    </strong>
                </li>

                <li>
                    <span>Moeda</span>
                    <strong>{currency}</strong>
                </li>
            </ul>
        </div>
    )
}