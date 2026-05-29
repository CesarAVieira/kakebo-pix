const DEFAULT_GRID_SIZE = 256
export const AVAILABLE_CHALLENGE_TOTALS = [10000, 15000, 20000]

const toInteger = value => Number(value)

export function getChallengeValueLimits({
  min = 10,
  max = 200,
  size = DEFAULT_GRID_SIZE
} = {}) {
  return {
    minTotal: min * size,
    maxTotal: max * size
  }
}

export function validateChallengeConfig({
  total,
  min = 10,
  max = 200,
  size = DEFAULT_GRID_SIZE
}) {
  const numericTotal = Number(total)
  const numericMin = Number(min)
  const numericMax = Number(max)

  if (!Number.isFinite(numericTotal) || numericTotal <= 0) {
    return 'Informe um valor total valido'
  }

  if (!Number.isFinite(numericMin) || !Number.isFinite(numericMax)) {
    return 'Informe valores minimos e maximos validos'
  }

  if (
    !Number.isInteger(numericTotal) ||
    !Number.isInteger(numericMin) ||
    !Number.isInteger(numericMax)
  ) {
    return 'Os valores do cofre precisam ser inteiros'
  }

  if (numericMin <= 0 || numericMax <= 0 || numericMin >= numericMax) {
    return 'O valor minimo deve ser menor que o maximo'
  }

  const { minTotal, maxTotal } = getChallengeValueLimits({
    min: numericMin,
    max: numericMax,
    size
  })

  if (numericTotal < minTotal) {
    return `O valor total precisa ser no minimo R$ ${minTotal.toLocaleString()}`
  }

  if (numericTotal > maxTotal) {
    return `O valor total pode ser no maximo R$ ${maxTotal.toLocaleString()}`
  }

  return ''
}

export default function generateValues({
  total,
  min = 10,
  max = 200,
  size = DEFAULT_GRID_SIZE,
}) {
  const error = validateChallengeConfig({ total, min, max, size })

  if (error) {
    throw new Error(error)
  }

  const totalValue = toInteger(total)
  const minValue = toInteger(min)
  const maxValue = toInteger(max)
  const values = Array.from({ length: size }, () => minValue)

  let remaining = totalValue - size * minValue

  while (remaining > 0) {
    const index = Math.floor(Math.random() * size)
    const room = maxValue - values[index]

    if (room <= 0) continue

    const increment = Math.floor(Math.random() * Math.min(room, remaining)) + 1
    values[index] += increment
    remaining -= increment
  }

  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[values[i], values[j]] = [values[j], values[i]]
  }

  return values.map((value, index) => ({
    id: index,
    value,
    paid: false,
  }))
}
