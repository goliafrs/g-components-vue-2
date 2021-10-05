import { classMerger, numberToPxOrString } from '../../utils'

export default function render(h, ctx) {
  const accentStyles = {}
  if (ctx.props.accent) {
    accentStyles[`border-${ctx.props.accentPosition}-style`] = 'solid'
    accentStyles[`border-${ctx.props.accentPosition}-width`] = numberToPxOrString(ctx.props.accentSize)
    if (!ctx.props.accentColorName) {
      accentStyles[`border-${ctx.props.accentPosition}-color`] = ctx.props.accentColor
    }
  }
  return h(
    'div',
    {
      class: classMerger(
        {
          'g-card': true,

          'g-card--flat': ctx.props.flat,
          'g-card--outline': ctx.props.outline,
          'g-card--hover': ctx.props.hover,
          'g-card--rounded': ctx.props.rounded,
          'g-card--transparent': ctx.props.transparent,

          [`g-card--accent-${ctx.props.accentColorName}`]: !!ctx.props.accentColorName
        },
        ctx.data.class
      ),
      style: Object.assign(
        {
          'background-color': ctx.props.color ? ctx.props.color : null,

          ...accentStyles,

          'min-height': numberToPxOrString(ctx.props.minHeight),
          'max-height': numberToPxOrString(ctx.props.maxHeight),
          height: numberToPxOrString(ctx.props.height),
          'min-width': numberToPxOrString(ctx.props.minWidth),
          'max-width': numberToPxOrString(ctx.props.maxWidth),
          width: numberToPxOrString(ctx.props.width)
        },
        ctx.data.style
      ),
      directives: ctx.data.directives,
      on: ctx.data.on,
      key: ctx.data.key
    },
    ctx.children
  )
}
