const name = 'g-input'

export default function(h) {
  return h(
    this.component,
    {
      attrs: this.attributes,
      class: name,
      domProps: { value: this.value },
      on: {
        focus: this._eventHandler,
        blur: this._eventHandler,
        click: this._eventHandler,
        mousedown: this._eventHandler,
        mouseup: this._eventHandler,
        keypress: this._eventHandler,
        keydown: this._eventHandler,
        keyup: this._eventHandler,
        input: this._eventHandler,
        change: this._eventHandler,
        paste: this._eventHandler
      },
      key: `${name}-${this._uid}`
    }
  )
}
