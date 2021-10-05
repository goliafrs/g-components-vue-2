export default function render(h) {
  return h(
    'div',
    {
      class: {
        'g-expansion-panels': true,
        'g-expansion-panels--flat': this.flat,
        'g-expansion-panels--outline': this.outline,
        'g-expansion-panels--rounded': this.rounded
      },
      key: `g-expansion-panels-${this._uid}`
    },
    this.$slots.default
  )
}
