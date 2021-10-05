import { unVue } from 'unvue'

export const core = {
  props: {
    value: null,

    search: String,

    onlyEmit: Boolean
  },

  watch: {
    value: {
      handler() {
        this._receiveValue()
      },
      deep: true
    },

    search() {
      this._receiveSearchValue()
    },
    searchValue() {
      this._transmitSearchValue()
    }
  },

  mounted() {
    this._receiveSearchValue()
    this._receiveValue()
  },

  methods: {
    _receiveValue() {
      if (this.onlyEmit) {
        return
      }

      let value = unVue(this.value)
      if (!Array.isArray(value) || !this.multiple) {
        value = [ value ]
      }

      value = value.filter(filteredValue => {
        return !~this._data._filterInputValues.findIndex(comparedValue => {
          return this._compareValues(comparedValue, filteredValue)
        })
      })

      const needDefaultValue = this.required && !value.length
      if (needDefaultValue) {
        value = [ this.defaultValue === undefined ? (this.displayItems.find(item => !item.disabled) || {})[this.$itemValue] : this.defaultValue ]
      }

      if (
        this.selectedValues.length !== value.length ||
        value.some((comparedValue, index) => {
          return !this._compareValues(comparedValue, this.selectedValues[index])
        })
      ) {
        this.selectedValues.splice(0, this.selectedValues.length, ...value)
      } else if (needDefaultValue) {
        this._transmitValue()
      }
    },
    _transmitValue() {
      let value = unVue(this.value)
      if (!Array.isArray(value)) {
        value = [ value ]
      }

      value = value.filter(filteredValue => {
        return !~this._data._filterInputValues.findIndex(comparedValue => {
          return this._compareValues(comparedValue, filteredValue)
        })
      })

      if (this.onlyEmit) {
        if (this.selectedValues.length) {
          this.$emit('input', this.multiple ? this.selectedValues : this.selectedValues[0])
          this.selectedItems.splice(0, this.selectedItems.length)
          this.selectedValues.splice(0, this.selectedValues.length)
        }
        return
      }

      if (
        this.selectedValues.length !== value.length ||
        value.some((comparedValue, index) => {
          return !this._compareValues(comparedValue, this.selectedValues[index])
        })
      ) {
        this.$emit('input', this.multiple ? this.selectedValues : this.selectedValues[0])
      }
    },

    _receiveSearchValue() {
      const cleanSearch = ('' + (this.search || '')).trim()
      const cleanSearchValue = ('' + this.searchValue).trim()

      if (cleanSearch !== cleanSearchValue) {
        this.searchValue = cleanSearch
      }
    },
    _transmitSearchValue() {
      let needTransmit = this.search === undefined

      const cleanSearchValue = ('' + this.searchValue).trim()

      if (!needTransmit) {
        const cleanSearch = ('' + (this.search || '')).trim()

        needTransmit = cleanSearchValue !== cleanSearch
      }

      if (needTransmit) {
        this.$emit('update:search', cleanSearchValue)
      }
    }
  }
}

export default { core }
