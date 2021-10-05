import { isEmpty } from '../../utils'

import { core } from '../GInput/mixins'

import { basic } from './mixins'

import render from './render'

export default {
  name: 'GTextField',

  mixins: [ core(), basic ],

  props: {
    label: String,
    hint: String,

    focusedClass: {
      type: String,
      default: 'text--primary'
    },

    mode: {
      type: String,
      default: 'default',
      validator: value => {
        return !!~[ 'default', 'solo', 'outline', 'outline-label' ].indexOf(value)
      }
    },

    backgroundColor: {
      type: String,
      default: null
    },

    prefix: [ String, Number ],
    suffix: [ String, Number ],

    count: [ String, Number ],

    replace: {
      type: Function,
      default: v => v
    },

    clearable: {
      type: Boolean,
      default: false
    },
    details: {
      type: Boolean,
      default: true
    },
    flat: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    trim: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    validateOnBlur: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    computedPlaceholder() {
      if (this.placeholder) {
        const placeholder = [ this.placeholder, this.required && '*' ].filter(item => !!item).join(' ')
        switch (this.mode) {
          case 'box':
          case 'solo':
          case 'outline': {
            if (this.details === false && this.error) {
              return this.error
            } else {
              return placeholder
            }
          }
          case 'default':
          default: {
            return placeholder
          }
        }
      }
    }
  },

  methods: {
    focusInput() {
      if (!this.isDisabled) {
        if (this.input && this.input.focus) {
          this.$nextTick(() => {
            this.input.focus()
          })
        }
      }
    },

    focusIn(event) {
      if (!this.isDisabled) {
        this.isFocused = true

        this._clearCurrentError()

        this.$emit('focus', event)
      }
    },
    focusOut(event) {
      if (!this.isDisabled) {
        if (this.required && isEmpty(this.proxy)) {
          this._data._errorOnRequired = true
        }

        if (this.error && this.validateOnBlur) {
          this._data._errorOnBlur = true
        }

        if (this.trim && !isEmpty(this.proxy) && typeof this.proxy === 'string' && this.type === 'text') {
          this.proxy = this.proxy.trim()
        }

        this.isFocused = false
        this.$emit('blur', event)
      }
    },

    onMouseDown(event) {
      if (!this.isDisabled) {
        this.isActive = true
        this.$emit('mousedown', event)
      }
    },
    onMouseUp(event) {
      if (!this.isDisabled) {
        this.isActive = false
        this.$emit('mouseup', event)
      }
    },
    onKeyPress(event) {
      if (!this.isDisabled) {
        this.$emit('keypress', event)
      }
    },
    onClick(event) {
      if (!this.isDisabled) {
        this.focusInput()
        this.$emit('click', event)
      }
    }
  },

  render
}
