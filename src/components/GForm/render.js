export default function(h) {
  return h(
    'form',
    {
      attrs: {
        id: `g-form-${this._uid}`,

        action: this.action,
        'accept-charset': this.acceptCharset,
        autocomplete: this.autocomplete,
        enctype: this.enctype,
        method: this.method,
        name: this.name,
        novalidate: this.novalidate,
        rel: this.rel,
        target: this.target
      },
      on: {
        input: event => {
          this.$emit('input', event)
        },
        change: event => {
          this.$emit('change', event)
        },
        invalid: event => {
          this.$emit('invalid', event)
        },
        submit: event => {
          event.preventDefault()
          this.$emit('submit', event)
        }
      },
      key: `g-form-${this._uid}`,
      ref: 'form'
    },
    [ this.$slots.default ]
  )
}
