import { classMerger } from '../../utils'

const name = 'g-card-actions'

export default function render(h, ctx) {
  return h(
    'div',
    {
      class: classMerger(
        {
          [name]: true,
          [`${name}--dense`]: ctx.props.dense
        },
        ctx.data.class
      ),
      style: ctx.data.style,
      directives: ctx.data.directives,
      key: ctx.data.key
    },
    ctx.children
  )
}
