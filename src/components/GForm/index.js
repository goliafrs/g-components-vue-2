import render from './render'

export default {
  name: 'GForm',

  props: {
    action: String,
    acceptCharset: String,

    autocomplete: {
      type: String,
      validator: value => {
        return !!~[ 'off', 'on' ].indexOf(value)
      }
    },

    enctype: {
      type: String,
      default: 'application/x-www-form-urlencoded',
      validator: value => {
        return !!~[ 'application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain' ].indexOf(value)
      }
    },

    method: {
      type: String,
      validator: value => {
        return !!~[ 'post', 'get', 'dialog' ].indexOf(value)
      }
    },

    name: String,

    novalidate: {
      type: Boolean,
      default: true
    },

    rel: String,

    target: {
      type: String,
      default: '_self',
      validator: value => {
        return !!~[ '_self', '_blank', '_parent', '_top' ].indexOf(value)
      }
    }
  },

  computed: {
    form() {
      return this.$refs && this.$refs.form && (this.$refs.form.$el || this.$refs.form)
    }
  },

  mounted() {
    this.form.addEventListener('valuechange', this.checkFormValidity)
  },

  beforeDestroy() {
    this.form.removeEventListener('valuechange', this.checkFormValidity)
  },

  methods: {
    checkFormValidity() {
      if (this.form) {
        this.$emit('validation', this.form.checkValidity())
      }
    }
  },

  render
}
