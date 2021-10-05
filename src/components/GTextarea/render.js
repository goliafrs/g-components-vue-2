import { isEmpty } from '../../utils'

const name = 'g-textarea'

function renderLabel(h) {
  if (this.label) {
    return h(
      'label',
      {
        attrs: { for: this.name || `g-input-${this._uid}` },
        class: {
          [`${name}__label`]: true,
          [this.focusedClass]: this.isFocused
        },
        on: { mousedown: this.onClick }
      },
      [ this.label, this.required && '*' ].filter(item => !!item).join(' ')
    )
  }
}

function renderPrefix(h) {
  if (!isEmpty(this.prefix)) {
    return h(
      'div',
      {
        class: `${name}__prefix`,
        style: { opacity: !isEmpty(this.prefix) && (this.isFocused || !isEmpty(this.proxy)) ? 1 : 0 },
        domProps: { innerHTML: this.prefix }
      }
    )
  }
}

function renderInput(h) {
  return h(
    'g-input',
    {
      class: `${name}__input`,
      style: { resize: this.resize },
      props: Object.assign({}, this.attributes, {
        id: this.id || `g-input-${this._uid}`,
        value: this.proxy,
        placeholder: this.computedPlaceholder,
        name: this.name || `g-input-${this._uid}`,
        component: 'textarea'
      }),
      on: {
        focus: this.focusIn,
        blur: this.focusOut,
        click: this.onClick,
        mousedown: this.onMouseDown,
        mouseup: this.onMouseUp,
        keypress: this.onKeyPress,
        input: event => {
          if (!this.isDisabled) {
            this.proxy = event.target.value
            this.resizeHeight()
          }
        },
        cut: () => {
          this.delayedResize()
        },
        paste: () => {
          this.delayedResize()
        },
        drop: () => {
          this.delayedResize()
        },
        keydown: () => {
          this.delayedResize()
        }
      },
      ref: 'input'
    }
  )
}

function renderSuffix(h) {
  if (!isEmpty(this.suffix)) {
    return h(
      'div',
      {
        class: `${name}__suffix`,
        domProps: { innerHTML: this.suffix }
      }
    )
  }
}

function renderClearable(h) {
  if (this.isClearable) {
    return h(
      'div',
      {
        class: `${name}__after-holder`
      },
      [
        h(
          'g-icon',
          {
            class: { [this.focusedClass]: this.isFocused },
            props: { value: 'clear' },
            on: { click: this._clear }
          }
        )
      ]
    )
  }
}

function renderBefore(h) {
  if (this.hasBefore) {
    return h(
      'div',
      {
        class: {
          [`${name}__before`]: true,
          [`${name}__before--pointer`]: this.beforeIcon && typeof this.beforeIconCallback === 'function'
        }
      },
      [ renderBeforeSlot.call(this, h) || renderBeforeContent.call(this, h) ]
    )
  }
}
function renderBeforeSlot(h) {
  if (this.hasBeforeSlot) {
    return h(
      'div',
      {
        class: `${name}__before-holder`
      },
      [ this.$scopedSlots.before ? this.$scopedSlots.before() : this.$slots.before ]
    )
  }
}
function renderBeforeIcon(h) {
  if (this.beforeIcon) {
    return h(
      'div',
      {
        class: `${name}__before-holder`
      },
      [
        h(
          'g-icon',
          {
            class: { [this.focusedClass]: this.isFocused },
            props: { value: this.beforeIcon },
            on: {
              click: () => {
                if (!this.isDisabled && typeof this.beforeIconCallback === 'function') {
                  this.beforeIconCallback()
                }
              }
            }
          }
        )
      ]
    )
  }
}
function renderBeforeContent(h) {
  return renderBeforeIcon.call(this, h)
}

