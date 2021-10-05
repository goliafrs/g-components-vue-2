import { classMerger, isHEX, numberToPxOrString } from '../../utils'

function renderPreLoader(h, ctx) {
  if (ctx.props.loading) {
    return h(
      'div',
      {
        class: 'g-button__loading'
      },
      [
        h(
          'g-progress',
          {
            props: {
              indeterminate: true,
              size: 24
            }
          }
        )
      ]
    )
  }
}

function renderIconHolder(h, ctx, icon) {
  if (icon) {
    return h(
      'div',
      {
        class: {
          'g-button__icon': true,
          'square--28': icon && ctx.props.small,
          'square--36': icon && !ctx.props.small && !ctx.props.large,
          'square--44': icon && ctx.props.large
        }
      },
      [ renderIcon.call(this, h, ctx, icon) ]
    )
  }
}

function renderIcon(h, ctx, icon) {
  return h(
    'g-icon',
    {
      props: {
        value: icon,
        size: ctx.props.small ? 18 : ctx.props.large ? 26 : ctx.props.fab ? 30 : 22
      }
    }
  )
}

function renderDialogSlot(h, ctx) {
  if (typeof ctx.scopedSlots.dialog === 'function') {
    return ctx.scopedSlots.dialog()
  }
  return ctx.slots.dialog
}

function renderContent(h, ctx) {
  if (ctx.props.label || ctx.children) {
    return h(
      'div',
      {
        class: 'g-button__content'
      },
      [ ctx.props.label || ctx.children ]
    )
  }
}

export default function render(h, ctx) {
  return h(
    'button',
    {
      attrs: Object.assign(
        {
          tabindex: ctx.props.tabindex,

          disabled: ctx.props.disabled,
          autofocus: ctx.props.autofocus,

          form: ctx.props.form,
          formaction: ctx.props.formaction,
          formenctype: ctx.props.formenctype,
          formmethod: ctx.props.formmethod,
          formnovalidate: ctx.props.formnovalidate,
          formtarget: ctx.props.formtarget,

          name: ctx.props.name,
          type: ctx.props.type,

          value: ctx.props.value
        },
        ctx.data.attrs
      ),
      class: classMerger(
        {
          'g-button': true,

          'g-button--small': ctx.props.small,
          'g-button--large': ctx.props.large,

          'g-button--fab': ctx.props.fab,
          'g-button--flat': ctx.props.flat,
          'g-button--block': ctx.props.block,
          'g-button--round': ctx.props.round ? true : ((!!ctx.props.icon || !!ctx.props.prefix || !!ctx.props.suffix) && (!ctx.props.label && !ctx.children)),
          'g-button--rounded': ctx.props.rounded,
          'g-button--outline': ctx.props.outline,
          'g-button--depressed': ctx.props.depressed,

          'g-button--prefix': ctx.props.prefix || ctx.props.icon,
          'g-button--suffix': ctx.props.suffix,

          'g-button--toolbar': ctx.props.toolbar,

          'g-button--fixed': ctx.props.fixed,
          'g-button--absolute': ctx.props.absolute,

          'g-button--top': typeof ctx.props.top === 'boolean' && ctx.props.top,
          'g-button--bottom': typeof ctx.props.bottom === 'boolean' && ctx.props.bottom,
          'g-button--left': typeof ctx.props.left === 'boolean' && ctx.props.left,
          'g-button--right': typeof ctx.props.right === 'boolean' && ctx.props.right,

          'g-button--disabled': ctx.props.disabled,
          'g-button--loading': ctx.props.loading,

          [`g-button--${ctx.props.type}`]: !!ctx.props.type,
          [`g-button--${ctx.props.color}`]: !!ctx.props.color && !isHEX(ctx.props.color)
        },
        ctx.data.class
      ),
      style: Object.assign(
        {
          color: isHEX(ctx.props.color) ? ctx.props.color : null,
          top: numberToPxOrString(ctx.props.top),
          bottom: numberToPxOrString(ctx.props.bottom),
          left: numberToPxOrString(ctx.props.left),
          right: numberToPxOrString(ctx.props.right)
        },
        ctx.data.style
      ),
      directives: ctx.data.directives,
      on: ctx.data.on,
      slot: ctx.data.slot,
      key: ctx.data.key
    },
    [
      renderIconHolder.call(this, h, ctx, ctx.props.prefix || ctx.props.icon),
      renderContent.call(this, h, ctx),
      renderIconHolder.call(this, h, ctx, ctx.props.suffix),
      renderPreLoader.call(this, h, ctx),
      renderDialogSlot.call(this, h, ctx)
    ]
  )
}
