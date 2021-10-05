const name = 'g-select'

function renderTabIndexInput(h) {
  return h(
    'input', {
      attrs: { tabindex: this.tabindex },
      class: `${name}__tabindex`,
      on: {
        focus: () => {
          this._clickOnMain()
        },
        blur: () => {
          this._clickOutside()
        }
      }
    }
  )
}

function renderLabel(h) {
  if (this.labelIsShowed) {
    return h(
      'div',
      {
        class: {
          [`${name}__label`]: true,
          [this.focusedClass]: this.isFocused
        }
      },
      [ this.label, this.required && '*' ].filter(item => !!item).join(' ')
    )
  }
}

function renderGroup(h, nodes = []) {
  return h('div', { class: `${name}__group` }, nodes)
}

function renderInput(h, ref = 'input') {
  if (this.inputIsShowed) {
    return h(
      'g-input', {
        attrs: { id: `${name}-${ref}-${this._uid}` },
        class: {
          [`${name}__input`]: true,
          [`${name}__input--hidden`]: !this.isFocused
        },
        props: {
          type: this.type,
          placeholder: this.placeholder,
          disabled: this.disabled,
          readonly: this.readonly,
          tabindex: this.tabindex,
          value: this.searchValue
        },
        on: {
          keyup: this.onKeyup,
          keydown: this.onKeydown,
          input: event => {
            let value = event.target.value
            if (typeof value === 'string') {
              value = value.trim()
            }
            this.searchValue = value
            this._focusIn()
          },
          click: event => {
            event.preventDefault()
            event.stopPropagation()
          },
          paste: event => {
            if (this.paste) {
              event.preventDefault()

              const clipboardData = event.clipboardData || window.clipboardData

              let text = ''
              if (clipboardData && typeof clipboardData.getData === 'function') {
                text = clipboardData.getData('text')
              }
              let output = this.pasteFilter(text)
              if (!Array.isArray(output)) {
                output = [ output ]
              }
              for (const item of output) {
                this.addByValue(item)
              }
            }
          }
        }
      }
    )
  }
}

function renderSeparator(h, index) {
  if (index !== this.selectedValues.length - 1) {
    return h('span', { class: 'mr-1' }, this.separator)
  }
}

function renderSelectedItem(h, item, index) {
  if (this.multiple) {
    switch (this.selectionType) {
      case 'chip': {
        return h(
          'div',
          {
            class: {
              [`${name}__chip`]: true,
              [`${name}__chip--active`]: this.selectedItems.length - 1 === index && this._data._deletingItems
            }
          },
          [
            h(
              'div',
              {
                class: `${name}__chip-title`
              },
              item[this.$itemTitle]
            ),

            h(
              'div',
              {
                class: `${name}__chip-icon`,
                on: {
                  click: () => {
                    this.removeByValue(item[this.$itemValue])
                  }
                }
              }
            )
          ]
        )
      }
      case 'text': {
        return h(
          'div',
          {
            class: `${name}__text`
          },
          [
            h('span', { class: 'text-overflow text--black' }, item[this.$itemTitle]),

            renderSeparator.call(this, h, index)
          ]
        )
      }
    }
  } else {
    return h(
      'g-text-overflow',
      {
        props: {
          value: item[this.$itemTitle],
          placement: 'top'
        }
      }
    )
  }
}
function renderSelectionSlot(h, item, index) {
  if (this.$scopedSlots.selection) {
    return this.$scopedSlots.selection({
      item,
      index,
      addByValue: this.addByValue,
      removeByValue: this.removeByValue,
      toggleByValue: this.toggleByValue,
      selectedItems: this.selectedItems
    })
  } else {
    return renderSelectedItem.call(this, h, item, index)
  }
}
function renderSelection(h) {
  const hasInput = this.autocomplete || this.combobox

  return h(
    'div',
    {
      class: {
        [`${name}__selection`]: true,
        [`${name}__selection--fill`]: !hasInput,
        [`${name}__selection--hidden`]: hasInput && this.isFocused && this.selectedItems.length === 0
      }
    },
    this.selectedItems.map((item, index) => {
      return renderSelectionSlot.call(this, h, item, index)
    })
  )
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
      [ renderAfterSlot.call(this, h) || renderAfterContent.call(this, h) ]
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
  if (this.isLoading) {
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
    return renderClearable.call(this, h) || renderAfterIcon.call(this, h)
  }
}

function renderClearable(h) {
  if (this.isClearable) {
    return h(
      'g-icon', {
        class: { [this.focusedClass]: this.isFocused },
        props: { value: 'clear' },
        on: {
          click: () => {
            if (this.searchValue) {
              this.searchValue = ''
            }
            this.removeByIndex(0, 0)
          }
        }
      }
    )
  }
}

function renderItemMultipleCheckbox(h, item) {
  if (this.multiple) {
    return h(
      'g-checkbox', {
        props: {
          value: item._selected,
          disabled: item._disabled
        }
      }
    )
  }
}

function renderItemSlot(h, item, index) {
  if (typeof this.$scopedSlots.item === 'function') {
    return this.$scopedSlots.item({
      item,
      index
    })
  }

  return h('g-text-overflow', { props: { value: item[this.$itemTitle] } })
}