function renderAfter(h) {
  if (this.hasAfter) {
    return h(
      'div',
      {
        class: {
          [`${name}__after`]: true,
          [`${name}__after--pointer`]: this.afterIcon && typeof this.afterIconCallback === 'function'
        }
      },
      [
        renderClearable.call(this, h),
        renderAfterSlot.call(this, h) || renderAfterContent.call(this, h)
      ]
    )
  }
}
function renderAfterSlot(h) {
  if (this.hasAfterSlot) {
    return h(
      'div',
      {
        class: `${name}__after-holder`
      },
      [ this.$scopedSlots.after ? this.$scopedSlots.after() : this.$slots.after ]
    )
  }
}
function renderAfterIcon(h) {
  if (this.afterIcon) {
    return h(
      'div',
      {
        class: `${name}__after-holder`
      },
      [
        h(
          'g-icon',
          {
            class: { [this.focusedClass]: this.isFocused },
            props: { value: this.afterIcon },
            on: {
              click: () => {
                if (!this.isDisabled && typeof this.afterIconCallback === 'function') {
                  this.afterIconCallback()
                }
              }
            }
          }
        )
      ]
    )
  }
}
function renderAfterContent(h) {
  if (this.loading) {
    if (~[ 'solo', 'outline', 'outline-label' ].indexOf(this.mode)) {
      return h(
        'div',
        {
          class: `${name}__after-holder`
        },
        [ renderLoading.call(this, h, 'circular') ]
      )
    }
  } else {
    return renderAfterIcon.call(this, h)
  }
}

function renderHolder(h) {
  return h(
    'div',
    {
      class: `${name}__holder`,
      style: { backgroundColor: this.backgroundColor }
    },
    [
      renderBefore.call(this, h),

      h(
        'div',
        {
          class: `${name}__group`
        },
        [
          renderPrefix.call(this, h),
          renderInput.call(this, h),
          renderSuffix.call(this, h)
        ]
      ),

      renderAfter.call(this, h)
    ]
  )
}

function renderLoading(h, type = 'linear') {
  if (this.loading) {
    switch (type) {
      case 'circular': {
        return h(
          'g-progress',
          {
            props: {
              type,
              size: this.dense ? 16 : 20,
              width: 1,
              color: this.isDisabled ? 'grey' : 'primary',
              indeterminate: true
            }
          }
        )
      }

      case 'linear':
      default: {
        return h(
          'g-progress',
          {
            style: {
              position: 'absolute',
              top: '-1px',
              left: 0
            },
            props: {
              type,
              color: this.isDisabled ? 'grey' : 'primary',
              indeterminate: true
            }
          }
        )
      }
    }
  }
}

function renderBorder(h) {
  if (!this.loading) {
    return h(
      'div',
      {
        class: {
          [`${name}__border`]: true,
          [this.focusedClass]: this.isFocused
        }
      }
    )
  }
}

function renderFooter(h) {
  if (this.mode === 'default') {
    return h(
      'div',
      {
        class: `${name}__footer`
      },
      [
        renderLoading.call(this, h),
        renderBorder.call(this, h)
      ]
    )
  }
}

function renderDetails(h) {
  if (this.details) {
    return h(
      'div',
      {
        class: `${name}__details`
      },
      [
        h(
          'div',
          {
            class: `${name}__details--left`
          },
          this.isError ? this.error : this.isSuccess ? this.success : this.hint
        ),
        h(
          'div',
          {
            class: `${name}__details--right`
          },
          this.count
        )
      ]
    )
  }
}

export default function render(h) {
  return h(
    'div',
    {
      class: {
        [`${name}`]: true,

        [`${name}--flat`]: this.flat,
        [`${name}--dense`]: this.dense,
        [`${name}--rounded`]: this.rounded,
        [`${name}--error`]: this.isError,
        [`${name}--success`]: this.isSuccess,
        [`${name}--focused`]: this.isFocused,
        [`${name}--active`]: this.isActive || this.isFocused,
        [`${name}--labeled`]: !isEmpty(this.label),
        [`${name}--filled`]: !isEmpty(this.proxy),
        [`${name}--required`]: this.required,
        [`${name}--disabled`]: this.disabled,
        [`${name}--readonly`]: this.readonly,
        [`${name}--clearable`]: this.clearable,
        [`${name}--has-before`]: this.hasBefore,
        [`${name}--has-after`]: this.hasAfter,

        [`${name}--time`]: this.type === 'time',

        [`${name}--${this.mode}`]: true
      },
      key: `${name}-${this._uid}`
    },
    [
      renderLabel.call(this, h),
      renderHolder.call(this, h),
      renderFooter.call(this, h),
      renderDetails.call(this, h)
    ]
  )
}
