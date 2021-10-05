import render from './render'

export default {
  name: 'GEmpty',

  functional: true,

  props: {
    icon: {
      type: Object,
      default: () => ({
        show: true,
        value: 'search_off'
      })
    },

    title: String,
    color: String,

    size: {
      type: [ String, Number ],
      default: 64
    },

    padless: Boolean
  },

  render
}
