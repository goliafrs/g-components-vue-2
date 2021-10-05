const thresholds = {
  xs: 600,
  sm: 960,
  md: 1280,
  lg: 1920
}
const scrollBarWidth = 16

let timeout

export default {
  namespaced: true,

  state: {
    viewport: {
      breakpoint: {
        xs: false,
        sm: false,
        smUp: false,
        smDown: false,
        md: false,
        mdUp: false,
        mdDown: false,
        lg: false,
        lgUp: false,
        lgDown: false,
        xl: false
      },
      size: {
        height: 0,
        width: 0
      }
    }
  },

  mutations: {
    setSize(state) {
      const width = window.innerWidth

      const xs = width < thresholds.xs
      const sm = width < thresholds.sm && !xs
      const md = width < (thresholds.md - scrollBarWidth) && !(sm || xs)
      const lg = width < (thresholds.lg - scrollBarWidth) && !(md || sm || xs)
      const xl = width >= (thresholds.lg - scrollBarWidth)

      state.viewport.breakpoint.xs = xs

      state.viewport.breakpoint.sm = sm
      state.viewport.breakpoint.smUp = !xs && (sm || md || lg || xl)
      state.viewport.breakpoint.smDown = (xs || sm) && !(md || lg || xl)

      state.viewport.breakpoint.md = md
      state.viewport.breakpoint.mdUp = !(xs || sm) && (md || lg || xl)
      state.viewport.breakpoint.mdDown = (xs || sm || md) && !(lg || xl)

      state.viewport.breakpoint.lg = lg
      state.viewport.breakpoint.lgUp = !(xs || sm || md) && (lg || xl)
      state.viewport.breakpoint.lgDown = (xs || sm || md || lg) && !xl

      state.viewport.breakpoint.xl = xl

      state.viewport.size.height = window.innerHeight
      state.viewport.size.width = width
    }
  },

  actions: {
    init({ dispatch }) {
      window.addEventListener('resize', () => dispatch('onResize'), { passive: true })
      dispatch('setSize')
    },

    onResize({ dispatch }) {
      clearTimeout(timeout)
      timeout = window.setTimeout(() => dispatch('setSize'), 200)
    },

    setSize({ commit }) {
      commit('setSize')
    }
  },

  getters: {
    viewport: state => state.viewport
  }
}
