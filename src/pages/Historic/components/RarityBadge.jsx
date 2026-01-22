const colors = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b'
}

export default function RarityBadge({ rarity }) {
    return (
        <span
            className="rarity-badge"
            style={{ backgroundColor: colors[rarity] }}
        >
            {rarity.toUpperCase()}
        </span>
    )
}
