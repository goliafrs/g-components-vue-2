const name = 'g-checkbox'

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

export default function render(h) {
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
        [`${name}--disabled`]: this.disabled
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
          class: `${name}__holder`
        },
        [
          h(
            'div',
            {
              class: `${name}__background`,
              style: {
                'border-color': this.color,
                'background-color': this.color
              }
            },
            [
              h(
                'svg',
                {
                  attrs: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: '0 0 24 24'
                  },
                  class: `${name}__checkmark`
                },
                [
                  h(
                    'path',
                    {
                      attrs: { d: 'M1.73 12.91 8.1 19.28 22.79 4.59' },
                      class: `${name}__checkmark__path`
                    }
                  )
                ]
              )
            ]
          )
        ]
      ),

      renderLabel.call(this, h)
    ]
  )
}
