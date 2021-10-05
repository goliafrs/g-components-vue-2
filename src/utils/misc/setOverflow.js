export function setOverflow(value) {
  if (document) {
    switch (value) {
      case true:
        document.body.style.overflow = 'hidden'
        break
      case false:
      default:
        document.body.style.overflow = null
        break
    }
  }
}

export default { setOverflow }
