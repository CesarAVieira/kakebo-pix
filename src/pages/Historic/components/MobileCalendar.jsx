import { DateCalendar, PickersDay } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'

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
    onSelectDay
}) {
    const getDayRarity = day => {
        const items = historyByDay[day]
        if (!items) return null

        return rarityPriority
            .slice()
            .reverse()
            .find(r =>
                items.some(i => i.rarity === r)
            )
    }

    return (
        <div className="calendar-wrapper premium-card">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DateCalendar
                    onChange={d =>
                        onSelectDay(d.format('YYYY-MM-DD'))
                    }
                    slots={{
                        day: props => {
                            const dayKey = props.day.format('YYYY-MM-DD')
                            const rarity = getDayRarity(dayKey)

                            return (
                                <PickersDay
                                    {...props}
                                    sx={{
                                        bgcolor: rarity
                                            ? rarityColors[rarity]
                                            : undefined,
                                        color: rarity ? '#fff' : undefined,
                                        fontWeight: rarity ? 600 : 400
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
