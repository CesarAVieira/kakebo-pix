import { Box } from '@mui/material'
import dayjs from 'dayjs'

export default function YearSummaryCard({ history, year }) {
    const startOfYear = dayjs(`${year}-01-01`).startOf('year')
    const endOfYear = dayjs(`${year}-12-31`).endOf('year')

    const yearItems = history.filter(h => {
        const date = dayjs(h.date || h.data)
        if (!date.isValid()) return false
        return date >= startOfYear && date <= endOfYear
    })

    const total = yearItems.reduce(
        (s, i) => s + (Number(i.value) || Number(i.valor) || 0),
        0
    )
    const xp = yearItems.reduce(
        (s, i) => s + (Number(i.xp) || 0),
        0
    )
    const days = new Set(
        yearItems.map(i =>
            dayjs(i.date || i.data).format('DD')
        )
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
                    <span className="summary-label">Dias depositados</span>
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