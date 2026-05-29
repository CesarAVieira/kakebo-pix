import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import MenuItem from '@mui/material/MenuItem'
import {
    AVAILABLE_CHALLENGE_TOTALS,
    validateChallengeConfig
} from '../utils/generateValues'

export default function CreateChallengeModal({
    initialChallenge = null,
    onClose,
    onCreate
}) {
    const isEditing = Boolean(initialChallenge)
    const [title, setTitle] = useState(initialChallenge?.title || '')
    const [subtitle, setSubtitle] = useState(initialChallenge?.subtitle || '')
    const [totalAmount, setTotalAmount] = useState(
        initialChallenge?.total?.toString() ||
        AVAILABLE_CHALLENGE_TOTALS[0].toString()
    )
    const [error, setError] = useState('')
    const minValue = initialChallenge?.min || 10
    const maxValue = initialChallenge?.max || 200
    const numericTotalAmount = Number(totalAmount)
    const totalOptions =
        isEditing &&
            Number.isFinite(numericTotalAmount) &&
            !AVAILABLE_CHALLENGE_TOTALS.includes(numericTotalAmount)
            ? [numericTotalAmount, ...AVAILABLE_CHALLENGE_TOTALS]
            : AVAILABLE_CHALLENGE_TOTALS

    const handleSubmit = () => {
        if (!title.trim()) {
            setError('Informe o nome do cofre')
            return
        }

        const nextMinValue = isEditing ? Number(minValue) : 10
        const nextMaxValue = isEditing ? Number(maxValue) : 200
        const configError = validateChallengeConfig({
            total: totalAmount,
            min: nextMinValue,
            max: nextMaxValue
        })

        if (configError) {
            setError(configError)
            return
        }

        setError('')

        onCreate({
            title: title.trim(),
            subtitle: subtitle.trim(),
            totalAmount: Number(totalAmount),
            minValue: nextMinValue,
            maxValue: nextMaxValue
        })
    }

    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {isEditing ? 'Editar cofre' : 'Criar novo cofre'}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label="Nome do cofre"
                        value={title}
                        onChange={e => {
                            setTitle(e.target.value)
                            setError('')
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Descricao do cofre (opcional)"
                        value={subtitle}
                        onChange={e => setSubtitle(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Valor total do cofre"
                        value={totalAmount}
                        onChange={e => {
                            setTotalAmount(e.target.value)
                            setError('')
                        }}
                        fullWidth
                    >
                        {totalOptions.map(value => (
                            <MenuItem key={value} value={value.toString()}>
                                R$ {value.toLocaleString('pt-BR')}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                >
                    {isEditing ? 'Salvar alteracoes' : 'Criar cofre'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
