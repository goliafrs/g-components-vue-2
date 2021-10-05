import { classMerger, isHEX } from '../../utils'

export default function render(h, ctx) {
  return h(
    'i',
    {
      attrs: ctx.data.attrs,
      class: classMerger(
        {
          'g-icon': true,
          'g-icon--link': !!(ctx.data && ctx.data.on && ctx.data.on.click),
          'g-icon--left': ctx.props.left,
          'g-icon--right': ctx.props.right,
          [`g-icon--${ctx.props.library}`]: true,
          [`g-icon--${ctx.props.color}`]: !!ctx.props.color && !isHEX(ctx.props.color),
          [`g-icon__icon--${ctx.props.value || (Array.isArray(ctx.children) && ctx.children[0].text)}`]: true
        },
        ctx.data.class
      ),
      style: Object.assign(
        {
          'font-size': ctx.props.size !== 24 ? ctx.props.size + 'px' : null,
          color: isHEX(ctx.props.color) ? ctx.props.color : null
        },
        ctx.data.style || {}
      ),
      directives: ctx.data.directives,
      on: ctx.data.on,
      key: ctx.data.key
    }
  )
}
