import render from './render'

export default {
  name: 'GSnackbar',

  functional: true,

  props: {
    items: {
      type: Array,
      default: () => []
    },

    direction: {
      type: Array,
      default: () => [ 'bottom', 'left' ]
    }
  },

  render
}
