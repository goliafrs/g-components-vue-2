function renderIcon(h, ctx) {
  if (ctx.props.icon.show) {
    return h(
      'g-icon',
      {
        props: {
          library: ctx.props.icon.library,
          value: ctx.props.icon.value,
          color: ctx.props.icon.color || ctx.props.color,
          size: ctx.props.icon.size || ctx.props.size
        }
      }
    )
  }
}

function renderTitle(h, ctx) {
  if (ctx.props.title) {
    return h(
      'div',
      {
        class: 'g-empty__title'
      },
      ctx.props.title
    )
  }
}

export default function render(h, ctx) {
  return h(
    'div',
    {
      class: {
        'g-empty': true,
        'g-empty--padless': ctx.props.padless
      },
      directives: ctx.data.directives,
      key: ctx.data.key
    },
    [
      renderIcon.call(this, h, ctx),
      renderTitle.call(this, h, ctx)
    ]
  )
}
