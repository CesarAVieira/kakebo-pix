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

export default function MonthCalendar({
  month,
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

  const monthKey = month.format('YYYY-MM')

  const monthTotal = Object.entries(historyByDay)
    .filter(([day]) => day.startsWith(monthKey))
    .reduce((sum, [, items]) => {
      return (
        sum +
        items.reduce((s, i) => s + i.value, 0)
      )
    }, 0)

  return (
    <div className="month-calendar premium-card">
      <h3 className="month-title">
        {month.format('MMMM')}
      </h3>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DateCalendar
          referenceDate={month}
          views={['day']}
          disableHighlightToday
          showDaysOutsideCurrentMonth={false}
          onChange={d => {
            const key = d.format('YYYY-MM-DD')
            if (historyByDay[key]) {
              onSelectDay(key)
            }
          }}
          slots={{
            calendarHeader: () => null,
            day: props => {
              const dayKey = props.day.format('YYYY-MM-DD')
              const rarity = getDayRarity(dayKey)

              const isToday =
                props.day.isSame(dayjs(), 'day') &&
                props.day.isSame(month, 'month')

              return (
                <PickersDay
                  {...props}
                  sx={{
                    borderRadius: 2,
                    bgcolor: rarity
                      ? rarityColors[rarity]
                      : 'transparent',
                    color: rarity ? '#fff' : undefined,
                    fontWeight: rarity ? 600 : 400,
                    border: isToday
                      ? '1px solid #3b82f6'
                      : undefined,
                    transition: '0.2s',
                    '&:hover': {
                      filter: rarity
                        ? 'brightness(1.15)'
                        : undefined
                    }
                  }}
                />
              )
            }
          }}
        />
        {monthTotal > 0 && (
          <div className="month-total">
            💰 R$ {monthTotal.toFixed(2)}
          </div>
        )}
      </LocalizationProvider>
    </div>
  )
}
