import { numberToPxOrString } from '../../utils'

const name = 'g-menu'

function renderActivator(h) {
  return h(
    'div',
    {
      class: `${name}__activator`,
      on: {
        click: () => {
          if (!this.disabled) {
            this.proxy = true
          }
        }
      },
      ref: 'activator'
    },
    [ this.$scopedSlots.activator ? this.$scopedSlots.activator() : this.$slots.activator ]
  )
}

function renderContent(h) {
  return h(
    'div',
    {
      class: {
        [`${name}__content`]: true,
        [`${name}__content--active`]: !!this.popperInstance || this.proxy,
        [`${name}__content--rounded`]: this.rounded,
        [`${name}__content--transparent`]: this.transparent
      },
      style: {
        'overflow-y': this.overflowY,
        'overflow-x': this.overflowX,
        'min-height': numberToPxOrString(this.minHeight),
        'max-height': numberToPxOrString(this.maxHeight),
        height: numberToPxOrString(this.height),
        'min-width': numberToPxOrString(this.minWidth),
        'max-width': numberToPxOrString(this.maxWidth),
        width: numberToPxOrString(this.width)
      },
      on: {
        click: event => {
          event.stopPropagation()

          if (!!this.popperInstance && this.checkForDisabled(event.target)) {
            return
          }

          if (this.closeOnContentClick) {
            if (this.childComponents.length) {
              this.childComponents.forEach(child => {
                child.proxy = false
              })
            }

            this.proxy = false
          }
        }
      },
      ref: 'content'
    },
    [ this.$scopedSlots.default ? this.$scopedSlots.default() : this.$slots.default ]
  )
}

export default function(h) {
  return h(
    'div',
    {
      class: {
        [`${name}`]: true,
        [`${name}--disabled`]: this.disabled
      },
      ref: 'holder'
    },
    [ renderActivator.call(this, h), renderContent.call(this, h) ]
  )
}
