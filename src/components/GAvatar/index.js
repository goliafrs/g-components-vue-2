import render from './render'

export default {
  name: 'GAvatar',

  functional: true,

  props: {
    title: [ String, Number ],

    src: String,
    icon: String,

    size: {
      type: Number,
      default: 48
    },

    tile: {
      type: Boolean,
      default: false
    },

    backgroundColor: String,

    color: {
      type: String,
      default: '#ffffff'
    },

    fontSize: Number
  },

  render
}
