import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'

export default function MonthSummaryCard({ history }) {
    const currentMonth = dayjs().format('YYYY-MM')

    const monthItems = history.filter(
        h => dayjs(h.date).format('YYYY-MM') === currentMonth
    )

    const total = monthItems.reduce((s, i) => s + i.value, 0)
    const xp = monthItems.reduce((s, i) => s + (i.xp || 0), 0)
    const days = new Set(
        monthItems.map(i => dayjs(i.date).format('DD'))
    ).size

    return (
        <Box className="month-summary premium-card">
            <Typography variant="h6">
                Resumo do mês
            </Typography>

            <Box className="month-grid">
                <div>
                    <strong>💰 R$ {total.toFixed(2)}</strong>
                    <span>Total</span>
                </div>

                <div>
                    <strong>📅 {days}</strong>
                    <span>Dias ativos</span>
                </div>

                <div>
                    <strong>⭐ {xp}</strong>
                    <span>XP</span>
                </div>
            </Box>
        </Box>
    )
}
