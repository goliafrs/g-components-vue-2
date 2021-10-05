import Vue from 'vue'

function findPanel(element) {
  if (element) {
    if (element.$options && element.$options._componentTag === 'g-expansion-panel') {
      return element
    } else if (Array.isArray(element.$children) && element.$children.length) {
      let result
      element.$children.some(element => (result = findPanel(element)))
      return result || false
    }
  }
  return false
}

import render from './render'

export default {
  name: 'GExpansionPanels',

  props: {
    flat: Boolean,
    outline: Boolean,
    rounded: Boolean
  },

  data() {
    return {
      toggleEvent: {}
    }
  },

  methods: {
    toggleEvents() {
      if (this.$slots.default) {
        this.$slots.default.forEach(vnode => {
          const panel = findPanel(vnode && vnode.componentInstance)
          if (panel) {
            if (!this.toggleEvent[panel._uid]) {
              Vue.set(this.toggleEvent, panel._uid, toggled => {
                if (toggled) {
                  this.$slots.default.forEach(child => {
                    const childPanel = findPanel(child && child.componentInstance)
                    if (childPanel && childPanel.expanded && childPanel._uid !== panel._uid) {
                      childPanel.toggle()
                    }
                  })
                }
              })
            }
            panel.on('toggle', this.toggleEvent[panel._uid])
          }
        })
      }
    }
  },

  mounted() {
    Vue.nextTick(this.toggleEvents)
  },

  updated() {
    Vue.nextTick(this.toggleEvents)
  },

  beforeDestroy() {
    if (this.$slots.default) {
      this.$slots.default.forEach(vnode => {
        const panel = findPanel(vnode && vnode.componentInstance)
        if (panel) {
          panel.off('toggle', this.toggleEvent[panel._uid])
        }
      })
    }
  },

  render
}