function renderItems(h) {
  if (Array.isArray(this.displayItems) && this.displayItems.length !== 0) {
    return h(
      'g-list',
      {},
      this.displayItems.reduce((result, item, index) => {
        if (item._searchValid) {
          result.push(
            h(
              'g-list-item',
              {
                class: {
                  'pl-0': this.multiple,
                  [this.focusedClass]: item._selected && !this.multiple
                },
                props: {
                  disabled: item._disabled,
                  hovered: item._hovered
                },
                on: {
                  click: event => {
                    if (!item._disabled) {
                      if (this.multiple) {
                        event.preventDefault()
                        event.stopPropagation()
                        this.toggleByValue(item[this.$itemValue])
                      } else {
                        this.addByValue(item[this.$itemValue])
                      }
                    }
                  }
                },
                key: `${name}-${this._uid}-item:${index}`
              },
              [
                renderItemMultipleCheckbox.call(this, h, item),
                renderItemSlot.call(this, h, item, index)
              ]
            )
          )
        }
        return result
      }, [])
    )
  }
}

function renderMenu(h) {
  if (!this.isDisabled && !this.showMobileDialog) {
    const contentClass = [ `${name}__menu-content` ]
    if (this.displayItems.filter(item => item._searchValid).length === 0) {
      contentClass.push(`${name}__menu-content--hide`)
    }

    return h(
      'g-menu',
      {
        props: Object.assign({
          value: this._data._show.dropdown,
          attach: this.$refs[`${name}__attach-${this._uid}`],
          closeOnClick: false,
          closeOnContentClick: !this.multiple,
          maxHeight: 300,
          minWidth: this.$refs[`${name}-${this._uid}`] ? this.$refs[`${name}-${this._uid}`].offsetWidth : null,
          maxWidth: this.$refs[`${name}-${this._uid}`] ? this.$refs[`${name}-${this._uid}`].offsetWidth : null,
          offsetDistance: 2,
          overflowY: 'auto',
          contentClass: contentClass.join(' ')
        },
        this.menuProps),
        on: {
          input: event => {
            this._data._show.dropdown = event
          }
        },
        ref: 'menu'
      },
      [ renderItems.call(this, h) ]
    )
  }
}

function renderDialogInput(h) {
  if (this.autocomplete || this.combobox) {
    return h(
      'div',
      {
        class: 'flex-column pa-3',
        slot: 'header'
      },
      [
        renderGroup.call(this, h, [ renderSelection.call(this, h), renderInput.call(this, h, 'dialog-input') ]),
        renderFooter.call(this, h)
      ]
    )
  }
}

function renderDialog(h) {
  if (!this.isDisabled && this.showMobileDialog) {
    return h(
      'g-dialog', {
        props: {
          value: this._data._show.dialog,
          closeOnClick: false,
          closeOnEsc: false,
          fullscreen: this.autocomplete || this.combobox
        },
        on: {
          input: event => {
            this._data._show.dialog = event
          }
        },
        ref: 'dialog'
      }, [
        h(
          'div', {
            class: 'flex-between flex-fill flex-item-center',
            slot: 'header'
          }, [
            h(
              'g-button', {
                props: {
                  icon: 'arrow_back',
                  flat: true
                },
                on: {
                  click: () => {
                    this._clickOutside()
                  }
                }
              }
            ),

            h(
              'g-button', {
                props: {
                  icon: 'clear',
                  flat: true
                },
                on: {
                  click: () => {
                    this._clickOutside()
                  }
                }
              }
            )
          ]
        ),

        renderDialogInput.call(this, h),
        renderItems.call(this, h)
      ]
    )
  }
}

function renderLoading(h, type = 'linear') {
  if (this.isLoading) {
    switch (type) {
      case 'circular': {
        return h(
          'g-progress', {
            props: {
              type,
              size: 24,
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
          'g-progress', {
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
  if (!this.isLoading) {
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

function renderAttach(h) {
  if (!this.isDisabled) {
    return h(
      'div', {
        class: `${name}__attach`,
        ref: `${name}__attach-${this._uid}`
      }
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
            class: `${name}__details--left`,
            domProps: { innerHTML: this.isError ? this._data._error : this.hint }
          }
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
        [`${name}--${this.mode}`]: true,
        [`${name}--labeled`]: !!this.label,
        [`${name}--disabled`]: this.isDisabled,
        [`${name}--autocomplete`]: !!this.autocomplete,
        [`${name}--filled`]: !!this.selectedItems.length,
        [`${name}--active`]: this.isActive,
        [`${name}--flat`]: this.flat,
        [`${name}--dense`]: this.dense,
        [`${name}--rounded`]: this.rounded,
        [`${name}--search`]: !!this.searchValue,
        [`${name}--error`]: this.isError,
        [`${name}--multiple`]: this.multiple,
        [`${name}--has-before`]: this.hasBefore,
        [`${name}--has-after`]: this.hasAfter
      },
      ref: `${name}-${this._uid}`
    },
    [
      renderTabIndexInput.call(this, h),
      renderLabel.call(this, h),

      h(
        'div',
        {
          class: `${name}__holder`,
          style: { 'background-color': this.backgroundColor }
        },
        [
          renderBefore.call(this, h),
          h('div', { class: `${name}__group` }, [ renderSelection.call(this, h), renderInput.call(this, h) ]),
          renderAfter.call(this, h)
        ]
      ),

      renderFooter.call(this, h),
      renderAttach.call(this, h),
      renderMenu.call(this, h),
      renderDialog.call(this, h),
      renderDetails.call(this, h)
    ]
  )
}
