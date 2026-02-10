import { DateCalendar, PickersDay } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

const rarityPriority = ['common', 'rare', 'epic', 'legendary']

const rarityColors = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b'
}

export default function MobileCalendar({
    historyByDay,
    onSelectDay,
    referenceMonth
}) {
    const getDayRarity = day => {
        const items = historyByDay[day]
        if (!items) return null

        return rarityPriority
            .slice()
            .reverse()
            .find(r => items.some(i => i.rarity === r))
    }

    return (
        <div className="mobile-calendar-wrapper premium-card">
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
            >
                <DateCalendar
                    views={['day']}
                    referenceDate={referenceMonth || dayjs()}
                    disableHighlightToday
                    showDaysOutsideCurrentMonth={false}
                    sx={{
                        width: '100%',
                        maxWidth: 340,
                        margin: '0 auto',

                        '& .MuiPickersDay-root': {
                            fontSize: '0.75rem',
                            width: 34,
                            height: 34
                        },

                        '& .MuiDayCalendar-weekDayLabel': {
                            fontSize: '0.65rem'
                        }
                    }}
                    onChange={d => {
                        const key = d.format('YYYY-MM-DD')
                        if (historyByDay[key]) {
                            onSelectDay(key)
                        }
                    }}
                    slots={{
                        // ⚠️ NO MOBILE, O HEADER FICA VISÍVEL
                        day: props => {
                            const dayKey = props.day.format('YYYY-MM-DD')
                            const rarity = getDayRarity(dayKey)

                            const isToday = props.day.isSame(dayjs(), 'day')

                            const borderStyle = isToday
                                ? '1.5px solid #34c966'
                                : rarity
                                    ? '1px solid rgba(0,0,0,0.12)'
                                    : '1px solid transparent'

                            return (
                                <PickersDay
                                    {...props}
                                    selected={false}
                                    disableRipple
                                    sx={{
                                        borderRadius: 2,
                                        border: borderStyle,
                                        bgcolor: rarity
                                            ? rarityColors[rarity]
                                            : 'transparent',
                                        color: rarity ? '#fff' : undefined,
                                        fontWeight: rarity ? 600 : 400,
                                        transition: '0.15s'
                                    }}
                                />
                            )
                        }
                    }}
                />
            </LocalizationProvider>
        </div>
    )
}
