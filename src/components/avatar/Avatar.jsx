import Beginner from './avatars/Beginner'
import Intermediate from './avatars/Intermediate'
import Advanced from './avatars/Advanced'
import Legend from './avatars/Legend'
import Badge from './Badge'

export default function Avatar({ tier }) {
    const AvatarComponent =
        tier === 'legend'
            ? Legend
            : tier === 'advanced'
                ? Advanced
                : tier === 'intermediate'
                    ? Intermediate
                    : Beginner

    return (
        <div className="player-avatar">
            <AvatarComponent />
            <Badge tier={tier} />
        </div>
    )
}
