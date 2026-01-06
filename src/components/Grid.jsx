import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import {
    XP_BY_RARITY,
    applyXpProgress
} from '../utils/gamification'
import ProgressPanel from '../components/ProgressPanel'
import InfoPanel from '../components/InfoPanel'
import ActionsPanel from '../components/ActionsPanel'
import PlayerPanel from '../components/PlayerPanel'
import XpFloat from '../components/XpFloat'
import LevelUpModal from '../components/LevelUpModal'
import Cell from './Cell'
import PixModal from './PixModal'
import Pork from '../assets/pork.png'
import './grid.scss'
import '../styles/gamification.scss'

export default function Grid() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, updateUser } = useAuth()
    const [focus] = useState(false)

    const challenges = user?.challenges || []
    const challenge = challenges.find(c => c.id === id)
    const [xpFloat, setXpFloat] = useState(null)
    const [levelUp, setLevelUp] = useState(null)

    const [selectedCell, setSelectedCell] = useState(null)

    if (!challenge) {
        return <p>Cofre não encontrado.</p>
    }

    /* ===============================
       PROGRESSO
    ================================ */
    const total = challenge.total || 0

    const paidValue = challenge.grid
        .filter(cell => cell.paid)
        .reduce((sum, cell) => sum + cell.value, 0)

    const progress =
        total > 0
            ? Math.round((paidValue / total) * 100)
            : 0

    /* ===============================
       PAGAMENTO
    ================================ */
    const confirmPayment = async () => {
        // 1️⃣ Define raridade
        const rarity =
            selectedCell.value >= challenge.max * 0.9
                ? 'legendary'
                : selectedCell.value >= challenge.max * 0.6
                    ? 'rare'
                    : 'common'

        // 2️⃣ XP ganho
        const earnedXp = XP_BY_RARITY[rarity]

        // 3️⃣ Atualiza gamificação
        const previousLevel = user.gamification.level

        const updatedGamification = applyXpProgress(
            user.gamification,
            earnedXp
        )

        if (updatedGamification.level > previousLevel) {
            setLevelUp(updatedGamification.level)
        }

        // 4️⃣ Atualiza grid
        const updatedChallenges = challenges.map(c => {
            if (c.id !== id) return c

            return {
                ...c,
                grid: c.grid.map((cell, index) =>
                    index === selectedCell.index
                        ? { ...cell, paid: true }
                        : cell
                )
            }
        })

        // 5️⃣ Salva no Firebase
        await updateUser({
            challenges: updatedChallenges,
            gamification: updatedGamification,
            historico: [
                ...(user.historico || []),
                {
                    value: selectedCell.value,
                    date: new Date().toISOString(),
                    challengeId: id,
                    challengeName: challenge.title,
                    rarity,
                    xp: earnedXp
                }
            ]
        })

        // 6️⃣ XP flutuante (feedback visual)
        setXpFloat({
            value: earnedXp,
            x: selectedCell.xpPosition.x,
            y: selectedCell.xpPosition.y
        })

        setTimeout(() => {
            setXpFloat(null)
        }, 900)

        // 7️⃣ Fecha modal
        setSelectedCell(null)
    }


    return (
        <div className={`grid-page ${focus ? 'focus-mode' : ''}`}>
            <div className="grid-layout">

                {/* ===============================
           HEADER
        ================================ */}
                <div className="grid-header">
                    <button
                        className="back-inline"
                        onClick={() => navigate('/dashboard')}
                    >
                        ← Voltar
                    </button>

                    <Box
                        component="img"
                        src={Pork}
                        alt="Porquinho"
                        sx={{ height: 56 }}
                    />
                    {/* <div className="grid-header-icon">🐷</div> */}

                    <div className="grid-header-text">
                        <h1>{challenge.title}</h1>
                        {challenge.subtitle && (
                            <p className="subtitle">{challenge.subtitle}</p>
                        )}
                    </div>
                </div>

                {/* ===============================
           PAINÉIS
        ================================ */}
                <div className="grid-panels-layout">

                    <div className="panel-progress">
                        <ProgressPanel challenge={challenge} />
                    </div>

                    <div className="panel-player">
                        <PlayerPanel />
                    </div>

                    <div className="panel-actions compact">
                        <ActionsPanel challenge={challenge} />
                    </div>

                    <div className="panel-info">
                        <InfoPanel challenge={challenge} />
                    </div>

                </div>

                {/* ===============================
           GRID
        ================================ */}
                <div className="grid-container">
                    <div className={`grid progress-${progress}`}>
                        {challenge.grid.map((cell, index) => (
                            <Cell
                                key={index}
                                value={cell.value}
                                paid={cell.paid}
                                rarity={
                                    cell.value >= challenge.max * 0.9
                                        ? 'legendary'
                                        : cell.value >= challenge.max * 0.6
                                            ? 'rare'
                                            : 'common'
                                }
                                onClick={(e) => {
                                    if (cell.paid) return

                                    const rect = e.currentTarget.getBoundingClientRect()

                                    setSelectedCell({
                                        ...cell,
                                        index,
                                        xpPosition: {
                                            x: rect.left + rect.width / 2,
                                            y: rect.top
                                        }
                                    })
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* ===============================
   LEGENDA DE RARIDADE
================================ */}
                <div className="grid-container-wrapper">
                    <div className="grid-legend">
                        <div className="legend-item common">
                            <span className="legend-dot" />
                            <span>Comum</span>
                        </div>

                        <div className="legend-item rare">
                            <span className="legend-dot" />
                            <span>Rara</span>
                        </div>

                        <div className="legend-item legendary">
                            <span className="legend-dot" />
                            <span>Lendária</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===============================
            XP FLOAT
      ================================ */}
            {xpFloat && (
                <XpFloat
                    value={xpFloat.value}
                    x={xpFloat.x}
                    y={xpFloat.y}
                />
            )}

            {/* ===============================
         LEVEL UP MODAL
      ================================ */}

            {levelUp && (
                <LevelUpModal
                    level={levelUp}
                    onClose={() => setLevelUp(null)}
                />
            )}



            {/* ===============================
         MODAL PIX
      ================================ */}
            {selectedCell && (
                <PixModal
                    value={selectedCell.value}
                    onClose={() => setSelectedCell(null)}
                    onConfirm={confirmPayment}
                />
            )}
        </div>
    )
}
