import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import modules from "./modules/index";
Vue.use(Vuex);
export default new Vuex.Store({
  modules,
  getters,
  mutations: {
    // 公共的mutations
  },
  actions: {
    // 公共的actions
  },
  strict: process.env.NODE_ENV.indexOf("prod") !== -1,
});
