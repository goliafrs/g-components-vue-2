const name = 'g-list-group'

function renderActivatorSlot() {
  if (this.$scopedSlots.activator) {
    return this.$scopedSlots.activator()
  }
  return this.$slots.activator
}

function renderActivator(h) {
  return h(
    'div',
    {
      class: `${name}__activator`,
      on: {
        click: event => {
          event.stopPropagation()
          this.value = !this.value
        }
      }
    },
    [ renderActivatorSlot.call(this, h) ]
  )
}

function renderDefaultSlot() {
  if (this.$scopedSlots.default) {
    return this.$scopedSlots.default()
  }
  return this.$slots.default
}

function renderContent(h) {
  return h(
    'div',
    {
      class: `${name}__content`
    },
    [ renderDefaultSlot.call(this, h) ]
  )
}

export default function(h) {
  return h(
    'div',
    {
      attrs: { role: 'group' },
      class: {
        [`${name}`]: true,

        [`${name}--active`]: this.value
      }
    },
    [
      renderActivator.call(this, h),
      renderContent.call(this, h)
    ]
  )
}
