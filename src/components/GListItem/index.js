import render from './render'

export default {
  name: 'GListItem',

  functional: true,

  props: {
    label: [ String, Number ],

    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hovered: {
      type: Boolean,
      default: false
    },
    link: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: true
    },

    color: String,
    icon: String,
    prefix: String,
    suffix: String,

    to: {
      type: [ Object, String ],
      default: () => ({})
    }
  },

  render
}
