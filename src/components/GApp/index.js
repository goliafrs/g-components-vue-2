import render from './render'

export default {
  name: 'GApp',

  functional: true,

  props: {
    theme: {
      type: String,
      default: 'light',
      validator: value => {
        return !!~[ 'light', 'dark' ].indexOf(value)
      }
    },

    center: Boolean
  },

  render
}
