import Layout from '../../Layout/Layout.jsx'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Historico.scss'

import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import CofreFilter from './components/CofreFilter'
import YearCalendar from './components/YearCalendar'
import MobileCalendar from './components/MobileCalendar'
import DaySummaryModal from './components/DaySummaryModal'
import MonthSummaryCard from './components/MonthSummaryCard'
import { useTheme, useMediaQuery } from '@mui/material'

import { Typography } from '@mui/material'

export default function Historico() {
    const { user } = useAuth()
    const theme = useTheme()
    const currentMonth = dayjs('2026-01-01')
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const history = useMemo(
        () => user?.historico || [],
        [user]
    )

    const [selectedDay, setSelectedDay] = useState(null)
    const challenges = user?.challenges || []

    const [selectedCofres, setSelectedCofres] = useState(
        challenges.map(c => c.id)
    )

    const toggleCofre = cofreId => {
        setSelectedCofres(prev =>
            prev.includes(cofreId)
                ? prev.filter(id => id !== cofreId)
                : [...prev, cofreId]
        )
    }

    const filteredHistory = useMemo(() => {
        const filtered = history.filter(item =>
            selectedCofres.includes(item.challengeId)
        )
        return filtered
    }, [history, selectedCofres])

    /* ===============================
       NORMALIZA + AGRUPA POR DIA
    =============================== */
    const historyByDay = useMemo(() => {
        const map = {}

        filteredHistory.forEach(item => {
            const day = dayjs(item.date).format('YYYY-MM-DD')
            if (!map[day]) map[day] = []
            map[day].push(item)
        })

        return map
    }, [filteredHistory])

    const selectedItems = selectedDay
        ? historyByDay[selectedDay]
        : []

    return (
        <Layout>
            <div className="historico-page">

                <CofreFilter
                    challenges={challenges}
                    selectedCofres={selectedCofres}
                    onToggle={toggleCofre}
                />

                {/* RESUMO DO MÊS */}
                <MonthSummaryCard
                    history={filteredHistory}
                    month={currentMonth}
                />

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
