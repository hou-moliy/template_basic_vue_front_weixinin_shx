import Vue from "vue";
import store from "./store";
import App from "./App";
import analysis from "./utils/analysis.js";
import globalData from "./globalData.js";
import notifyPop from "./components/popup-template-notify/popup-template-notify.vue";

// 引入阿里矢量图标
import "font/font-css.css";
import { showToast, showLoading } from "@/utils/common.js";
Vue.component("NotifyPop", notifyPop);
Vue.prototype.globalData = globalData;
Vue.prototype.$staticImgs = globalData.staticImgs;
Vue.prototype.$analysis = analysis;
Vue.config.productionTip = false;
Vue.prototype.$toast = showToast;
Vue.prototype.$loading = showLoading;
App.mpType = "app";

const app = new Vue({
  ...App,
  store,
});

app.$mount();
