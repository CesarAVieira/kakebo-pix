import Avatar from './avatar/Avatar'

function getLevelTier(level) {
    if (level >= 30) return 'legend'
    if (level >= 15) return 'advanced'
    if (level >= 5) return 'intermediate'
    return 'beginner'
}

export default function LevelUpModal({ level, onClose }) {
    const tier = getLevelTier(level)

    return (
        <div className="levelup-backdrop">
            <div className="levelup-modal">
                <span className="levelup-badge">LEVEL UP</span>

                {/* Avatar + Badge */}
                <div className="levelup-avatar">
                    <Avatar tier={tier} />
                </div>

                <strong>Nível {level}</strong>

                <p>Continue economizando 🔥</p>

                <button onClick={onClose}>
                    Continuar
                </button>
            </div>
        </div>
    )
}
