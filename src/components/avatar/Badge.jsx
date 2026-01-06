export default function Badge({ tier }) {
    if (tier === 'beginner') return null

    return (
        <div className={`player-badge badge-${tier}`}>
            {tier === 'intermediate' && <span>★</span>}
            {tier === 'advanced' && <span>◆</span>}
            {tier === 'legend' && <span>👑</span>}
        </div>
    )
}
