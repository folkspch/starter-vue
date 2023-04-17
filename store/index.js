import Vuex from 'vuex'
import Vue from 'vue'


Vue.use(Vuex)

export default () => new Vuex.Store({
  state: () => ({
    typeInput: [],
    salesTitle: {}
  }),
  mutations: {
    setTypeInput(state, payload) {
      state.typeInput[payload.index] = payload.value
      console.log(state.typeInput)
    },
    setTypeInputSize(state, payload) {
      state.typeInput.splice(payload)
    },
    setSalesTitle(state, payload) {
      state.salesTitle = payload
    }
  },
  actions: {

  },
  modules: {

  }
})