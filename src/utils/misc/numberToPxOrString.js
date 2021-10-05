export function numberToPxOrString(value) {
  if (typeof value === 'number') {
    return value + 'px'
  } else if (typeof value === 'string') {
    return value
  }
}

export default { numberToPxOrString }
