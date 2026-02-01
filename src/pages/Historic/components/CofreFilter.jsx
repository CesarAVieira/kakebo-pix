export default function CofreFilter({
    challenges,
    selectedCofres,
    onToggle
}) {
    return (
        <div className="cofre-filter premium-card">
            <div className="cofre-filter-scroll">
                {challenges.map(cofre => {
                    const active = selectedCofres.includes(cofre.id)

                    return (
                        <button
                            key={cofre.id}
                            className={`cofre-chip ${active ? 'active' : ''}`}
                            onClick={() => onToggle(cofre.id)}
                        >
                            {cofre.title}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
