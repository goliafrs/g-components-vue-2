import { core } from '../GCheckbox/mixins'

import render from './render'

export default {
  name: 'GSwitch',

  mixins: [ core ],

  props: {
    label: String,
    small: Boolean,
    large: Boolean
  },

  render
}
