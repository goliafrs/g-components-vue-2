import proxy from 'g-proxy'

export const core = {
  mixins: [ proxy() ],

  props: {
    trueValue: {
      type: null,
      default: true
    },
    falseValue: {
      type: null,
      default: false
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    checked() {
      if (this.proxy === this.trueValue) {
        return true
      }

      return false
    }
  },

  methods: {
    toggle() {
      if (!this.disabled) {
        if (this.proxy === this.falseValue) {
          this.proxy = this.trueValue
        } else {
          this.proxy = this.falseValue
        }
      }
    }
  }
}

export default { core }
