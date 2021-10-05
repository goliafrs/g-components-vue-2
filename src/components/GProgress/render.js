import { classMerger, normalizedValue, numberToPxOrString, isHEX } from '../../utils'

const radius = 20

function renderCircle(h, ctx) {
  const viewBoxSize = radius / (1 - Number(ctx.props.width) / +ctx.props.size)
  const circumference = 2 * Math.PI * radius
  const strokeDashArray = Math.round(circumference * 1000) / 1000
  const strokeDashOffset = ((100 - normalizedValue(ctx.props.value)) / 100) * circumference + 'px'
  const strokeWidth = (Number(ctx.props.width) / +ctx.props.size) * viewBoxSize * 2

  return h(
    'svg',
    {
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `${viewBoxSize} ${viewBoxSize} ${2 * viewBoxSize} ${2 * viewBoxSize}`
      },
      style: { transform: `rotate(${Number(ctx.props.rotate)}deg)` }
    },
    [
      h(
        'circle',
        {
          attrs: {
            fill: 'transparent',
            cx: 2 * viewBoxSize,
            cy: 2 * viewBoxSize,
            r: radius,
            'stroke-width': strokeWidth,
            'stroke-dasharray': strokeDashArray,
            'stroke-dashoffset': strokeDashOffset
          },
          class: 'g-progress-circular__circle'
        }
      )
    ]
  )
}

function renderBar(h, ctx) {
  return h(
    'div',
    {
      class: {
        'g-progress-linear__bar': true,
        'g-progress-linear__bar--determinate': ctx.props.value
      },
      style: { width: !ctx.props.indeterminate ? `${ctx.props.value || 0}%` : null }
    }
  )
}

function renderContent(h, ctx) {
  switch (ctx.props.type) {
    case 'circular':
      return renderCircle.call(this, h, ctx)
    case 'linear':
      return renderBar.call(this, h, ctx)
  }
}

function renderInfo(h, ctx) {
  if (ctx.props.info) {
    return h(
      'div',
      {
        class: 'g-progress__info'
      },
      [ ctx.children || ctx.props.value ]
    )
  }
}

export default function render(h, ctx) {
  const style = {
    color: isHEX(ctx.props.color) ? ctx.props.color : null
  }
  if (ctx.props.type === 'circular') {
    style.minHeight = numberToPxOrString(ctx.props.size)
    style.height = numberToPxOrString(ctx.props.size)
    style.minWidth = numberToPxOrString(ctx.props.size)
    style.width = numberToPxOrString(ctx.props.size)
  } else {
    style.minHeight = numberToPxOrString(ctx.props.height)
    style.height = numberToPxOrString(ctx.props.height)
  }

  return h(
    'div',
    {
      attrs: {
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': ctx.props.indeterminate ? undefined : ctx.props.value
      },
      class: classMerger(
        {
          'g-progress': true,
          [`g-progress-${ctx.props.type}`]: true,
          [`g-progress-${ctx.props.type}--indeterminate`]: ctx.props.indeterminate,
          [`g-progress--${ctx.props.color}`]: !!ctx.props.color && !isHEX(ctx.props.color)
        },
        ctx.data.class
      ),
      style: Object.assign({}, style, ctx.data.style),
      directives: ctx.data.directives,
      on: ctx.data.on,
      key: ctx.data.key
    },
    [ renderContent.call(this, h, ctx), renderInfo.call(this, h, ctx) ]
  )
}
