export default function XpFloat({ x, y, value }) {
    return (
        <div
            className="xp-float"
            style={{
                left: x,
                top: y
            }}
        >
            +{value} XP
        </div>
    )
}
