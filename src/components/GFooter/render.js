import { numberToPxOrString, isHEX } from '../../utils'

const name = 'g-footer'

export default function(h) {
  return h(
    'footer',
    {
      class: {
        [name]: true,

        [`${name}--dense`]: this.dense,

        [`${name}--fixed`]: this.fixed,

        [`${name}--${this.color}`]: !!this.color && !isHEX(this.color)
      },
      style: {
        color: isHEX(this.color) ? this.color : null,
        'min-height': numberToPxOrString(this.minHeight),
        'max-height': numberToPxOrString(this.maxHeight),
        height: numberToPxOrString(this.height),
        'min-width': numberToPxOrString(this.minWidth),
        'max-width': numberToPxOrString(this.maxWidth),
        width: numberToPxOrString(this.width)
      },
      ref: 'footer'
    },
    [ this.$slots.default ]
  )
}
