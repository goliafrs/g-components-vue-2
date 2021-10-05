export const size = {
  props: {
    minHeight: {
      type: [ String, Number ],
      default: 0
    },
    maxHeight: {
      type: [ String, Number ],
      default: 'none'
    },
    height: {
      type: [ String, Number ],
      default: 'auto'
    },
    minWidth: {
      type: [ String, Number ],
      default: 0
    },
    maxWidth: {
      type: [ String, Number ],
      default: 'none'
    },
    width: {
      type: [ String, Number ],
      default: '100%'
    }
  }
}

export default { size }
