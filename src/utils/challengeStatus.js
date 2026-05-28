export const isCellPaid = cell => cell?.paid === true

export const hasChallengePayments = (challenge, history = []) => {
  const hasPaidCell = challenge?.grid?.some(isCellPaid) || false
  const hasHistoryItem = history.some(
    item => String(item.challengeId) === String(challenge?.id)
  )

  return hasPaidCell || hasHistoryItem
}
