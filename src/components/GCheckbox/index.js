import { core } from './mixins'

import render from './render'

export default {
  name: 'GCheckbox',

  mixins: [ core ],

  props: {
    label: String,

    color: {
      type: String,
      default: null
    }
  },

  render
}
