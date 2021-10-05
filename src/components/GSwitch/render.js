const name = 'g-switch'

function renderLabel(h) {
  if (this.label) {
    return h(
      'label',
      {
        class: `${name}__label`
      },
      this.label
    )
  }
}

export default function(h) {
  return h(
    'div',
    {
      attrs: {
        role: 'checkbox',
        'aria-checked': typeof this.proxy === 'boolean' ? '' + this.proxy : 'mixed'
      },
      class: {
        [`${name}`]: true,
        [`${name}--checked`]: this.checked,
        [`${name}--disabled`]: this.disabled,
        [`${name}--small`]: this.small,
        [`${name}--large`]: this.large
      },
      on: {
        click: () => {
          this.toggle()
        }
      }
    },
    [
      h(
        'div',
        {
          class: `${name}__rail`
        },
        [ h('div', { class: `${name}__thumb` }) ]
      ),

      renderLabel.call(this, h)
    ]
  )
}
