import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import { validateChallengeConfig } from '../utils/generateValues'

export default function CreateChallengeModal({
    initialChallenge = null,
    onClose,
    onCreate
}) {
    const isEditing = Boolean(initialChallenge)
    const [title, setTitle] = useState(initialChallenge?.title || '')
    const [subtitle, setSubtitle] = useState(initialChallenge?.subtitle || '')
    const [totalAmount, setTotalAmount] = useState(
        initialChallenge?.total?.toString() || ''
    )
    const [useCustomRange, setUseCustomRange] = useState(false)
    const [minValue, setMinValue] = useState(initialChallenge?.min || 10)
    const [maxValue, setMaxValue] = useState(initialChallenge?.max || 200)
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (!title.trim()) {
            setError('Informe o nome do cofre')
            return
        }

        const nextMinValue = isEditing || useCustomRange ? Number(minValue) : 10
        const nextMaxValue = isEditing || useCustomRange ? Number(maxValue) : 200
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
                        label="Valor total do cofre"
                        type="number"
                        value={totalAmount}
                        onChange={e => {
                            setTotalAmount(e.target.value)
                            setError('')
                        }}
                        fullWidth
                    />

                    {!isEditing && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={useCustomRange}
                                    onChange={e =>
                                        setUseCustomRange(e.target.checked)
                                    }
                                />
                            }
                            label="Configurar valores minimos e maximos"
                        />
                    )}

                    {!isEditing && useCustomRange && (
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Valor minimo"
                                type="number"
                                value={minValue}
                                onChange={e => setMinValue(e.target.value)}
                                fullWidth
                            />

                            <TextField
                                label="Valor maximo"
                                type="number"
                                value={maxValue}
                                onChange={e => setMaxValue(e.target.value)}
                                fullWidth
                            />
                        </Stack>
                    )}
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
