const name = 'g-list'

function renderItemSlot(item) {
  if (typeof this.$scopedSlots.item === 'function') {
    return this.$scopedSlots.item(item)
  }

  return item
}

function renderContent() {
  if (Array.isArray(this.items) && this.items.length) {
    return this.items.map(item => {
      return renderItemSlot.call(this, item)
    })
  }

  return this.$slots.default
}

export default function(h) {
  return h(
    'div',
    {
      attrs: { role: 'list' },
      class: {
        [`${name}`]: true,

        [`${name}--wrap`]: this.wrap,
        [`${name}--dense`]: this.dense,
        [`${name}--rounded`]: this.rounded,
        [`${name}--transparent`]: this.transparent
      }
    },
    [ renderContent.call(this) ]
  )
}
