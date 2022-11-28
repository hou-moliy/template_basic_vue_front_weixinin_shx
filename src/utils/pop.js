// 弹窗的公共js
import { navigateToAny } from "./navigateToAny";
import store from "../store";
// 提示性弹窗
export const showNotifyPop = (_this, notifyInfo, confirmCallback = () => { }, cancelCallback = () => { }) => {
  _this.$refs.NotifyPop.show(notifyInfo).then((btn) => {
    confirmCallback(btn);
  }).catch(() => {
    cancelCallback();
  });
};
// 登录弹窗
export const showLoginPop = async (_this, confirmCallback = () => { }, cancelCallback = () => { }) => {
  if (uni.getStorageSync("Authorization")) return;
  const notifyInfo = uni.getStorageSync("windowAllObj")?.common_not_login ?? null;
  if (notifyInfo === null) {
    await store.dispatch("window/getCommonWindow");
  }
  showNotifyPop(_this, notifyInfo, ({ btnInfo }) => {
    navigateToAny(btnInfo, confirmCallback);
  }, cancelCallback = () => { });
};
