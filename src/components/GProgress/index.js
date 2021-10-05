import render from './render'

export default {
  name: 'GProgress',

  functional: true,

  props: {
    value: Number,

    type: {
      type: String,
      default: 'circular'
    },

    size: {
      type: Number,
      default: 32
    },

    height: {
      type: Number,
      default: 2
    },
    width: {
      type: Number,
      default: 2
    },

    rotate: {
      type: Number,
      default: 0
    },

    color: {
      type: String,
      default: 'primary'
    },

    indeterminate: {
      type: Boolean,
      default: false
    },
    info: {
      type: Boolean,
      default: false
    }
  },

  render
}
