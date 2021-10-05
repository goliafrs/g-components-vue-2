import { classMerger } from '../../utils'

export default function render(h, ctx) {
  return h(
    'div',
    {
      attrs: ctx.data.attrs,
      class: classMerger(
        {
          'g-subheader': true,
          'g-subheader--dense': ctx.props.dense
        },
        ctx.data.class
      ),
      directives: ctx.data.directives,
      style: ctx.data.style,
      on: ctx.data.on,
      key: ctx.data.key
    },
    [ ctx.props.value || ctx.children ]
  )
}
