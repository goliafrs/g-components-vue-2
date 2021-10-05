import { isHEX, classMerger } from '../../utils'

const name = 'g-toolbar'

export default function render(h, ctx) {
  return h(
    'nav',
    {
      attrs: { id: 'navigation' },
      class: classMerger(
        {
          [name]: true,

          [`${name}--fixed`]: ctx.props.fixed,

          [`${name}--${ctx.props.color}`]: !!ctx.props.color && !isHEX(ctx.props.color)
        }, ctx.data.class
      ),
      style: { color: isHEX(ctx.props.color) ? ctx.props.color : null }
    },
    [ ctx.children ]
  )
}
