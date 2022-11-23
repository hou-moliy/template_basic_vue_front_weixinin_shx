// 弹窗的公共js
import { navigateToAny } from "./navigateToAny";
// 提示性弹窗
export const showNotifyPop = (_this, notifyInfo, confirmCallback = () => { }, cancelCallback = () => { }) => {
  _this.$refs.NotifyPop.show(notifyInfo).then((btn) => {
    confirmCallback(btn);
  }).catch(() => {
    cancelCallback();
  });
};
// 登录弹窗
export const showLoginPop = (_this, confirmCallback = () => { }, cancelCallback = () => { }) => {
  const notifyInfo = uni.getStorageSync("windowAllObj").common_not_login;
  showNotifyPop(_this, notifyInfo, ({ btnInfo }) => {
    console.log(btnInfo, "sdfsdffdsd");
    navigateToAny(btnInfo, confirmCallback);
  }, cancelCallback = () => { });
};
