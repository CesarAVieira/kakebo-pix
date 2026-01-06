import Layout from '../Layout/Layout'
import { useAuth } from '../context/AuthContext'
import '../styles/Historico.scss'

import {
    Card,
    CardContent,
    Typography,
    Divider,
    Stack,
    Box
} from '@mui/material'

export default function Historico() {
    const { user } = useAuth()

    const history = user?.historico || []

    if (history.length === 0) {
        return (
            <Layout>
                <Typography variant="h5" gutterBottom>
                    Histórico
                </Typography>
                <Typography color="text.secondary">
                    Nenhum pagamento registrado ainda.
                </Typography>
            </Layout>
        )
    }

    // 🔹 Agrupa histórico por Cofre
    const groupedHistory = history.reduce((acc, item) => {
        if (!item.challengeId) return acc

        if (!acc[item.challengeId]) {
            acc[item.challengeId] = []
        }

        acc[item.challengeId].push(item)
        return acc
    }, {})

    return (
        <Layout>
            <div className="historico-page">
                <Typography
                    variant="h4"
                    gutterBottom
                    className="page-title"
                >
                    Histórico
                </Typography>

                <Stack spacing={3}>
                    {Object.entries(groupedHistory).map(
                        ([challengeId, items]) => {
                            const challengeTitle =
                                items[0].challengeTitle || 'Cofre removido'

                            const totalPaid = items.reduce(
                                (sum, item) =>
                                    sum +
                                    (item.value ??
                                        item.valor ??
                                        0),
                                0
                            )

                            return (
                                <Card key={challengeId} elevation={3}>
                                    <CardContent>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={1}
                                        >
                                            <Typography variant="h6">
                                                {challengeTitle}
                                            </Typography>

                                            <Typography
                                                variant="subtitle1"
                                                color="success.main"
                                                fontWeight={600}
                                            >
                                                R$ {totalPaid.toFixed(2)}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ mb: 2 }} />

                                        <Stack spacing={1}>
                                            {items.map((item, index) => {
                                                const amount =
                                                    item.value ??
                                                    item.valor ??
                                                    0

                                                const date =
                                                    item.date ??
                                                    item.data

                                                return (
                                                    <Box
                                                        key={index}
                                                        display="flex"
                                                        justifyContent="space-between"
                                                    >
                                                        <Typography color="text.secondary">
                                                            {date
                                                                ? new Date(date).toLocaleDateString(
                                                                    'pt-BR'
                                                                )
                                                                : '--'}
                                                        </Typography>

                                                        <Typography fontWeight={500}>
                                                            R$ {amount.toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                )
                                            })}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )
                        }
                    )}
                </Stack>
            </div>
        </Layout>
    )
}
