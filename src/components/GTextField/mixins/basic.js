import proxy from 'g-proxy'

import { createMask } from 'imask'

import { isEmpty } from '../../../utils'

const valueChangeEvent = new Event('valuechange', { bubbles: true })

export const basic = {
  mixins: [ proxy() ],

  props: {
    defaultValue: {
      type: null,
      default: undefined
    },

    focused: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },

    beforeIcon: String,
    beforeIconCallback: {
      type: Function,
      default: v => v
    },

    afterIcon: String,
    afterIconCallback: {
      type: Function,
      default: v => v
    },

    error: String,

    mask: [ String, Array ]
  },

  data() {
    return {
      _active: false,

      _focused: false,

      _error: false,
      _errorOnBlur: false,
      _errorOnRequired: false
    }
  },

  computed: {
    input() {
      return (this.$refs && this.$refs.input && (this.$refs.input.$el || this.$refs.input)) || undefined
    },

    masked() {
      if (this.mask) {
        return createMask({ mask: this.mask })
      }
    },

    isClearable() {
      return this.clearable && !this.isDisabled && !isEmpty(this.proxy)
    },
    isDisabled() {
      return !!(this.disabled || this.readonly)
    },

    isActive: {
      get() {
        return !!this._data._active
      },
      set(value) {
        this._data._active = !!value
      }
    },
    isFocused: {
      get() {
        return !!this._data._focused
      },
      set(value) {
        this._data._focused = !!value
      }
    },
    isError: {
      get() {
        return !!(this._data._error || this._data._errorOnBlur || this._data._errorOnRequired)
      },
      set(value) {
        if (!value) {
          this._clearCurrentError()
        }
        this._data._error = !!value
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
    }
  },

  watch: {
    error() {
      this.isError = this.error
    },
    active() {
      this.isActive = this.active
    },
    focused() {
      this.isFocused = this.focused
    }
  },

  mounted() {
    if (this.proxy === undefined && this.required) {
      this.proxy = this.defaultValue
    }

    if (this.autofocus && !this.isDisabled) {
      this.focusInput()
    }
  },

  methods: {
    _inputFilter(value) {
      this._clearCurrentError()

      if (this.type === 'number') {
        if (typeof value === 'string') {
          value = value.replace(',', '.')
          value = parseFloat(value)
        }
        if (isNaN(value)) {
          value = undefined
        }
      }

      if (this.masked && value) {
        return this.masked.resolve(value)
      }

      this.$nextTick(() => {
        if (this.input) {
          this.input.dispatchEvent(valueChangeEvent)
        }
      })

      return value
    },
    _outputFilter(value) {
      if (this.type === 'number') {
        if (value && value.length > 0) {
          value = value.replace(',', '.')
        }
      }

      return value
    },

    _clearCurrentError() {
      if (this.isError) {
        this._data._error = false
        this._data._errorOnBlur = false
        this._data._errorOnRequired = false
      }
    },

    _clear() {
      if (!this.isDisabled) {
        this.proxy = this.defaultValue
        this._clearCurrentError()
        this.focusInput()
      }
    }
  }
}

export default { basic }
