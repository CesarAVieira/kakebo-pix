import { useRef, useState } from 'react'
import { useDrag } from '@use-gesture/react'

export default function CofreFilter({
    challenges,
    selectedCofres,
    onToggle,
    year,
    onYearChange,
    availableYears
}) {
    const scrollRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)

    const bind = useDrag(
        ({ active, movement: [mx], velocity: [vx] }) => {
            setIsDragging(active)
            if (active) {
                const speedMultiplier = 0.1 + vx * 0.2
                scrollRef.current.scrollLeft -= mx * speedMultiplier
            }
        },
        {
            axis: 'x',
            filterTaps: true,
            threshold: 5
        }
    )

    return (
        <div className="cofre-filter premium-card">
            <div
                className="cofre-filter-header"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    position: 'relative'
                }}
            >
                {/* SELETOR DE ANO - FIXO À ESQUERDA */}
                <select
                    className="year-selector"
                    value={year}
                    onChange={e => onYearChange(Number(e.target.value))}
                    style={{
                        flexShrink: 0,
                        marginRight: '16px',
                        position: 'sticky',
                        left: 0,
                        zIndex: 1
                    }}
                >
                    {availableYears.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                {/* CHIPS - ROLÁVEL COM DRAG */}
                <div
                    className="cofre-filter-scroll"
                    ref={scrollRef}
                    style={{
                        flex: 1,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        whiteSpace: 'nowrap',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        userSelect: 'none',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#ccc transparent'
                    }}
                    {...bind()}
                >
                    {challenges.map(cofre => {
                        const active = selectedCofres.includes(cofre.id)
                        return (
                            <button
                                key={cofre.id}
                                className={`cofre-chip ${active ? 'active' : ''}`}
                                onClick={() => {
                                    if (!isDragging) {
                                        onToggle(cofre.id)
                                    }
                                }}
                                style={{
                                    display: 'inline-block',
                                    marginRight: '8px',
                                    pointerEvents: isDragging ? 'none' : 'auto'
                                }}
                            >
                                {cofre.title}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}