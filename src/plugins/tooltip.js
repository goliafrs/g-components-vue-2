import { createPopper } from '@popperjs/core'

const defaultOptions = {
  placement: 'top',
  strategy: 'absolute',
  modifiers: [
    {
      name: 'offset',
      options: { offset: [ 0, 16 ] }
    },
    {
      name: 'preventOverflow',
      options: { padding: 16 }
    }
  ]
}

let popperInstance

function destroy(el, gTooltip) {
  let tooltip = gTooltip
  if (!gTooltip) {
    tooltip = document.getElementById('g-tooltip')
  }

  if (el && tooltip) {
    tooltip.innerHTML = ''
  }

  if (popperInstance) {
    popperInstance.destroy()
    popperInstance = undefined
  }

  if (tooltip) {
    tooltip.dataset.popperReferenceHidden = ''
  }
}

function create(el, gTooltip) {
  if (el && gTooltip) {
    if (popperInstance) {
      destroy(el, gTooltip)
    }

    const value = el.$tooltipOptions && el.$tooltipOptions.value
    if (value) {
      gTooltip.innerHTML = value
    }

    popperInstance = createPopper(el, gTooltip, el.$tooltipOptions)
  }
}

function getOptionsFromBinding(binding) {
  const options = {
    modifiers: defaultOptions.modifiers
  }

  if (binding) {
    if (binding.value && typeof binding.value === 'string') {
      options.value = binding.value
    }

    if (binding.options && typeof binding.options === 'object') {
      const { placement, strategy, value, offsetDistance, offsetSkidding } = binding.options

      options.placement = placement || defaultOptions.placement
      options.strategy = strategy || defaultOptions.strategy

      if (value && typeof value === 'string') {
        options.value = value
      }

      if (offsetDistance || offsetSkidding) {
        options.modifiers.push({
          name: 'offset',
          options: {
            offset: [ offsetSkidding || 0, offsetDistance || 0 ]
          }
        })
      }
    }
  }

  return options
}

export default {
  install: Vue => {
    Vue.directive(
      'g-tooltip',
      {
        bind(el) {
          const showEvents = [ 'mouseenter', 'mouseover', 'focus' ]
          const hideEvents = [ 'mouseleave', 'blur' ]

          const gTooltip = document.getElementById('g-tooltip')

          const showListener = () => create(el, gTooltip)
          const hideListener = () => destroy(el, gTooltip)

          showEvents.forEach(event => {
            el.addEventListener(event, showListener)
          })

          hideEvents.forEach(event => {
            el.addEventListener(event, hideListener)
          })
        },

        inserted(el, binding) {
          el.$tooltipOptions = getOptionsFromBinding(binding)
        },

        update(el, binding) {
          el.$tooltipOptions = getOptionsFromBinding(binding)
        },

        unbind(el) {
          destroy(el)
          el.$tooltipOptions = undefined
        }
      }
    )
  }
}
