import { setOverflow, detachable } from '../../utils'

import render from './render'

export default {
  name: 'GOverlay',

  mixins: [ detachable ],

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    value() {
      setOverflow(this.value)
    }
  },

  mounted() {
    if (document) {
      const app = document.querySelector('#app')
      app.addEventListener('click', this.toggle)
    }
  },

  beforeDestroy() {
    if (document) {
      const app = document.querySelector('#app')
      app.removeEventListener('click', this.toggle)
    }
  },

  methods: {
    toggle() {
      this.$emit('input', !this.value)
    }
  },

  render
}
