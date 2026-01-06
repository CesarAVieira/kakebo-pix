export default function IntermediateAvatar() {
    return (
        <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="#22c55e" />

            {/* Olhos */}
            <circle className="eye left-eye" cx="35" cy="42" r="4" fill="#022c22" />
            <circle className="eye right-eye" cx="65" cy="42" r="4" fill="#022c22" />

            {/* Boca */}
            <path
                className="mouth"
                d="M32 60 Q50 72 68 60"
                stroke="#022c22"
                strokeWidth="3"
                fill="none"
            />
        </svg>
    )
}
