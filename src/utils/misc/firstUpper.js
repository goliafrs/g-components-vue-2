export function firstUpper(value = '') {
  if (typeof value === 'string' && value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}

export default { firstUpper }
