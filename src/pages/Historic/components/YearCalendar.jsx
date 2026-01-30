import dayjs from 'dayjs'
import MonthCalendar from './MonthCalendar'

export default function YearCalendar({
    historyByDay,
    onSelectDay
}) {
    const year = dayjs().year()

    const months = Array.from({ length: 12 }, (_, i) =>
        dayjs().year(year).month(i)
    )

    return (
        <div className="year-calendar">
            {months.map(month => (
                <MonthCalendar
                    key={month.month()}
                    month={month}
                    historyByDay={historyByDay}
                    onSelectDay={onSelectDay}
                />
            ))}
        </div>
    )
}
