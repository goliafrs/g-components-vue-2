import Vue from 'vue'
import proxy from 'g-proxy'

import { unVue } from 'unvue'
import { get } from 'no-lodash'

import render from './render'

export default {
  name: 'GTable',

  mixins: [ proxy({ type: 'object' }) ],

  props: {
    cols: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
    },

    hideHead: {
      type: Boolean,
      default: false
    },
    hideFoot: {
      type: Boolean,
      default: false
    },

    items: {
      type: Array,
      default: () => []
    },

    sortLocal: {
      type: Boolean,
      default: false
    },

    sortType: {
      type: String,
      default: 'string',
      validator: value => {
        return !!~[ 'string', 'number' ].indexOf(value)
      }
    },

    noDataText: {
      type: String,
      default: 'No available items.'
    },

    dense: {
      type: Boolean,
      default: false
    },
    tiny: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    computedItems() {
      if (this.sortLocal) {
        const array = unVue(this.items)
        array.sort((a, b) => {
          let result = 0

          Object.keys(this.proxy).some(key => {
            const aValue = get(a, key)
            const bValue = get(b, key)

            let direction = 0

            if (aValue > bValue) {
              direction = 1
            } else if (aValue < bValue) {
              direction = -1
            }

            if (this.proxy[key].toLowerCase() === 'asc') {
              direction *= -1
            }

            if (direction !== 0) {
              result = direction
              return true
            }
          })

          return result
        })

        return array
      }

      return this.items
    },

    hasCols() {
      return Array.isArray(this.cols) && this.cols.length > 0
    },
    hasBody() {
      return Array.isArray(this.computedItems) && this.computedItems.length > 0
    },
    hasHead() {
      return Array.isArray(this.headers) && this.headers.length > 0 && !this.hideHead && this.hasBody
    },
    hasFoot() {
      return this.$slots.foot && !this.hideFoot && this.hasBody
    }
  },

  methods: {
    sorting(value, sortable) {
      if (sortable) {
        switch (this.proxy[value]) {
          case 'ASC':
            Vue.set(this.proxy, value, this.sortType === 'string' ? 'DESC' : -1)
            break
          case 'DESC':
            Vue.delete(this.proxy, value)
            break
          default:
            Vue.set(this.proxy, value, this.sortType === 'string' ? 'ASC' : 1)
            break
        }
      }
    }
  },

  render
}
