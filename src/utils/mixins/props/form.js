export const form = {
  props: {
    form: String,
    formaction: String,

    formenctype: {
      type: String,
      validator: value => {
        return !!~[ 'application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain' ].indexOf(value)
      }
    },
    formmethod: {
      type: String,
      validator: value => {
        return !!~[ 'get', 'post', 'dialog' ].indexOf(value)
      }
    },
    formtarget: {
      type: String,
      validator: value => {
        return !!~[ '_self', '_blank', '_parent', '_top' ].indexOf(value)
      }
    },

    formnovalidate: {
      type: Boolean,
      default: false
    }
  }
}

export default { form }
