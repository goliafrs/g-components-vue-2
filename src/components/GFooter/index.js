import { size } from '../../utils'

import render from './render'

export default {
  name: 'GFooter',

  mixins: [ size ],

  props: {
    dense: Boolean,

    fixed: Boolean,

    color: String
  },

  mounted() {
    const footer = this.$refs.footer
    if (footer) {
      const height = footer.offsetHeight
      const content = document.querySelector('.g-content')
      if (content) {
        const { paddingBottom } = getComputedStyle(content)
        content.style.paddingBottom = parseInt(paddingBottom) + height + 'px'
      }
    }
  },

  render
}
