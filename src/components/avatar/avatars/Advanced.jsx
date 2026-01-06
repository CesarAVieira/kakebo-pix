export default function AdvancedAvatar() {
    return (
        <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="#3b82f6" />

            {/* Olhos */}
            <circle className="eye left-eye" cx="35" cy="42" r="4" fill="#020617" />
            <circle className="eye right-eye" cx="65" cy="42" r="4" fill="#020617" />

            {/* Boca */}
            <path
                className="mouth"
                d="M30 58 Q50 76 70 58"
                stroke="#020617"
                strokeWidth="3"
                fill="none"
            />
        </svg>
    )
}
