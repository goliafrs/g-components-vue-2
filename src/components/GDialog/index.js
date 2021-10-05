import proxy from 'g-proxy'

import { detachable, size } from '../../utils'

import render from './render'

export default {
  name: 'GDialog',

  mixins: [ proxy(), detachable, size ],

  props: {
    fullscreen: {
      type: Boolean,
      default: false
    },
    fullscreenMobile: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: [ String, Number ],
      default: 7
    },
    overflow: {
      type: Boolean,
      default: false
    },
    scroll: {
      type: Boolean,
      default: false
    },

    closeOnClick: {
      type: Boolean,
      default: true
    },
    closeOnEsc: {
      type: Boolean,
      default: true
    },

    rounded: {
      type: Boolean,
      default: false
    },

    close: {
      type: Boolean,
      default: false
    },

    align: {
      type: String,
      default: 'center',
      validator: value => {
        return !!~[ 'top', 'bottom', 'left', 'right', 'center' ].indexOf(value)
      }
    }
  },

  data() {
    return {
      _rootElement: this.rootElement
    }
  },

  computed: {
    isFullscreen() {
      return this.fullscreen || (this.viewport.size.width < 768 && this.fullscreenMobile)
    }
  },

  watch: {
    proxy() {
      this.setOverflow()
      this.$nextTick(() => {
        this.$emit('isShown', this.proxy)
      })
    }
  },

  mounted() {
    if (this._data._rootElement && this._data._rootElement.addEventListener) {
      this._data._rootElement.addEventListener('keyup', this._closeOnEscHandler)
    }
  },

  beforeDestroy() {
    this.hide()
    if (this._data._rootElement && this._data._rootElement.removeEventListener) {
      this._data._rootElement.removeEventListener('keyup', this._closeOnEscHandler)
    }
  },

  methods: {
    show() {
      this.proxy = true
      this.setOverflow()
    },
    hide() {
      this.proxy = false
      this.setOverflow()
    },

    toggle() {
      this.proxy ? this.hide() : this.show()
    },

    setOverflow() {
      if (document) {
        if (this.proxy) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = null
        }
      }
    },

    _closeOnEscHandler(event) {
      if (this.closeOnEsc && event.keyCode === 27) {
        this.hide()
      }
    }
  },

  render
}
