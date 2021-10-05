function renderHeader(h) {
  return h(
    'div',
    {
      class: 'g-expansion-panel__header',
      on: {
        click: () => {
          if (!this.preventClick) {
            this.toggle()
          }
        }
      }
    },
    [
      this.$scopedSlots.header ? this.$scopedSlots.header({
        toggle: this.toggle,
        expanded: this.expanded
      }) : this.$slots.header
    ]
  )
}

function renderBody(h) {
  if (this.expanded) {
    return h(
      'div',
      {
        class: 'g-expansion-panel__body'
      },
      [
        this.$scopedSlots.default ? this.$scopedSlots.default({
          toggle: this.toggle,
          expanded: this.expanded
        }) : this.$slots.default
      ]
    )
  }
}

export default function render(h) {
  return h(
    'div',
    {
      class: 'g-expansion-panel',
      key: `g-expansion-panel-${this._uid}`
    },
    [ renderHeader.call(this, h), renderBody.call(this, h) ]
  )
}
