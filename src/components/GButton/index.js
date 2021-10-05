import render from './render'

import { global, form } from '../../utils'

export default {
  name: 'GButton',

  functional: true,

  mixins: [ global, form ],

  props: {
    label: [ String, Number ],

    color: String,

    small: Boolean,
    large: Boolean,

    fab: Boolean,
    flat: Boolean,
    block: Boolean,
    round: Boolean,
    rounded: Boolean,
    toolbar: Boolean,
    outline: Boolean,
    depressed: Boolean,

    icon: String,
    prefix: String,
    suffix: String,

    fixed: Boolean,
    absolute: Boolean,

    top: [ String, Number, Boolean ],
    bottom: [ String, Number, Boolean ],
    left: [ String, Number, Boolean ],
    right: [ String, Number, Boolean ],

    loading: Boolean,

    disabled: Boolean,
    autofocus: Boolean,

    name: String,

    type: {
      type: String,
      default: 'button'
    },

    value: null
  },

  render
}
