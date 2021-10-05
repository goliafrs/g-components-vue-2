import plugins from './src/plugins'
import components from './src/components'

export default {
  install: (Vue, options = {}) => {
    require('./src/assets/main.scss')

    Vue.use(plugins)
    Vue.use(components)

    for (const name of [ 'GSelect', 'GTextField' ]) {
      let component = require(`./src/components/${name}`).default
      if (options.mixins && options.mixins[name]) {
        if (!Array.isArray(options.mixins[name].mixins)) {
          options.mixins[name].mixins = []
        }
        options.mixins[name].mixins.push(component)
        component = options.mixins[name]
      }

      Vue.component(name, component)
    }
  }
}
