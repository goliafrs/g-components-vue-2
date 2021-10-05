import render from './render'

export default {
  name: 'GCard',

  functional: true,

  props: {
    color: String,

    flat: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    transparent: {
      type: Boolean,
      default: false
    },

    accent: {
      type: Boolean,
      default: false
    },
    accentColor: {
      type: String,
      default: '#ffffff'
    },
    accentColorName: String,
    accentSize: {
      type: [ String, Number ],
      default: '8px'
    },
    accentPosition: {
      type: String,
      default: 'left',
      validator: value => {
        return ~[ 'left', 'right', 'top', 'bottom' ].indexOf(value)
      }
    },

    minHeight: [ String, Number ],
    maxHeight: [ String, Number ],
    height: [ String, Number ],
    minWidth: [ String, Number ],
    maxWidth: [ String, Number ],
    width: [ String, Number ]
  },

  render
}
