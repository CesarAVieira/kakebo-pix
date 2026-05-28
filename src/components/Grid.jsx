import { useEffect, useRef, useState } from 'react'
import Layout from '../Layout/Layout'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { getRandomIndex } from '../utils/random'
import generateValues from '../utils/generateValues'
import {
    XP_BY_RARITY,
    applyXpProgress
} from '../utils/gamification'
import Fab from '@mui/material/Fab'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import ProgressPanel from '../components/ProgressPanel'
import InfoPanel from '../components/InfoPanel'
import ActionsPanel from '../components/ActionsPanel'
import PlayerPanel from '../components/PlayerPanel'
import XpFloat from '../components/XpFloat'
import LevelUpModal from '../components/LevelUpModal'
import CreateChallengeModal from '../components/CreateChallengeModal'
import Cell from './Cell'
import PixModal from './PixModal'
import ScratchCard from '../components/ScratchCard'
import './grid.scss'
import '../styles/gamification.scss'

export default function Grid() {
    const { id } = useParams()
    const { user, updateUser } = useAuth()
    const [focus] = useState(false)

    const challenges = user?.challenges || []
    const challenge = challenges.find(c => c.id === id)
    const [xpFloat, setXpFloat] = useState(null)
    const [levelUp, setLevelUp] = useState(null)

    const [selectedCell, setSelectedCell] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    })
    const gridScrollRef = useRef(null)
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    useEffect(() => {
        const onScroll = () => {
            setShowScrollTop(window.scrollY > 300)
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    /* ===============================
       Raspadinha
    ================================ */

    const scratchLockRef = useRef(false)
    const [isScratchPayment, setIsScratchPayment] = useState(false)
    const [isClosingScratch, setIsClosingScratch] = useState(false)
    const scratch = challenge?.scratch ?? null

    const scratchCell = scratch
        ? { value: scratch.value, index: scratch.index }
        : null

    // const showScratch = Boolean(scratch && !selectedCell)
    const showScratch = Boolean(
        scratch &&
        !selectedCell &&
        !isClosingScratch
    )

    const getScratchRarity = (value) => {
        if (!challenge?.max) return 'common'
        if (value >= challenge.max * 0.9) return 'legendary'
        if (value >= challenge.max * 0.6) return 'rare'
        return 'common'
    }

    const scratchRarity = scratch
        ? getScratchRarity(scratch.value)
        : null

    const isSameDay = (dateA, dateB) => {
        const a = new Date(dateA)
        const b = new Date(dateB)

        return (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        )
    }

    const hasUsedScratchToday = () => {
        if (!challenge?.lastScratchDate) return false
        return isSameDay(challenge.lastScratchDate, new Date())
    }

    const handleScratchClick = async () => {
        if (scratchLockRef.current) return
        scratchLockRef.current = true

        if (hasUsedScratchToday()) {
            alert('Você já usou a raspadinha de hoje 🎟️')
            return
        }

        const unpaidCells = challenge.grid
            .map((cell, index) => ({ ...cell, index }))
            .filter(cell => !cell.paid)

        if (unpaidCells.length === 0) {
            alert('Não há valores pendentes 🎉')
            return
        }

        const randomIndex = getRandomIndex(unpaidCells.length)
        const selected = unpaidCells[randomIndex]

        const updatedChallenges = challenges.map(c => {
            if (c.id !== id) return c

            return {
                ...c,
                scratch: {
                    value: selected.value,
                    index: selected.index
                },
            }
        })

        await updateUser({ challenges: updatedChallenges })
    }

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

    const hasAnyPayment = challenge.grid.some(cell => cell.paid)
    const canEditChallenge = !hasAnyPayment

    const handleUpdateChallenge = async (data) => {
        if (!canEditChallenge) {
            setSnackbar({
                open: true,
                message: 'Este cofre ja recebeu pagamentos e nao pode ser editado',
                severity: 'warning'
            })
            setIsEditModalOpen(false)
            return
        }

        let grid

        try {
            grid = generateValues({
                total: data.totalAmount,
                min: challenge.min,
                max: challenge.max
            })
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message || 'Nao foi possivel editar o cofre',
                severity: 'error'
            })
            return
        }

        const updatedChallenges = challenges.map(c => {
            if (c.id !== id) return c

            return {
                ...c,
                title: data.title,
                subtitle: data.subtitle || '',
                total: data.totalAmount,
                grid,
                scratch: null,
                updatedAt: new Date().toISOString()
            }
        })

        await updateUser({ challenges: updatedChallenges })

        setIsEditModalOpen(false)
        setSnackbar({
            open: true,
            message: 'Cofre atualizado com sucesso',
            severity: 'success'
        })
    }

    /* ===============================
       PAGAMENTO
    ================================ */
    const confirmPayment = async () => {
        if (!selectedCell) return
        // 1️⃣ Define raridade
        const rarity =
            selectedCell.value >= challenge.max * 0.9
                ? 'legendary'
                : selectedCell.value >= challenge.max * 0.6
                    ? 'rare'
                    : 'common'

        // 2️⃣ XP ganho
        const baseXp = XP_BY_RARITY[rarity]
        const earnedXp = isScratchPayment ? baseXp * 2 : baseXp

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
                scratch: null,
                lastScratchDate: new Date().toISOString(),
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
                    xp: earnedXp,
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
        setIsScratchPayment(false)
        scratchLockRef.current = false
    }

    const cancelScratch = async () => {
        setIsClosingScratch(true)
        setSelectedCell(null)
        scratchLockRef.current = false

        setTimeout(async () => {
            const updatedChallenges = challenges.map(c => {
                if (c.id !== id) return c

                return {
                    ...c,
                    scratch: null
                }
            })

            await updateUser({ challenges: updatedChallenges })

            setIsClosingScratch(false)
        }, 120)
    }

    return (
        <Layout>
            <div className={`grid-page ${focus ? 'focus-mode' : ''}`}>
                <div className="grid-layout">



                    {/* ===============================
           PAINÉIS
        ================================ */}
                    <div className="grid-panels-layout">

                        <div
                            className={`
                                panel-progress
                                ${showScratch ? 'scratch-mode' : ''}
                                ${scratchRarity ? `rarity-${scratchRarity}` : ''}
                            `}>
                            {showScratch && (
                                <div className="double-xp-badge">
                                    <span className="xp">XP</span>
                                    <span className="text">EM DOBRO</span>
                                </div>
                            )}
                            {showScratch && (
                                <button
                                    className="scratch-close-panel"
                                    onClick={cancelScratch}
                                    aria-label="Fechar raspadinha"
                                >
                                    ✕
                                </button>
                            )}
                            {!hasUsedScratchToday() && !scratch && (
                                <div className="scratch-tooltip-wrapper">
                                    <button
                                        className="scratch-toggle"
                                        onClick={handleScratchClick}
                                    >
                                        🎲
                                    </button>

                                    <div className="scratch-tooltip">
                                        <strong>🎲 Sorteie o valor de hoje</strong>
                                        <span>
                                            Utilize nossa raspadinha para revelar o valor de pagamento.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {showScratch && scratchCell ? (
                                <ScratchCard
                                    hiddenContent={
                                        `💸 O valor a ser pago hoje é R$ ${scratchCell.value.toFixed(2)}`
                                    }
                                    revealThreshold={65}
                                    onComplete={() => {
                                        setIsScratchPayment(true)

                                        setSelectedCell({
                                            ...scratchCell,
                                            xpPosition: {
                                                x: window.innerWidth / 2,
                                                y: 120
                                            }
                                        })
                                    }}
                                />
                            ) : (
                                <ProgressPanel challenge={challenge} />
                            )}
                        </div>


                        <div className="panel-player">
                            <PlayerPanel />
                        </div>

                        <div className="panel-actions compact">
                            <ActionsPanel
                                canEditChallenge={canEditChallenge}
                                onEditChallenge={() => setIsEditModalOpen(true)}
                            />
                        </div>

                        <div className="panel-info">
                            <InfoPanel challenge={challenge} />
                        </div>

                    </div>

                    {/* ===============================
           GRID
        ================================ */}
                    <div className="grid-container" ref={gridScrollRef}>
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
                        onClose={cancelScratch}
                        onConfirm={confirmPayment}
                    />
                )}

                {isEditModalOpen && (
                    <CreateChallengeModal
                        initialChallenge={challenge}
                        onClose={() => setIsEditModalOpen(false)}
                        onCreate={handleUpdateChallenge}
                    />
                )}

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
                    }
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                >
                    <Alert
                        onClose={() =>
                            setSnackbar({
                                ...snackbar,
                                open: false
                            })
                        }
                        severity={snackbar.severity}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </div>

            {/* ===============================
         Scroll Button Top
      ================================ */}
            {showScrollTop && (
                <Fab
                    color="primary"
                    size="medium"
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                    }
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        zIndex: 1200,
                        color: '#fff',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        '&:hover': {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)'
                        },
                        backdropFilter: 'blur(6px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                        animation: 'fabFadeIn 0.25s ease'
                    }}
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            )}
        </Layout>
    )
}
