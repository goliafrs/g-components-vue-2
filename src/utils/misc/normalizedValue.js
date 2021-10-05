export function normalizedValue(value) {
  value = parseFloat(value)

  if (isNaN(value) || value < 0) {
    value = 0
  }

  if (value > 100) {
    value = 100
  }

  return value
}

export default { normalizedValue }
