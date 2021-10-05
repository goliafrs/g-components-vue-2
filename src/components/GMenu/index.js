import proxy from 'g-proxy'

import { createPopper } from '@popperjs/core'

import { isChildOf, size } from '../../utils'

import render from './render'

export default {
  name: 'GMenu',

  mixins: [ proxy(), size ],

  props: {
    attach: null,

    placement: {
      type: String,
      default: 'bottom-start',
      validator: value => {
        return !!~[
          'auto',
          'auto-start',
          'auto-end',
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'right',
          'right-start',
          'right-end',
          'left',
          'left-start',
          'left-end'
        ].indexOf(value)
      }
    },
    fallbackPlacements: {
      type: Array,
      default: () => [ 'top-start' ]
    },

    strategy: {
      type: String,
      default: 'absolute',
      validator: value => {
        return !!~[ 'absolute', 'fixed' ].indexOf(value)
      }
    },

    offsetSkidding: {
      type: Number,
      default: 0
    },
    offsetDistance: {
      type: Number,
      default: 0
    },

    disabled: {
      type: Boolean,
      default: false
    },

    closeOnContentClick: {
      type: Boolean,
      default: true
    },
    closeOnClick: {
      type: Boolean,
      default: true
    },

    overflowX: {
      type: String,
      default: 'visible'
    },
    overflowY: {
      type: String,
      default: 'visible'
    },

    rounded: Boolean,
    transparent: Boolean,

    width: {
      type: [ String, Number ],
      default: 'auto'
    }
  },

  data() {
    return {
      popperInstance: undefined,

      placementEmbedded: undefined,
      fallbackPlacementsEmbedded: undefined,

      rootElement: undefined,

      offsetModifier: {
        name: 'offsetModifier',
        enabled: true,
        phase: 'beforeWrite',
        requires: [ 'computeStyles', 'offset' ],
        fn: this.setOffset
      },

      childComponents: []
    }
  },

  computed: {
    options() {
      return {
        placement: this.placementEmbedded || this.placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: ({ placement }) => {
                if (this.proxy && this.attach && placement === 'top-start') {
                  return [ this.offsetSkidding, 55 ]
                } else {
                  return [ this.offsetSkidding, this.offsetDistance ]
                }
              }
            }
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: this.fallbackPlacementsEmbedded || this.fallbackPlacements,
              altBoundary: true
            }
          },
          this.offsetModifier
        ],
        strategy: this.strategy
      }
    }
  },

  watch: {
    proxy(value) {
      if (value) {
        this.show()
      } else {
        this.hide()
      }
    }
  },

  mounted() {
    this.rootElement = document.getElementById('app')

    this.checkParent()

    if (this.rootElement) {
      if (this.$refs.content) {
        this.rootElement.prepend(this.$refs.content)
      }

      if (this.closeOnClick) {
        this.rootElement.addEventListener('click', this.clickHandler)
      }
    }
  },

  beforeDestroy() {
    this.destroy()

    if (this.rootElement) {
      this.rootElement.removeEventListener('click', this.clickHandler)

      if (this.$refs.content) {
        this.$refs.content.remove()
      }
    }
  },

  methods: {
    create() {
      if (this.popperInstance) {
        this.destroy()
      }

      this.popperInstance = createPopper(
        this.attach || this.$refs.activator,
        this.$refs.content,
        this.options
      )

      this.$nextTick(() => {
        this.popperInstance.update()
      })
    },

    destroy() {
      if (this.popperInstance) {
        this.popperInstance.destroy()
        this.popperInstance = undefined
      }
    },

    show() {
      if (this.$refs.content) {
        this.create()
      }
    },

    hide() {
      if (this.$refs.content) {
        this.destroy()
      }
    },

    checkForDisabled(target) {
      while (target) {
        if (
          target.className &&
          (typeof target.className === 'string' || Array.isArray(target.className)) &&
          (~target.className.indexOf('disabled') || target.hasAttribute('disabled'))
        ) {
          return true
        }
        target = target.parentElement
      }

      return false
    },

    getTargetCoordinates(target) {
      let styles
      while (target) {
        styles = window.getComputedStyle(target)
        if (styles.transform !== 'none') {
          return target.getBoundingClientRect()
        }

        target = target.parentElement
      }
    },

    checkParent() {
      let parent = this.$parent
      while (parent) {
        if (parent.$vnode && parent.$vnode.tag) {
          if (~parent.$vnode.tag.indexOf('GSelect')) {
            return
          }
        }

        parent = parent.$parent
      }
    },

    clickHandler(event) {
      if (!this.disabled && !isChildOf(event.target, this.$refs.holder)) {
        this.proxy = false
      }
    },

    setOffset({ state }) {
      const { options, elements } = state
      const reference = elements.reference
      switch (options.strategy) {
        case 'fixed': {
          const transformCoordinates = this.getTargetCoordinates(reference)
          if (transformCoordinates) {
            const referenceCoordinates = reference.getBoundingClientRect()

            const offsetX = state.modifiersData.offset[state.placement].x
            const offsetY = state.modifiersData.offset[state.placement].y

            state.styles.popper.transform = `translate(${referenceCoordinates.x - transformCoordinates.x + offsetX}px, ${referenceCoordinates.y - transformCoordinates.y + offsetY}px)`
          }
          break
        }
      }
    }
  },

  render
}
