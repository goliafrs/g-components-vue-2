const name = 'g-sidebar'

function renderContent(h) {
  return h(
    'div',
    {
      class: 'g-sidebar__content'
    },
    [ this.$slots.default ]
  )
}

function renderOverlay(h) {
  if (this.mobile && this.value) {
    return h(
      'div',
      {
        class: `${name}__overlay`,
        on: {
          click: () => {
            this.$emit('input', !this.value)
          }
        }
      }
    )
  }
}

export default function render(h) {
  return h(
    'aside',
    {
      attrs: { id: 'sidebar' },
      class: {
        [name]: true,

        [`${name}--hide`]: !this.value,

        [`${name}--mobile`]: this.mobile
      }
    },
    [ renderContent.call(this, h), renderOverlay.call(this, h) ]
  )
}
