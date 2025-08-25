import UnlockedCapsule from './UnlockedCapsule'
import LockedCapsule from './LockedCapsule'

export default function Capsule({ route }) {
  const { capsule } = route.params

  return capsule.unlocked ? <UnlockedCapsule capsule={capsule} /> : <LockedCapsule capsule={capsule} />
}