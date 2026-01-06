export default function LegendAvatar() {
    return (
        <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="#facc15" />

            {/* Olhos */}
            <circle className="eye left-eye" cx="35" cy="42" r="4" fill="#451a03" />
            <circle className="eye right-eye" cx="65" cy="42" r="4" fill="#451a03" />

            {/* Boca */}
            <path
                className="mouth"
                d="M28 56 Q50 80 72 56"
                stroke="#451a03"
                strokeWidth="3"
                fill="none"
            />

            {/* Coroa */}
            <polygon
                points="40,18 50,8 60,18"
                fill="#92400e"
            />
        </svg>
    )
}
