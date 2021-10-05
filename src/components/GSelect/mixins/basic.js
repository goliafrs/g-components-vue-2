export const basic = {
  props: {
    error: String,

    active: {
      type: Boolean,
      default: false
    },
    focused: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },

    beforeIcon: String,
    beforeIconCallback: {
      type: Function,
      default: v => v
    },

    afterIcon: {
      type: String,
      default: 'arrow_drop_down'
    },
    afterIconCallback: {
      type: Function,
      default: v => v
    }
  },

  data() {
    return {
      _error: undefined,
      _errorOnBlur: false,
      _errorOnRequired: false,

      _isLoading: false,
      _isActive: false,
      _isFocused: false
    }
  },

  computed: {
    main() {
      return (this.$refs && this.$refs.main && (this.$refs.main.$el || this.$refs.main)) || this.$el
    },
    menu() {
      return (this.$refs && this.$refs.menu && (this.$refs.menu.$el || this.$refs.menu)) || undefined
    },

    isDisabled() {
      return this.disabled || this.readonly
    },
    isClearable() {
      return this.clearable && this.selectedItems.length && !this.isDisabled
    },
    isFreeInput() {
      return this.freeInput || this.combobox
    },
    isDeleteWithBackspace() {
      return this.deleteWithBackspace || this.autocomplete
    },
    isSearchLocally() {
      return this.searchLocally || this._data._searchLocally
    },

    isLoading: {
      get() {
        return this._data._isLoading
      },
      set(value) {
        this._data._isLoading = !!value
      }
    },
    isFocused: {
      get() {
        return this._data._isFocused
      },
      set(value) {
        this._data._isFocused = !!value
      }
    },
    isActive: {
      get() {
        return this._data._isActive || this._data._show.dropdown
      },
      set(value) {
        this._data._isActive = !!value
      }
    },
    isError: {
      get() {
        return this._data._errorOnBlur || this._data._errorOnRequired
      },
      set(value) {
        this._data._error = value
        this._data._errorOnBlur = !!value
      }
    },

    hasBefore() {
      return this.hasBeforeSlot || this.beforeIcon
    },
    hasBeforeSlot() {
      return !!(this.$scopedSlots.before || this.$slots.before)
    },

    hasAfter() {
      return this.hasAfterSlot || (this.loading && this.mode !== 'default') || this.isClearable || this.afterIcon
    },
    hasAfterSlot() {
      return !!(this.$scopedSlots.after || this.$slots.after)
    },

    showMobileDialog() {
      return typeof this.activateMobile === 'boolean' ? this.activateMobile : this.viewport.size.width < 768
    }
  },

  watch: {
    loading() {
      this.isLoading = this.loading
    },
    error() {
      this.isError = this.error
    },
    active() {
      this.isActive = this.active
    },
    focused() {
      this.isFocused = this.focused
    }
  }
}

export default { basic }
