export function isEmpty(value) {
  return [ undefined, null, '' ].indexOf(value) !== -1
}

export function isObject(value) {
  return typeof value === 'object'
}
export function isObjectEmpty(value) {
  return isObject(value) && !isEmpty(value) && Object.keys(value).length === 0
}
export function isObjectNotEmpty(value) {
  return isObject(value) && !isEmpty(value) && Object.keys(value).length > 0
}

export function isValidDate(date) {
  return date instanceof Date && !isNaN(date)
}

const REGEXP_IS_HEX = /^#?[0-9A-Fa-f]{3,6}$/
export function isHEX(value) {
  return REGEXP_IS_HEX.test(value)
}

export function checkKey(keySample, event) {
  return (
    (typeof keySample === 'number' && event.keyCode === keySample) ||
    (typeof keySample === 'string' && event.key === keySample) ||
    false
  )
}

export function isChildOf(element, potentialParent) {
  if (potentialParent.contains) {
    return potentialParent.contains(element)
  }

  let target = element
  while (target != null) {
    if (target == potentialParent) {
      return true
    }
    target = target.parentNode
  }

  return false
}

export default { isEmpty, isObject, isObjectEmpty, isObjectNotEmpty, isValidDate, isHEX, checkKey, isChildOf }
