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
            <Box className="month-summary-grid">
                <Box className="summary-item total">
                    <span className="summary-icon">💰</span>
                    <strong className="summary-value">
                        R$ {total.toFixed(2)}
                    </strong>
                    <span className="summary-label">Total</span>
                </Box>

                <Box className="summary-item days">
                    <span className="summary-icon">📅</span>
                    <strong className="summary-value">
                        {days}
                    </strong>
                    <span className="summary-label">Dias ativos</span>
                </Box>

                <Box className="summary-item xp">
                    <span className="summary-icon">⭐</span>
                    <strong className="summary-value">
                        {xp}
                    </strong>
                    <span className="summary-label">XP</span>
                </Box>
            </Box>
        </Box>
    )
}
