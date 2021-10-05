import { classMerger, isHEX, numberToPxOrString } from '../../utils'

const colors = [
  '#E53935',
  '#D81B60',
  '#9C27B0',
  '#5E35B1',
  '#43A047',
  '#E65100',
  '#F4511E',
  '#FF3D00',
  '#F50057',
  '#D500F9',
  '#FF1744'
]

function renderContent(h, ctx) {
  let firstCharTitle
  if (ctx.props.title) {
    firstCharTitle = ctx.props.title.charAt(0)
  }

  let fontSize = 24
  if (ctx.props.fontSize) {
    fontSize = parseInt(ctx.props.fontSize)
  } else {
    fontSize = parseInt(ctx.props.size / 2.2)
  }

  if (ctx.children) {
    return ctx.children
  } else if (ctx.props.src) {
    return h(
      'img',
      {
        class: 'g-avatar__src',
        attrs: {
          src: ctx.props.src,
          alt: ctx.props.title
        }
      }
    )
  } else if (firstCharTitle) {
    return h(
      'span',
      {
        style: {
          'font-size': `${fontSize}px`,
          color: ctx.props.color
        }
      },
      firstCharTitle
    )
  } else if (ctx.props.icon) {
    return h(
      'g-icon',
      {
        props: {
          value: ctx.props.icon,
          size: fontSize,
          color: ctx.props.color
        }
      }
    )
  }
}

export default function render(h, ctx) {
  let firstCharTitle
  if (ctx.props.title) {
    firstCharTitle = ctx.props.title.charAt(0)
  }

  let charCode
  if (firstCharTitle) {
    charCode = parseInt(firstCharTitle.charCodeAt())
  }

  let defaultColor
  if (charCode) {
    defaultColor = colors[charCode % colors.length]
  }

  return h(
    'div',
    {
      attrs: ctx.data.attrs,
      class: classMerger(
        {
          'g-avatar': true,
          'g-avatar--tile': ctx.props.tile,
          [`g-avatar--${ctx.props.backgroundColor}`]: !!ctx.props.backgroundColor && !isHEX(ctx.props.backgroundColor)
        },
        ctx.data.class
      ),
      style: Object.assign(
        {
          'background-color': isHEX(ctx.props.backgroundColor)
            ? ctx.props.backgroundColor
            : !ctx.props.src
              ? defaultColor
              : undefined,
          'min-height': numberToPxOrString(ctx.props.size),
          'max-height': numberToPxOrString(ctx.props.size),
          height: numberToPxOrString(ctx.props.size),
          'min-width': numberToPxOrString(ctx.props.size),
          'max-width': numberToPxOrString(ctx.props.size),
          width: numberToPxOrString(ctx.props.size)
        },
        ctx.data.style
      ),
      directives: ctx.data.directives,
      on: ctx.data.on,
      key: ctx.data.key
    },
    [ renderContent.call(this, h, ctx) ]
  )
}
