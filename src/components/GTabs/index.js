import proxy from 'g-proxy'

import render from './render'

export default {
  name: 'GTabs',

  mixins: [ proxy() ],

  props: {
    tabs: {
      type: Array,
      default: () => []
    }
  },

  mounted() {
    if (Array.isArray(this.tabs) && this.tabs.length) {
      this.setCurrentTab(this.tabs[0].key)
    }
  },

  methods: {
    setCurrentTab(key) {
      if (this.proxy !== key) {
        this.proxy = key
      }
    }
  },

  render
}
