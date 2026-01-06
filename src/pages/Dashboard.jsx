import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../layout/Layout'
import { useAuth } from '../context/AuthContext'
import generateValues from '../utils/generateValues'
import CreateChallengeModal from '../components/CreateChallengeModal'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Tooltip from '@mui/material/Tooltip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import '../styles/Dashboard.scss'

export default function Dashboard() {
    const { user, updateUser } = useAuth()
    const navigate = useNavigate()

    const challenges = user?.challenges || []

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [challengeToDelete, setChallengeToDelete] = useState(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    })

    const calculateProgress = (grid, total) => {
        const paid = grid
            .filter(cell => cell.paid)
            .reduce((sum, cell) => sum + cell.value, 0)

        const percentage = Math.min((paid / total) * 100, 100)
        const completed = paid >= total

        return { paid, percentage, completed }
    }

    const handleCreateChallenge = async (data) => {
        const grid = generateValues({
            total: data.totalAmount,
            min: data.minValue,
            max: data.maxValue
        })

        const newChallenge = {
            id: Date.now().toString(),
            title: data.title,
            subtitle: data.subtitle || '',
            total: data.totalAmount,
            min: data.minValue,
            max: data.maxValue,
            grid,
            createdAt: new Date().toISOString()
        }

        await updateUser({
            challenges: [...challenges, newChallenge]
        })

        setIsModalOpen(false)

        setSnackbar({
            open: true,
            message: 'Cofre criado com sucesso',
            severity: 'success'
        })

        navigate(`/challenge/${newChallenge.id}`)
    }

    const confirmDeleteChallenge = async () => {
        const { completed } = calculateProgress(
            challengeToDelete.grid,
            challengeToDelete.total
        )

        if (completed) {
            setChallengeToDelete(null)
            return
        }

        const updatedChallenges = challenges.filter(
            c => c.id !== challengeToDelete.id
        )

        const updatedHistory = (user.historico || []).filter(
            h => String(h.challengeId) !== String(challengeToDelete.id)
        )

        await updateUser({
            challenges: updatedChallenges,
            historico: updatedHistory
        })

        setChallengeToDelete(null)

        setSnackbar({
            open: true,
            message: 'Cofre excluído com sucesso',
            severity: 'success'
        })
    }

    return (
        <Layout>
            <div className="dashboard-content">
                {/* HEADER */}
                <div className="dashboard-header">
                    <div className="title">
                        <h1>Meus Cofres</h1>
                        <p>
                            Bem-vindo,{' '}
                            <strong>{user?.username || 'Usuário'}</strong>.
                            Gerencie seus cofres de economia
                        </p>
                    </div>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#22c55e',
                            fontWeight: 500,
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#16a34a'
                            }
                        }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Criar cofre
                    </Button>
                </div>

                {/* GRID */}
                <div className="challenge-grid">
                    {challenges.map(challenge => {
                        const { paid, percentage, completed } =
                            calculateProgress(
                                challenge.grid,
                                challenge.total
                            )

                        return (
                            <div
                                key={challenge.id}
                                className="challenge-card"
                                onClick={() =>
                                    navigate(
                                        `/challenge/${challenge.id}`
                                    )
                                }
                            >
                                {/* BOTÃO EXCLUIR */}
                                <Tooltip
                                    title={
                                        completed
                                            ? 'Cofre concluído não pode ser excluído'
                                            : 'Excluir cofre'
                                    }
                                >
                                    <span>
                                        <IconButton
                                            className="delete"
                                            color="error"
                                            disabled={completed}
                                            onClick={e => {
                                                e.stopPropagation()
                                                setChallengeToDelete(
                                                    challenge
                                                )
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>

                                {/* HEADER DO CARD */}
                                <div className="card-header">
                                    <h3>{challenge.title}</h3>
                                    <span className="subtitle">
                                        {challenge.subtitle ||
                                            'Meu cofre de economia'}
                                    </span>
                                </div>

                                {/* PROGRESS INFO */}
                                <div className="progress-info">
                                    <span>Progresso</span>
                                    <span className="amount">
                                        R$ {paid.toLocaleString()} / R${' '}
                                        {challenge.total.toLocaleString()}
                                    </span>
                                </div>

                                {/* BARRA */}
                                <div className="progress">
                                    <div
                                        className="bar"
                                        style={{
                                            width: `${percentage}%`
                                        }}
                                    />
                                </div>

                                {/* FOOTER */}
                                <div className="card-footer">
                                    <span>Status</span>
                                    <span
                                        className={`status ${completed
                                            ? 'done'
                                            : 'active'
                                            }`}
                                    >
                                        {completed
                                            ? 'Concluído'
                                            : 'Ativo'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* MODAL DE CRIAÇÃO */}
            {isModalOpen && (
                <CreateChallengeModal
                    onClose={() => setIsModalOpen(false)}
                    onCreate={handleCreateChallenge}
                />
            )}

            {/* DIALOG DE CONFIRMAÇÃO */}
            <Dialog
                open={Boolean(challengeToDelete)}
                onClose={() => setChallengeToDelete(null)}
            >
                <DialogTitle>Excluir cofre</DialogTitle>

                <DialogContent>
                    Tem certeza que deseja excluir o cofre{' '}
                    <strong>
                        {challengeToDelete?.title}
                    </strong>
                    ?
                    <br />
                    Essa ação não poderá ser desfeita.
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setChallengeToDelete(null)
                        }
                    >
                        Cancelar
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={confirmDeleteChallenge}
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBARS */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            >
                <Alert
                    onClose={() =>
                        setSnackbarOpen(false)
                    }
                    severity="success"
                    variant="filled"
                >
                    Cofre excluído com sucesso
                </Alert>
            </Snackbar>

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
        </Layout>
    )
}
