import Vue from "vue";
import store from "./store";
import App from "./App";
import analysis from "./utils/analysis.js";
import globalData from "./globalData.js";
import notifyPop from "./components/popup-template-notify/popup-template-notify.vue";
import loginService from "@/api/my/my.js";
import { showNotifyPop, showLoginPop } from "../src/utils/pop";
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
Vue.prototype.$showNotifyPop = showNotifyPop; // 展示提示性弹窗
Vue.prototype.$showLoginPop = showLoginPop;// 展示登录弹窗

App.mpType = "app";

const app = new Vue({
  ...App,
  store,
});

app.$mount();
