import { classMerger, isHEX } from '../../utils'

const getIconSize = ctx => {
  let size = 22
  switch (true) {
    case ctx.props.tiny:
      size = 14
      break
    case ctx.props.small:
      size = 18
      break
    case ctx.props.large:
      size = 26
      break
    default:
      size = 22
      break
  }
  return size
}

function renderPreLoader(h, ctx) {
  if (ctx.props.loading) {
    return h(
      'div',
      {
        class: 'g-chip__loading'
      },
      [
        h(
          'g-progress',
          {
            props: {
              indeterminate: true,
              width: ctx.props.small ? 1 : 2,
              size: getIconSize(ctx)
            }
          }
        )
      ]
    )
  }
}

function renderIcon(h, ctx, icon) {
  if (icon) {
    return h(
      'g-icon',
      {
        class: 'g-chip__icon',
        props: {
          value: icon,
          size: getIconSize(ctx)
        }
      }
    )
  }
}

function renderIconHolder(h, ctx, content) {
  if (content) {
    return h(
      'div',
      {
        class: 'g-chip__holder'
      },
      [ content ]
    )
  }
}

function renderCancelable(h, ctx) {
  if (ctx.props.cancelable) {
    return renderIconHolder.call(this, h, ctx, h(
      'g-icon',
      {
        props: {
          value: ctx.props.cancelIcon,
          size: getIconSize(ctx),
          color: ctx.props.color ? 'white' : undefined
        },
        on: {
          click: () => {
            if (typeof ctx.props.cancelCallback === 'function') {
              ctx.props.cancelCallback()
            }
          }
        }
      }
    ))
  }
}

function renderContent(h, ctx) {
  let content = ctx.props.label + ''
  if (ctx.props.cut && typeof content === 'string' && content.length > ctx.props.length) {
    content = content.substring(0, ctx.props.length) + '...'
  }
  if (ctx.children) {
    content = ctx.children
  }
  if (content) {
    return h(
      'div',
      {
        class: 'g-chip__content'
      },
      [ content ]
    )
  }
}

export default function render(h, ctx) {
  return h(
    'div',
    {
      attrs: ctx.data.attrs,
      class: classMerger(
        {
          'g-chip': true,

          'g-chip--tiny': ctx.props.tiny,
          'g-chip--small': ctx.props.small,
          'g-chip--large': ctx.props.large,

          'g-chip--circle': ctx.props.circle,
          'g-chip--outline': ctx.props.outline,

          'g-chip--icon': ctx.props.icon,
          'g-chip--prefix': ctx.props.prefix,
          'g-chip--suffix': ctx.props.suffix,

          'g-chip--cancelable': ctx.props.cancelable,

          'g-chip--link': ctx.data.on && ctx.data.on.click,

          'g-chip--loading': ctx.props.loading,
          'g-chip--disabled': ctx.props.disabled,

          [`g-chip--${ctx.props.color}`]: !!ctx.props.color && !isHEX(ctx.props.color)
        },
        ctx.data.class
      ),
      style: Object.assign(
        {
          color: isHEX(ctx.props.color) ? ctx.props.color : null
        },
        ctx.data.style
      ),
      directives: ctx.data.directives,
      on: ctx.data.on,
      key: ctx.data.key
    },
    [
      renderIconHolder.call(this, h, ctx, renderIcon.call(this, h, ctx, ctx.props.icon || ctx.props.prefix)),
      renderContent.call(this, h, ctx, ctx.props.icon),
      renderIconHolder.call(this, h, ctx, renderIcon.call(this, h, ctx, ctx.props.suffix)),
      renderCancelable.call(this, h, ctx),
      renderPreLoader.call(this, h, ctx)
    ]
  )
}
