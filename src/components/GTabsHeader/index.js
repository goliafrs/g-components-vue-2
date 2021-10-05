import proxy from 'g-proxy'

import render from './render'

export default {
  name: 'GTabsHeader',

  mixins: [ proxy() ],

  props: {
    tabs: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      showArrows: false,

      scrollWidth: 0,
      tabIndex: 0,

      prevDisabled: true,
      nextDisabled: false
    }
  },

  mounted() {
    if (Array.isArray(this.tabs) && this.tabs.length) {
      this.setCurrentTab(this.tabs[0].key)
    }
    this.setShowArrows()
    window.addEventListener('resize', this.setShowArrows)
    this.$nextTick(() => this.scrollToCurrent())
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.setShowArrows)
  },

  methods: {
    setCurrentTab(key) {
      if (this.proxy !== key) {
        this.proxy = key
      }
    },

    slide(direction) {
      const items = this.$refs.items
      if (items) {
        const parentStyles = getComputedStyle(this.$el)
        const itemsStyles = getComputedStyle(items)
        const parentWidth = parseInt(parentStyles.width)
        const itemsWidth = parseInt(itemsStyles.width)
        switch (direction) {
          case 'prev': {
            this.nextDisabled = false
            if (this.tabIndex > 0) {
              this.tabIndex -= 1
              const child = items.children[this.tabIndex]
              this.scrollWidth += child.offsetWidth

              items.style.transform = `translateX(${this.scrollWidth}px)`
            }
            if (this.scrollWidth === 0) {
              this.prevDisabled = true
            }
            break
          }
          case 'next': {
            this.prevDisabled = false
            const child = items.children[this.tabIndex]
            if (itemsWidth + this.scrollWidth >= parentWidth) {
              this.tabIndex += 1
              this.scrollWidth -= child.offsetWidth

              items.style.transform = `translateX(${this.scrollWidth}px)`
            }
            if (itemsWidth + this.scrollWidth <= parentWidth) {
              this.nextDisabled = true
              break
            }
            break
          }
        }
      }
    },

    scrollToCurrent() {
      const items = this.$refs.items
      const tabs = this.tabs.map(tab => tab.key || tab)

      if (items) {
        const currentIndex = tabs.findIndex(tab => tab === this.proxy)
        for (let index = 0; index < currentIndex; index++) {
          this.slide('next')
        }
      }
    },

    setShowArrows() {
      const items = this.$refs.items
      if (items) {
        const parentStyles = getComputedStyle(this.$el)
        const itemsStyles = getComputedStyle(items)

        const parentWidth = parseInt(parentStyles.width)
        const itemsWidth = parseInt(itemsStyles.width)
        if (itemsWidth > parentWidth) {
          this.showArrows = true
        } else {
          this.showArrows = false
        }
      }
    }
  },

  render
}
