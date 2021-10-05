import { classMerger, numberToPxOrString } from '../../utils'

const name = 'g-divider'

export default function render(h, ctx) {
  return h(
    'div',
    {
      class: classMerger({
        [name]: true,
        [`${name}--${ctx.props.type}`]: true
      }, ctx.data.class),
      style: {
        'border-style': ctx.props.style,
        'border-color': ctx.props.color,
        'border-width': numberToPxOrString(ctx.props.size)
      }
    }
  )
}
