export const core = (component = 'input') => {
  return {
    props: {
      id: String,

      accept: String,
      alt: String,
      autocomplete: String,

      autofocus: {
        type: Boolean,
        default: false
      },

      component: {
        type: String,
        default: component,
        validator: value => {
          return ~[ 'input', 'textarea' ].indexOf(value)
        }
      },

      checked: {
        type: Boolean,
        default: false
      },

      cols: [ String, Number ],

      dirname: String,

      disabled: Boolean,

      height: [ String, Number ],
      width: [ String, Number ],

      list: String,

      min: [ String, Number ],
      max: [ String, Number ],
      step: [ String, Number ],

      maxlength: Number,
      minlength: Number,

      multiple: Boolean,

      name: String,

      pattern: String,

      placeholder: String,

      readonly: Boolean,
      required: Boolean,

      rows: [ String, Number ],

      size: Number,

      src: String,

      spellcheck: Boolean,

      tabindex: [ String, Number ],

      type: {
        type: String,
        default: 'text',
        validator: value => {
          return !!~[
            'button',
            'checkbox',
            'color',
            'data',
            'datetime-local',
            'email',
            'file',
            'hidden',
            'image',
            'month',
            'number',
            'password',
            'radio',
            'range',
            'reset',
            'search',
            'submit',
            'tel',
            'text',
            'time',
            'url',
            'week'
          ].indexOf(value)
        }
      },

      value: null,

      wrap: String
    },

    computed: {
      attributes() {
        const globalAttributes = [ 'tabindex' ]
        const allAttributes = [
          'id',
          'autocomplete',
          'autofocus',
          'disabled',
          'form',
          'list',
          'name',
          'readonly',
          'required'
        ]
        const formAttributes = [ 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget' ]
        const patternAttributes = [ 'maxlength', 'minlength', 'placeholder' ]

        switch (this.type) {
          case 'file':
            allAttributes.push('accept', 'capture', 'multiple')
            break

          case 'image':
            allAttributes.push(...formAttributes, 'alt', 'src', 'height', 'width')
            break

          case 'submit':
            allAttributes.push(...formAttributes)
            break

          case 'radio':
          case 'checkbox':
            allAttributes.push('checked')
            break

          case 'password':
            allAttributes.push(...patternAttributes, 'pattern', 'size')
            break

          case 'search':
            allAttributes.push(...patternAttributes, 'dirname')
            break

          case 'tel':
            allAttributes.push(...patternAttributes, 'pattern', 'size')
            break
          case 'url':
            allAttributes.push(...patternAttributes)
            break
          case 'email':
            allAttributes.push('multiple', 'size')
            break

          case 'number':
            allAttributes.push('max', 'min', 'step')
            break

          case 'text':
            allAttributes.push(...patternAttributes, 'pattern', 'dirname', 'size')
            break
        }

        switch (component) {
          case 'input': {
            allAttributes.push('type')
            break
          }
          case 'textarea': {
            allAttributes.push('cols', 'rows', 'spellcheck', 'wrap')
            break
          }
        }

        return [ ...globalAttributes, ...allAttributes ].reduce((attributes, attribute) => {
          if (this[attribute] !== undefined) {
            attributes[attribute] = this[attribute]
          }
          return attributes
        }, {})
      }
    }
  }
}

export default { core }
