import { componentName } from '../GTabs/utils'

function renderIcon(h, icon) {
  if (icon) {
    return h(
      'div',
      {
        class: `${componentName}-header__icon`
      },
      [ h('g-icon', { props: { value: icon } }) ]
    )
  }
}

function renderArrow(h, direction = 'prev') {
  if (this.showArrows) {
    return h(
      'div',
      {
        class: {
          [`${componentName}-header__arrow ${componentName}-header__arrow--${direction}`]: true,
          [`${componentName}-header__arrow--disabled`]: this[`${direction}Disabled`]
        },
        on: {
          click: () => {
            this.slide(direction)
          }
        }
      },
      [
        h(
          'g-icon',
          {
            props: {
              value: direction === 'prev' ? 'keyboard_arrow_left' : 'keyboard_arrow_right'
            }
          }
        )
      ]
    )
  }
}

function renderItems(h) {
  return h(
    'div',
    {
      class: `${componentName}-header__items`,
      ref: 'items'
    },
    this.tabs.map(({ key, title, icon, callback }) => {
      return h(
        'div',
        {
          class: {
            [`${componentName}-header__item`]: true,
            [`${componentName}-header__item--active`]: this.proxy === key,
            [`${componentName}-header__item--has-icon`]: !!icon
          },
          on: {
            click: () => {
              this.proxy = key
              if (typeof callback === 'function') {
                callback()
              }
            }
          }
        },
        [ renderIcon.call(this, h, icon), title ]
      )
    })
  )
}

function renderContent(h) {
  if (Array.isArray(this.tabs) && this.tabs.length) {
    return h(
      'div',
      {
        class: {
          [`${componentName}-header`]: true,
          [`${componentName}-header--arrows`]: this.showArrows
        }
      },
      [
        renderArrow.call(this, h, 'prev'),

        h(
          'div',
          {
            class: `${componentName}-header__holder`
          },
          [ renderItems.call(this, h) ]
        ),

        renderArrow.call(this, h, 'next')
      ]
    )
  }
}

export default function(h) {
  return renderContent.call(this, h)
}
