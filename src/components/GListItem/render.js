import { classMerger, isHEX } from '../../utils'

const name = 'g-list-item'

function renderIcon(h, ctx, icon) {
  return h(
    'g-icon',
    {
      class: `${name}__icon`,
      props: {
        value: icon,
        color: ctx.props.color || 'grey',
        size: 21
      }
    }
  )
}

function renderHolder(h, ctx, icon) {
  if (icon) {
    return h(
      'div',
      {
        class: `${name}__holder`
      },
      [ renderIcon.call(this, h, ctx, icon) ]
    )
  }
}

function renderContent(h, ctx) {
  return h(
    'div',
    {
      class: `${name}__content`
    },
    [ ctx.props.label || ctx.children ]
  )
}

export default function(h, ctx) {
  let component = 'div'
  let props
  if (typeof ctx.props.to === 'string' || Object.keys(ctx.props.to).length) {
    component = 'router-link'
    props = { to: ctx.props.to }
  }
  return h(
    component,
    {
      attrs: { role: 'listitem' },
      class: classMerger({
        [`${name}`]: true,

        [`${name}--active`]: ctx.props.active,
        [`${name}--hovered`]: ctx.props.hovered,

        [`${name}--disabled`]: ctx.props.disabled,

        [`${name}--link`]: ctx.props.link,

        [`${name}--prefix`]: !!ctx.props.prefix || !!ctx.props.icon,
        [`${name}--suffix`]: !!ctx.props.suffix,

        [`${name}--${ctx.props.color}`]: !!ctx.props.color && !isHEX(ctx.props.color)
      }, ctx.data.class),
      style: { color: isHEX(ctx.props.color) ? ctx.props.color : null },
      props,
      on: ctx.data.on,
      key: ctx.data.key,
      directives: ctx.data.directives
    },
    [
      renderHolder.call(this, h, ctx, ctx.props.prefix || ctx.props.icon),
      renderContent.call(this, h, ctx),
      renderHolder.call(this, h, ctx, ctx.props.suffix)
    ]
  )
}
