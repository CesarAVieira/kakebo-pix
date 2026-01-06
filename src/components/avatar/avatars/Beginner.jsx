export default function BeginnerAvatar() {
    return (
        <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="#e5e7eb" />

            {/* Olhos */}
            <circle className="eye left-eye" cx="35" cy="42" r="4" fill="#111827" />
            <circle className="eye right-eye" cx="65" cy="42" r="4" fill="#111827" />

            {/* Boca */}
            <path
                className="mouth"
                d="M35 62 Q50 70 65 62"
                stroke="#111827"
                strokeWidth="3"
                fill="none"
            />
        </svg>
    )
}
