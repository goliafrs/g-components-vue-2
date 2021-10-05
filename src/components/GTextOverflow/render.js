export default function(h) {
  return h(
    'div',
    {
      class: 'faic fass',
      style: { 'max-width': '100%' },
      directives: this.directives,
      key: this._uid
    },
    [
      h(
        'div', {
          attrs: { id: `g-text-${this._uid}` },
          class: 'text-overflow',
          domProps: { innerHTML: this.value }
        }
      )
    ]
  )
}
