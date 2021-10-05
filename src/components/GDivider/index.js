import render from './render'

export default {
  name: 'GDivider',

  functional: true,

  props: {
    type: {
      type: String,
      default: 'horizontal',
      validator: value => {
        return ~[ 'horizontal', 'vertical' ].indexOf(value)
      }
    },
    style: {
      type: String,
      default: 'solid',
      validator: value => {
        return ~[ 'none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset' ]
          .indexOf(value)
      }
    },

    color: String,
    size: [ String, Number ]
  },

  render
}
