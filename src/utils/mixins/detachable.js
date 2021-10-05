export const detachable = {
  props: {
    rootElement: {
      type: null,
      default: '#app'
    }
  },

  data() {
    return {
      _rootElement: this.rootElement
    }
  },

  mounted() {
    if (document) {
      if (typeof this._data._rootElement === 'string') {
        this._data._rootElement = document.querySelector(this._data._rootElement)
      }
      if (this._data._rootElement && typeof this._data._rootElement.insertBefore === 'function') {
        this._data._rootElement.insertBefore(this.$el, null)
      }
    }
  },

  beforeDestroy() {
    if (this.$el && this.$el.parentNode && typeof this.$el.parentNode.removeChild === 'function') {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}

export default { detachable }
