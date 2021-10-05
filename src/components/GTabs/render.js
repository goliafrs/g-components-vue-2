import { componentName } from './utils'

function renderHeader(h) {
  if (Array.isArray(this.tabs) && this.tabs.length) {
    return h(
      'g-tabs-header',
      {
        props: {
          value: this.proxy,
          tabs: this.tabs
        },
        on: {
          input: event => {
            this.proxy = event
          }
        }
      }
    )
  }
}

function renderContent() {
  let slot = this.$slots.default
  if (typeof this.$scopedSlots.default === 'function') {
    slot = this.$scopedSlots.default({ current: this.proxy })
  }
  if (Array.isArray(slot)) {
    for (const content of slot) {
      if (content.data.key === this.proxy) {
        return content
      }
    }
  }
}

function renderScopedSlot(h, slotName) {
  if (typeof this.$scopedSlots[slotName] === 'function') {
    const slotContent = this.$scopedSlots[slotName]({ current: this.proxy })
    if (Array.isArray(slotContent) && slotContent.length) {
      for (const content of slotContent) {
        if (content.data.key === this.proxy) {
          return h(
            'div',
            {
              class: `${componentName}-${slotName}`
            },
            [ content ]
          )
        }
      }
    }
  }
}

const scopedSlots = [ 'body', 'footer' ]

export default function(h) {
  return h(
    'div',
    {
      class: componentName
    },
    [
      renderHeader.call(this, h),
      renderContent.call(this, h),

      ...scopedSlots.map(slot => {
        return renderScopedSlot.call(this, h, slot)
      })
    ]
  )
}
