import Layout from '../../Layout/Layout.jsx'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Historico.scss'

import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import YearCalendar from './components/YearCalendar'
import MobileCalendar from './components/MobileCalendar'
import DaySummaryModal from './components/DaySummaryModal'
import MonthSummaryCard from './components/MonthSummaryCard'
import { useTheme, useMediaQuery } from '@mui/material'

import { Typography } from '@mui/material'

export default function Historico() {
    const { user } = useAuth()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
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

                {/* RESUMO DO MÊS */}
                <MonthSummaryCard history={history} />

                {/* CALENDÁRIO */}
                {isMobile ? (
                    <MobileCalendar
                        historyByDay={historyByDay}
                        onSelectDay={setSelectedDay}
                    />
                ) : (
                    <YearCalendar
                        historyByDay={historyByDay}
                        onSelectDay={setSelectedDay}
                    />
                )}

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
