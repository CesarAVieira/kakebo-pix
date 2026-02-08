import Layout from '../../Layout/Layout.jsx'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Historico.scss'

import { useMemo, useState } from 'react'
import { Select, MenuItem } from '@mui/material'
import dayjs from 'dayjs'

import CofreFilter from './components/CofreFilter'
import YearCalendar from './components/YearCalendar'
import MobileCalendar from './components/MobileCalendar'
import DaySummaryModal from './components/DaySummaryModal'
import YearSummaryCard from './components/YearSummaryCard.jsx'
import { useTheme, useMediaQuery } from '@mui/material'

export default function Historico() {
    const { user } = useAuth()
    const theme = useTheme()
    const [selectedYear, setSelectedYear] = useState(dayjs().year())
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const history = useMemo(
        () => user?.historico || [],
        [user]
    )

    const availableYears = useMemo(() => {
        const years = new Set(
            history.map(h => dayjs(h.date || h.data).year())
        )
        return Array.from(years).sort((a, b) => b - a)
    }, [history])

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
        return history.filter(item => {
            const date = dayjs(item.date || item.data)

            return (
                selectedCofres.includes(item.challengeId) &&
                date.year() === selectedYear
            )
        })
    }, [history, selectedCofres, selectedYear])

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
                    year={selectedYear}
                    onYearChange={setSelectedYear}
                    availableYears={availableYears}
                />

                {/* RESUMO DO MÊS */}
                <YearSummaryCard
                    history={filteredHistory}
                    year={selectedYear}
                />

                {/* CALENDÁRIO */}
                {isMobile ? (
                    <MobileCalendar
                        historyByDay={historyByDay}
                        onSelectDay={setSelectedDay}
                    />
                ) : (
                    <YearCalendar
                        year={selectedYear}
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
