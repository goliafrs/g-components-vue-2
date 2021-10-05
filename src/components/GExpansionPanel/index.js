import render from './render'

export default {
  name: 'GExpansionPanel',

  props: {
    preventClick: Boolean,
    expandOnMounted: Boolean
  },

  data() {
    return {
      expanded: false
    }
  },

  mounted() {
    if (this.expandOnMounted) {
      this.toggle()
    }

    this.$nextTick(() => {
      this.$emit('mounted', {
        expanded: this.expanded,
        toggle: this.toggle
      })
    })
  },

  methods: {
    toggle() {
      this.expanded = !this.expanded
      this.$emit('toggle', this.expanded)
      return this.expanded
    },

    on(event, callback) {
      return this.$on(event, callback)
    },
    off(event, callback) {
      return this.$off(event, callback)
    }
  },

  render
}
