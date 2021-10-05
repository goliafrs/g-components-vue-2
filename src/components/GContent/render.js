import { classMerger } from '../../utils'

export default function render(h, ctx) {
  return h(
    'main',
    {
      attrs: { id: 'main' },
      class: classMerger('g-content', ctx.data.class),
      directives: ctx.data.directives,
      key: ctx.data.key
    },
    ctx.children
  )
}
