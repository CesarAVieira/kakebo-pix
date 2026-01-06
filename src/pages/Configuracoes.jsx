import Layout from '../layout/Layout'
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
    Divider,
    Snackbar,
    Alert
} from '@mui/material'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Configuracoes() {
    const { user, updateUser } = useAuth()

    const [pixKey, setPixKey] = useState(user?.pix?.chave ?? '')
    const [pixName, setPixName] = useState(user?.pix?.nome ?? '')
    const [pixCity, setPixCity] = useState(user?.pix?.cidade ?? '')
    const [success, setSuccess] = useState(false)

    const handleSave = async () => {
        await updateUser({
            pix: {
                chave: pixKey,
                nome: pixName,
                cidade: pixCity
            }
        })

        setSuccess(true)
    }

    return (
        <Layout>
            <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Configurações
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary">
                        Configuração da chave PIX
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={2}>
                        <TextField
                            label="Chave PIX"
                            value={pixKey}
                            onChange={e => setPixKey(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="Nome do recebedor"
                            value={pixName}
                            onChange={e => setPixName(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="Cidade"
                            value={pixCity}
                            onChange={e => setPixCity(e.target.value)}
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSave}
                        >
                            Salvar configurações
                        </Button>
                    </Stack>
                </Paper>

                <Snackbar
                    open={success}
                    autoHideDuration={3000}
                    onClose={() => setSuccess(false)}
                >
                    <Alert severity="success">
                        Configurações salvas com sucesso
                    </Alert>
                </Snackbar>
            </Box>
        </Layout>
    )
}
