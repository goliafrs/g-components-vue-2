import { classMerger } from '../../utils'

function renderText(h, { text }) {
  if (text) {
    return h(
      'div',
      {
        class: 'g-snackbar__text',
        domProps: { innerHTML: text }
      }
    )
  }
}

function renderButton(h, { button }) {
  if (button) {
    return h(
      'g-button',
      {
        class: button.class,
        props: Object.assign({
          flat: true,
          rounded: true,
          color: 'white'
        }, button.props || {}),
        on: { click: button.on.click }
      }
    )
  }
}

function renderCancelable(h, { cancelable, remove }) {
  if (cancelable) {
    return h(
      'g-button',
      {
        props: {
          flat: true,
          icon: 'clear',
          color: 'white'
        },
        on: {
          click: () => {
            remove()
          }
        }
      }
    )
  }
}

export default function render(h, ctx) {
  return h(
    'div',
    {
      attrs: ctx.data.attrs,
      class: classMerger(
        ctx.props.direction.reduce(
          (result, direction) => {
            result.push(`g-snackbar--${direction}`)
            return result
          },
          [ 'g-snackbar' ]
        ),
        ctx.data.class
      ),
      directives: ctx.data.directives,
      style: ctx.data.style,
      on: ctx.data.on,
      key: ctx.data.key
    },
    ctx.props.items.map(item => {
      const classes = [ 'g-snackbar__item', `g-snackbar__item--${item.type}` ]
      if (Array.isArray(item.classes) && item.classes.length) {
        classes.push(...item.classes)
      }

      return h(
        'div',
        {
          class: classes,
          key: item.id
        },
        [
          renderText.call(this, h, item),
          renderButton.call(this, h, item),
          renderCancelable.call(this, h, item)
        ]
      )
    })
  )
}
