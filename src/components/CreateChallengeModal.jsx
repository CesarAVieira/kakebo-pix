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

export default function CreateChallengeModal({ onClose, onCreate }) {
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [totalAmount, setTotalAmount] = useState('')
    const [useCustomRange, setUseCustomRange] = useState(false)
    const [minValue, setMinValue] = useState(10)
    const [maxValue, setMaxValue] = useState(200)
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (!title.trim()) {
            setError('Informe o nome do cofre')
            return
        }

        if (!totalAmount || Number(totalAmount) <= 0) {
            setError('Informe um valor total válido')
            return
        }

        if (useCustomRange && minValue >= maxValue) {
            setError('O valor mínimo deve ser menor que o máximo')
            return
        }

        setError('')

        onCreate({
            title: title.trim(),
            subtitle: subtitle.trim(),
            totalAmount: Number(totalAmount),
            minValue: useCustomRange ? Number(minValue) : 10,
            maxValue: useCustomRange ? Number(maxValue) : 200
        })
    }

    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Criar novo cofre</DialogTitle>

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
                        label="Descrição do cofre (opcional)"
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

                    <FormControlLabel
                        control={
                            <Switch
                                checked={useCustomRange}
                                onChange={e =>
                                    setUseCustomRange(e.target.checked)
                                }
                            />
                        }
                        label="Configurar valores mínimos e máximos"
                    />

                    {useCustomRange && (
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Valor mínimo"
                                type="number"
                                value={minValue}
                                onChange={e => setMinValue(e.target.value)}
                                fullWidth
                            />

                            <TextField
                                label="Valor máximo"
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
                    Criar cofre
                </Button>
            </DialogActions>
        </Dialog>
    )
}
