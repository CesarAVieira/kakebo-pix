const DEFAULT_GRID_SIZE = 256

const toCents = value => Math.round(Number(value) * 100)
const fromCents = value => Number((value / 100).toFixed(2))

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

  const totalCents = toCents(total)
  const minCents = toCents(min)
  const maxCents = toCents(max)
  const values = Array.from({ length: size }, () => minCents)

  let remaining = totalCents - size * minCents

  while (remaining > 0) {
    const index = Math.floor(Math.random() * size)
    const room = maxCents - values[index]

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
    value: fromCents(value),
    paid: false,
  }))
}
