import { form } from '../../utils'

import { core } from './mixins'

import render from './render'

export default {
  name: 'GInput',

  mixins: [ core(), form ],

  methods: {
    _eventHandler(event) {
      this.$emit(event.type, event)
    }
  },

  render
}
