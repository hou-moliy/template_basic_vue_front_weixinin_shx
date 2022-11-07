import Vue from "vue";
import store from "./store";
import App from "./App";
import analysis from "./utils/analysis.js";
import globalData from "./globalData.js";
Vue.prototype.globalData = globalData;
Vue.prototype.$staticImgs = globalData.staticImgs;
Vue.prototype.$analysis = analysis;
Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
  ...App,
  store,
});
app.$mount();
