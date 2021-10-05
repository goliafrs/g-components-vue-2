import render from './render'

export default {
  name: 'GList',

  props: {
    wrap: Boolean,
    dense: Boolean,
    rounded: Boolean,
    transparent: Boolean,

    items: {
      type: Array,
      default: () => []
    }
  },

  render
}
