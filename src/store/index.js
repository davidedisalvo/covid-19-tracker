import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    minimizing: false
  },
  mutations: {
    minimized(state, payload) {
      state.minimizing = payload
    },
    toggleMinimized (state, payload) {
      const par = state.minimizing
      state.minimizing = !par
    }
  },
  actions: {},
  modules: {}
});
