import { useAuth } from '../context/AuthContext'
import Avatar from './avatar/Avatar'
import { getXpForNextLevel } from '../utils/gamification'

function getPlayerTitle(level) {
    if (level >= 50) return 'Lenda da Economia'
    if (level >= 30) return 'Mestre da Disciplina'
    if (level >= 15) return 'Guardião do Cofre'
    if (level >= 5) return 'Economista Iniciante'
    return 'Aprendiz'
}

function getLevelTier(level) {
    if (level >= 30) return 'legend'
    if (level >= 15) return 'advanced'
    if (level >= 5) return 'intermediate'
    return 'beginner'
}

export default function PlayerPanel() {
    const { user } = useAuth()
    const { level, xp, totalXp } = user.gamification

    const tier = getLevelTier(level)
    const xpNext = getXpForNextLevel(level)
    const progress = Math.min((xp / xpNext) * 100, 100)

    return (
        <div
            key={`${tier}-${totalXp}`}
            className={`player-panel level-${tier}`}
        >
            <div
                className={`player-header ${totalXp > 0 ? 'xp-gain' : ''
                    } tier-${tier}`}
            >
                <Avatar tier={tier} />
                <div className="player-meta">
                    <span className="player-level">Nível {level}</span>
                    <span className="player-title">
                        {getPlayerTitle(level)}
                    </span>
                </div>
            </div>

            <div className="xp-bar">
                <div
                    className="xp-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="player-footer">
                <span>{xp} / {xpNext} XP</span>
                <span className="total-xp">{totalXp} XP</span>
            </div>
        </div>
    )
}
