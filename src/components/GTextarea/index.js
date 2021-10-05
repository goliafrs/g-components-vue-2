import { isEmpty } from '../../utils'

import { core } from '../GInput/mixins'

import { basic } from './mixins'

import render from './render'

export default {
  name: 'GTextarea',

  mixins: [ core('textarea'), basic ],

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

    resize: {
      type: String,
      default: 'none',
      validator: value => {
        return !!~[
          'none',
          'both',
          'horizontal',
          'vertical'
        ].indexOf(value)
      }
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
    },
    grow: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    computedPlaceholder() {
      if (this.placeholder) {
        const placeholder = [ this.placeholder, this.required && '*' ].filter(item => !!item).join(' ')
        switch (this.mode) {
          case 'solo':
          case 'outline': {
            if (this.details === false && this.error || this.success) {
              return this.error || this.success
            } else {
              return placeholder
            }
          }
          case 'outline-label':
          case 'default':
          default: {
            return placeholder
          }
        }
      }
    }
  },

  mounted() {
    if (this.grow) {
      this.delayedResize()
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

        if (this.isError) {
          this._clearCurrentError()
        }

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
    },

    resizeHeight() {
      if (this.grow) {
        const textarea = document.getElementById(this.id || `g-input-${this._uid}`)
        if (textarea) {
          let height = 'auto'
          if (this.rows) {
            height = 18 * this.rows
          }
          textarea.style.height = height + 'px'
          textarea.style.height = textarea.scrollHeight + 'px'
        }
      }
    },
    delayedResize() {
      window.setTimeout(this.resizeHeight, 0)
    }
  },

  render
}
