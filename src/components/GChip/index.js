import render from './render'

export default {
  name: 'GChip',

  functional: true,

  props: {
    label: [ String, Number ],

    cut: Boolean,

    length: {
      type: Number,
      default: 25
    },

    outline: Boolean,
    circle: Boolean,

    tiny: Boolean,
    small: Boolean,
    large: Boolean,

    color: String,

    icon: String,

    loading: Boolean,
    disabled: Boolean,

    cancelable: Boolean,
    cancelIcon: {
      type: String,
      default: 'clear'
    },
    cancelCallback: {
      type: Function,
      default: () => undefined
    }
  },

  render
}
