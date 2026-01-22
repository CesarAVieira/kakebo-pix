import Layout from '../../Layout/Layout.jsx'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Historico.scss'

import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import CalendarHistory from './components/CalendarHistory.jsx'
import DaySummaryModal from './components/DaySummaryModal'
import MonthSummaryCard from './components/MonthSummaryCard'

import { Typography } from '@mui/material'

export default function Historico() {
    const { user } = useAuth()
    const history = user?.historico || []

    const [selectedDay, setSelectedDay] = useState(null)

    /* ===============================
       NORMALIZA + AGRUPA POR DIA
    =============================== */
    const historyByDay = useMemo(() => {
        const map = {}

        history.forEach(item => {
            const day = dayjs(item.date).format('YYYY-MM-DD')

            if (!map[day]) map[day] = []

            map[day].push(item)
        })

        return map
    }, [history])

    const selectedItems = selectedDay
        ? historyByDay[selectedDay]
        : []

    return (
        <Layout>
            <div className="historico-page">
                {/* <Typography variant="h4" className="page-title">
                    Histórico
                </Typography> */}

                <Typography className="page-subtitle">
                    .
                </Typography>

                {/* RESUMO DO MÊS */}
                <MonthSummaryCard history={history} />

                {/* CALENDÁRIO */}
                <CalendarHistory
                    historyByDay={historyByDay}
                    onSelectDay={setSelectedDay}
                />

                {/* MODAL */}
                <DaySummaryModal
                    open={Boolean(selectedDay)}
                    date={selectedDay}
                    items={selectedItems}
                    onClose={() => setSelectedDay(null)}
                />
            </div>
        </Layout>
    )
}
