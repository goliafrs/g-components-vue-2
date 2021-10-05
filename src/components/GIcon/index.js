import render from './render'

export default {
  name: 'GIcon',

  functional: true,

  props: {
    value: String,

    size: {
      type: Number,
      default: 24
    },

    color: String,

    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },

    library: String
  },

  render
}
