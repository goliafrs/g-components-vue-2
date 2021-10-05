import { numberToPxOrString } from '../../utils'

const name = 'g-dialog'

function renderOverlay(h) {
  return h(
    'div',
    {
      class: `${name}__overlay`,
      on: {
        click: () => {
          if (this.closeOnClick) {
            this.hide()
          }
        }
      }
    }
  )
}

function renderCloseButton(h) {
  if (this.close) {
    return h(
      'g-button',
      {
        class: `${name}__close-button`,
        props: {
          flat: true,
          icon: 'clear',
          color: 'white'
        },
        on: {
          click: () => {
            this.toggle()
          }
        }
      }
    )
  }
}

function renderHeader(h) {
  return h(
    'div',
    {
      class: `${name}__header`
    },
    [ this.$slots.header ]
  )
}

function renderBody(h) {
  return h(
    'div',
    {
      class: `${name}__body`,
      style: {
        'min-height': this.minHeight,
        'max-height': this.isFullscreen ? this.maxHeight : '600px',
        height: this.isFullscreen ? '100%' : this.height
      }
    },
    [ this.$slots.default ]
  )
}

function renderFooter(h) {
  return h(
    'div',
    {
      class: `${name}__footer`
    },
    [ this.$slots.footer ]
  )
}

function renderContent(h) {
  if (this.proxy) {
    return h(
      'div',
      {
        class: {
          [`${name}`]: true,
          [`${name}--rounded`]: this.rounded,
          [`${name}--overflow`]: this.overflow,
          [`${name}--scroll`]: this.scroll,
          [`${name}__align--${this.align}`]: true
        },
        style: { 'z-index': this.zIndex }
      },
      [
        h(
          'div',
          {
            class: `${name}__holder`,
            style: {
              'min-height': this.isFullscreen ? '100%' : numberToPxOrString(this.minHeight),
              'max-height': this.isFullscreen ? '100%' : numberToPxOrString(this.maxHeight),
              height: this.isFullscreen ? '100%' : numberToPxOrString(this.height),
              'min-width': this.isFullscreen ? '100%' : numberToPxOrString(this.minWidth),
              'max-width': this.isFullscreen ? '100%' : numberToPxOrString(this.maxWidth),
              width: this.isFullscreen ? '100%' : numberToPxOrString(this.width)
            }
          },
          [
            renderCloseButton.call(this, h),
            renderHeader.call(this, h),
            renderBody.call(this, h),
            renderFooter.call(this, h)
          ]
        ),

        renderOverlay.call(this, h)
      ]
    )
  }
}

export default function render(h) {
  return h(
    'transition',
    {
      props: { name: 'show-dialog' }
    },
    [ renderContent.call(this, h) ]
  )
}
