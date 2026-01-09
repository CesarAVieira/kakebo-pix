export default function ProgressPanel({ challenge }) {
    const total = challenge.total || 0

    const paidValue = challenge.grid
        .filter(cell => cell.paid)
        .reduce((sum, cell) => sum + cell.value, 0)

    const remaining = total - paidValue
    const progress = total > 0 ? Math.round((paidValue / total) * 100) : 0

    return (
        <div className="grid-info-panel progress-panel">
            <div className="challenge-header">
                <h2>{challenge.title}</h2>

                {challenge.subtitle && (
                    <p className="subtitle">{challenge.subtitle}</p>
                )}
            </div>

            <div className="progress-circle">
                <svg viewBox="0 0 36 36">
                    <path
                        className="circle-bg"
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className="circle"
                        strokeDasharray={`${progress}, 100`}
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>

                <div className="progress-text">
                    <strong>{progress}%</strong>
                    <span>Completado</span>
                </div>
            </div>

            <div className="progress-values">
                <div>
                    <span>Depositado</span>
                    <strong>
                        {challenge.currency || 'R$'} {paidValue.toLocaleString()}
                    </strong>
                </div>

                <div>
                    <span>Falta</span>
                    <strong>
                        {challenge.currency || 'R$'} {remaining.toLocaleString()}
                    </strong>
                </div>

                <div className="goal">
                    <span>Meta</span>
                    <strong>
                        {challenge.currency || 'R$'} {total.toLocaleString()}
                    </strong>
                </div>
            </div>
        </div>
    )
}
