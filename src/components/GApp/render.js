import { classMerger } from '../../utils'

const name = 'g-app'

export default function render(h, ctx) {
  return h(
    'div',
    {
      attrs: { id: 'app' },
      class: classMerger({
        [name]: true,

        [`${name}--${ctx.props.theme}`]: true,

        [`${name}--center`]: ctx.props.center
      }, ctx.data.class)
    },
    [ ctx.children ]
  )
}
