import render from './render'

export default {
  name: 'GTextOverflow',

  props: {
    value: String,

    placement: {
      type: String,
      default: 'right'
    }
  },

  data() {
    return { isOverflowed: false }
  },

  computed: {
    directives() {
      const result = []
      if (this.isOverflowed) {
        result.push({
          name: 'g-tooltip',
          options: {
            value: this.value,
            placement: this.placement
          }
        })
      }

      return result
    }
  },

  mounted() {
    this.$el.addEventListener('mouseover', this.onHover)
    this.onHover()
  },

  beforeDestroy() {
    this.$el.removeEventListener('mouseover', this.onHover)
  },

  methods: {
    onHover() {
      const target = document.getElementById(`g-text-${this._uid}`)
      if (target) {
        const clientWidth = target.clientWidth
        const scrollWidth = target.scrollWidth

        this.isOverflowed = clientWidth < scrollWidth
      }
    }
  },

  render
}
