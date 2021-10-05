import { get } from 'no-lodash'

import { checkKey, isChildOf } from '../../utils'

import { core, basic } from './mixins'

import render from './render'

const name = 'g-select'

export default {
  name: 'GSelect',

  mixins: [ core, basic ],

  props: {
    searchLocally: {
      type: Boolean,
      default: false
    },

    items: {
      type: Array,
      default: () => []
    },
    itemsDisabled: {
      type: Array,
      default: () => []
    },

    itemTitle: String,
    itemValue: String,

    multiple: {
      type: Boolean,
      default: false
    },
    selectionType: {
      type: String,
      default: 'chip',
      validator: value => {
        return !!~[ 'chip', 'text' ].indexOf(value)
      }
    },
    separator: {
      type: String,
      default: ','
    },

    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },

    prependItems: {
      type: Array,
      default: () => []
    },

    getItemByValue: {
      type: Function,
      default: v => v
    },
    defaultValue: null,

    label: String,
    placeholder: String,

    hint: String,

    focusedClass: {
      type: String,
      default: 'text--primary'
    },

    menuProps: {
      type: [ Object, Array, String ],
      default: () => ({})
    },

    mode: {
      type: String,
      default: 'default',
      validator: value => {
        return !!~[ 'default', 'solo', 'outline', 'outline-label' ].indexOf(value)
      }
    },

    backgroundColor: {
      type: String,
      default: null
    },

    paste: Boolean,
    pasteFilter: {
      type: Function,
      default: v => [ v ]
    },

    tabindex: [ String, Number ],

    autocomplete: {
      type: Boolean,
      default: false
    },
    combobox: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    details: {
      type: Boolean,
      default: true
    },
    flat: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },

    deleteWithBackspace: {
      type: Boolean,
      default: false
    },

    freeInput: {
      type: Boolean,
      default: false
    },
    freeInputTriggers: {
      type: Array,
      default: () => [ 9, 13 ]
    },

    setOnBlur: Boolean,

    activateMobile: Boolean,

    rootElement: {
      type: null,
      default: '#app'
    }
  },

  data() {
    return {
      searchValue: '',

      selectedItems: [],
      selectedValues: [],
      cachedSelectedItems: [],

      _searchLocally: false,

      _unselectable: !!this.unselectable,

      _items: undefined,
      _prependItems: undefined,

      _itemTitle: 'title',
      _itemValue: 'value',

      _filterInputValues: [ undefined, null, '' ],

      _show: {
        dropdown: false,
        dialog: false
      },

      _cursorPosition: -1,

      _deletingItems: false,

      _rootElement: this.rootElement
    }
  },

  computed: {
    $itemTitle: {
      get() {
        return this.itemTitle || this._data._itemTitle
      },
      set(value) {
        this._data._itemTitle = !!value
      }
    },
    $itemValue: {
      get() {
        return this.itemValue || this._data._itemValue
      },
      set(value) {
        this._data._itemValue = !!value
      }
    },

    displayItems() {
      return [
        ...(this._data._prependItems || this.prependItems),
        ...(this._data._items || this.items)
      ].map((item, index) => this._clearDisplayItem(item, index))
    },

    inputIsShowed() {
      return (this.autocomplete || this.combobox) && !this.isDisabled && (this.selectedItems.length > 0 ? this.isFocused : true)
    },

    labelIsShowed() {
      if (!this.label) {
        return false
      }

      switch (this.mode) {
        case 'box':
        case 'solo':
        case 'outline': {
          if (this.search) {
            return false
          }
          if (this.selectedItems.length) {
            return false
          }
          break
        }
        default: {
          return true
        }
      }

      return true
    }
  },

  watch: {
    selectedValues: {
      async handler() {
        const values = await Promise.all(this.selectedValues.map(async value => {
          // Ищем элемент в элементах отображённого списка или в ранее сохранённых в локальный кэш
          const displayItems = this.displayItems.find(item => this._compareValues(item[this.$itemValue], value))
          const cachedSelectedItems = this.cachedSelectedItems.find(item => this._compareValues(item[this.$itemValue], value))

          let item = displayItems || cachedSelectedItems

          if (item === undefined) {
            // _getItemByValue может быть асинхронной функцией, ждём её результата
            item = await this._getItemByValue(value)

            // Очищаем результат
            const clearedItem = this._clearSelectedItem(item)

            // Смотрим есть ли закешированные ранее элементы
            if (this.cachedSelectedItems.length) {
              // Находим индекс похожего элемента в кэше
              const index = this.cachedSelectedItems.findIndex(cachedSelectedItem => {
                return this._compareValues(cachedSelectedItem[this.$itemValue], clearedItem[this.$itemValue])
              })
              // Если нашли, заменяем его тем что получили ранее из _getItemByValue
              if (index > -1) {
                this.cachedSelectedItems.splice(index, 1)
              }
            }

            // Возвращаем наружу элемент
            item = clearedItem
          }

          // Повторно очищаем если элемент был в списках, а не получен из _getItemByValue и возвращаем его
          return this._clearSelectedItem(item)
        }))

        // Записываем данные в кэш и в конечную переменную для отображения
        this.cachedSelectedItems.splice(0, this.selectedItems.length, ...values)
        this.selectedItems.splice(0, this.selectedItems.length, ...values)

        // Выдаём данные наружу
        this._transmitValue()
      },
      deep: true
    }
  },

  mounted() {
    if (document && typeof this._data._rootElement === 'string') {
      this._data._rootElement = document.querySelector(this._data._rootElement)
    }

    if (this._data._rootElement) {
      this._data._rootElement.addEventListener('click', this._clickHandler)
    }

    if (this.main) {
      this.main.addEventListener('click', this._clickHandler)
    }

    if (document && this.showMobileDialog) {
      document.addEventListener('backbutton', this._clickOutside)
    }
  },

  beforeDestroy() {
    if (this._data._rootElement) {
      this._data._rootElement.removeEventListener('click', this._clickHandler)
    }

    if (this.main) {
      this.main.removeEventListener('click', this._clickOnMain)
    }

    if (document && this.showMobileDialog) {
      document.removeEventListener('backbutton', this._clickOutside)
    }
  },

  methods: {
    _clearSelectedItem(item) {
      const value = get(item, this.$itemValue, item)
      const title = get(item, this.$itemTitle, value)

      return {
        [this.$itemTitle]: title,
        [this.$itemValue]: value
      }
    },
    _clearDisplayItem(item, index) {
      return this._clearItem(item, index)
    },
    _clearItem(item, index) {
      const value = get(item, this.$itemValue, item)
      const title = get(item, this.$itemTitle, value)

      return {
        [this.$itemTitle]: title,
        [this.$itemValue]: value,
        _hovered: this._data._cursorPosition === index,
        _selected: !!~this.selectedValues.findIndex(selectedValue => this._compareValues(selectedValue, value)),
        _searchValid: !this.isSearchLocally || !this.searchValue || !!this._checkSearchValidity(title, value, item),
        _disabled: !!~this.itemsDisabled.findIndex(itemDisabled => {
          const itemDisabledValue = (itemDisabled && get(itemDisabled, this.$itemValue)) || itemDisabled
          return this._compareValues(itemDisabledValue, value)
        })
      }
    },

    _checkSearchValidity(title) {
      return ('' + title).toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) > -1
    },

    _compareValues(valueA, valueB) {
      return valueA === valueB
    },

    _updateMenu() {
      this.$nextTick(() => {
        if (this.$refs.menu && this.$refs.menu.updateDimensions) {
          this.$refs.menu.updateDimensions()
        }
      })
    },

    _getItemByValue(value) {
      if (this.getItemByValue) {
        return this.getItemByValue(value)
      }
      return undefined
    },

    addByValue(value) {
      if (this.isDisabled) {
        return false
      }

      value = get(value, this.$itemValue, value)

      const index = this.selectedValues.findIndex(selectedValue => {
        const compareValue = get(selectedValue, this.$itemValue, selectedValue)
        return this._compareValues(compareValue, value)
      })

      if (index === -1) {
        if (this.multiple) {
          this.selectedValues.push(value)
        } else {
          this.selectedValues.splice(0, 1, value)

          if (this.searchValue) {
            this.searchValue = ''
          }

          if (this.activateMobile) {
            this._data._show.dialog = false
          } else {
            this._data._show.dropdown = false
          }

          this.isFocused = false
        }

        this._updateMenu()

        return true
      }

      return false
    },
    removeByValue(value) {
      if (this.isDisabled) {
        return false
      }

      value = get(value, this.$itemValue, value)

      const index = this.selectedValues.findIndex(selectedValue => {
        const compareValue = get(selectedValue, this.$itemValue, selectedValue)
        return this._compareValues(compareValue, value)
      })

      if (index > -1) {
        if (this.selectedValues.length === 1 && this.required) {
          return false
        }

        this.selectedValues.splice(index, 1)
        this._updateMenu()

        return true
      }

      return false
    },
    toggleByValue(value) {
      return this.addByValue(value) || this.removeByValue(value)
    },

    removeByIndex(index, amount = 1) {
      amount = amount || this.selectedValues.length
      index = index === undefined ? this.selectedValues.length - 1 : index

      for (let i = 0; i < amount; i++) {
        if (!this.removeByValue(this.selectedValues[index])) {
          return false
        }
      }

      return true
    },

    onKeyup(event) {
      if (this.isDeleteWithBackspace) {
        this._deleteWithBackspaceHandler(event)
      }

      if (this.isFreeInput) {
        const triggers = this.freeInputTriggers

        if (
          ((Array.isArray(triggers) && triggers.some(key => checkKey(key, event))) ||
            ((typeof triggers === 'string' || typeof triggers === 'number') && checkKey(triggers, event))) &&
          event.target
        ) {
          let index = this.searchValue.indexOf(event.key)

          if (!~index) {
            index = this.searchValue.length
          }

          const valueToAdd = this.searchValue.substring(0, index).trim()

          if (valueToAdd) {
            this._setValue(valueToAdd)
          }

          this._clearSearchValue()
        }
      }

      if (event.keyCode === 9) {
        this.isFocused = true

        if (this.showMobileDialog) {
          this._data._show.dialog = true
        } else {
          this._data._show.dropdown = true
        }
      }
    },
    onKeydown(event) {
      if (event.keyCode === 9) {
        this.isFocused = false

        if (this.showMobileDialog) {
          this._data._show.dialog = false
        } else {
          this._data._show.dropdown = false
        }

        if (this.searchValue && this.isFreeInput) {
          let valueToAdd

          if (this.combobox) {
            valueToAdd = this.searchValue
          } else {
            const foundItem = this.displayItems.find(item => item._searchValid)
            if (foundItem) {
              valueToAdd = foundItem[this.$itemValue]
            }
          }

          if (valueToAdd) {
            this._setValue(valueToAdd)
          }
        }

        this._clearSearchValue()
      }

      if (this.$refs && this.$refs.menu) {
        if (event.keyCode === 40) {
          this._clickOnMain()
          this._data._cursorPosition++
          if (this._data._cursorPosition > this.displayItems.length - 1) {
            this._data._cursorPosition = 0
          }
        }

        if (event.keyCode === 38) {
          this._clickOnMain()
          this._data._cursorPosition--
          if (this._data._cursorPosition < 0) {
            this._data._cursorPosition = this.displayItems.length - 1
          }
        }

        if (this.$refs.menu.$refs && this.$refs.menu.$refs[`menu-${this.$refs.menu._uid}`]) {
          const height = this.$refs.menu.$refs[`menu-${this.$refs.menu._uid}`].offsetHeight
          const scrollTop = this.$refs.menu.$refs[`menu-${this.$refs.menu._uid}`].scrollTop
          const currentPosition = this._data._cursorPosition * 48
          const bottomEdge = scrollTop + height
          const currentBottomEdge = currentPosition + 48 + 12
          const bottomEdgeDiff = currentBottomEdge - bottomEdge
          const topEdgeDiff = scrollTop - currentPosition + 12

          if (bottomEdgeDiff > 0) {
            this.$refs.menu.$refs[`menu-${this.$refs.menu._uid}`].scrollTop += bottomEdgeDiff
          } else if (topEdgeDiff > 0) {
            this.$refs.menu.$refs[`menu-${this.$refs.menu._uid}`].scrollTop -= topEdgeDiff
          }
        }

        if (event.keyCode === 13) {
          const foundItem = this.displayItems.find(item => item._hovered)

          if (foundItem) {
            this.addByValue(foundItem[this.$itemValue])
          } else if (this.isFreeInput) {
            this.addByValue(this.searchValue)
          }

          if (!this.multiple) {
            this._clickOutside()
          }

          this._data._cursorPosition = -1

          this._clearSearchValue()
        }
      }
    },

    _setValue(value) {
      if ((value || this.searchValue) && this.combobox) {
        if (this.multiple) {
          this.toggleByValue(value || this.searchValue)
        } else {
          this.addByValue(value || this.searchValue)
        }
      }
    },

    _deleteWithBackspaceHandler(event) {
      if (event.keyCode === 8 && this.searchValue === '') {
        if (this._data._deletingItems) {
          this.removeByIndex()
        } else {
          this._data._deletingItems = true
        }
      } else {
        this._data._deletingItems = false
      }
    },

    _clickOnMain() {
      this.isFocused = true

      if (this.showMobileDialog) {
        if (!this._data._show.dialog) {
          this._data._show.dialog = true

          this._focusIn('dialog-input')
        }
      } else {
        if (!this._data._show.dropdown) {
          this._data._show.dropdown = true
        }

        this._focusIn()
      }
      if (this.isError) {
        this._clearCurrentError()
      }
    },
    _clickOnMenu() {
      this._data._deletingItems = false

      if (!this.multiple) {
        this.isFocused = false
        this._data._show.dropdown = false
      }

      this._clearSearchValue()
      this._focusIn()
    },
    _clickOnDialog() {},
    _clickOutside() {
      this.isFocused = false

      this._data._deletingItems = false

      if (this.showMobileDialog) {
        this._data._show.dialog = false
      } else {
        this._data._show.dropdown = false
      }

      this._focusOut()
      this._focusOut('dialog-input')

      /**
       * Устанавливает значение при потери фокуса на компоненте
       * с помошью клика мышью снаружи компонента
       */
      if (this.searchValue && this.isFreeInput && this.setOnBlur) {
        this._setValue()
      }

      this._clearSearchValue()
    },
    _clickHandler(event) {
      if (this.isDisabled) {
        return false
      }

      const clickedElement = event.target

      if (this.main && isChildOf(clickedElement, this.main)) {
        this._clickOnMain()
      } else if (this.menu && isChildOf(clickedElement, this.menu)) {
        this._clickOnMenu()
      } else if (this.$refs && this.$refs.dialog && isChildOf(clickedElement, this.$refs.dialog.$el)) {
        this._clickOnDialog()
      } else {
        this._clickOutside()
      }
    },

    _clearSearchValue() {
      this.$nextTick(() => {
        this.searchValue = ''
      })
    },

    _clearCurrentError() {
      this._data._errorOnRequired = false
      this._data._errorOnBlur = false
      this._data._error = undefined
    },

    _focusIn(ref = 'input') {
      this.$nextTick(() => {
        const element = document.getElementById(`${name}-${ref}-${this._uid}`)
        if (element && element.focus) {
          element.focus()
        }
      })
    },
    _focusOut(ref = 'input') {
      this.$nextTick(() => {
        const element = document.getElementById(`${name}-${ref}-${this._uid}`)
        if (element && element.blur) {
          element.blur()
        }
      })
    }
  },

  render
}
