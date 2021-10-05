import Vue from 'vue'
import Vuex from 'vuex'

import viewport from './modules/viewport'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { viewport },

  strict: process.env.NODE_ENV !== 'production'
})
