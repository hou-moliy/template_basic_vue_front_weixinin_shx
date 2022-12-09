import store from "../store";
import Vue from "vue";
import SpclService from "@/api/spcl/index";
// 判断是否已设为视彩
const videoInfoUpdate = function (list) {
  const tempList = JSON.parse(JSON.stringify(list));
  const userSpclData = store.state.spcl.userSpclData;
  if (
    uni.getStorageSync("Authorization") && userSpclData && userSpclData.vrbtResponse) {
    const isBuyList = userSpclData.vrbtResponse;
    for (const item of tempList) {
      const isBuy = isBuyList.filter(buy => item.ringId === buy.ringId);
      if (isBuy[0]) {
        item.isBuyVideo = true;
      }
    }
  } else {
    for (const item of tempList) {
      item.isBuyVideo = false;
    }
  }
  return tempList;
};

// 点击设置视频彩铃按钮
const handlePurchaseVideo = (ringItem, setCallBack = () => { }) => {
  if (uni.getStorageSync("Authorization")) {
    store.dispatch("user/getUserSpclStatus").then(res => {
      if (res === 1) { // 已开通视频彩铃
        const popupInfo = { ...store.state.window.windowAllObj.common_spcl_set };
        popupInfo.windowDesc = popupInfo.windowDesc.replace("#{ringName}", `《${ringItem.ringName}》`);
        popupInfo.windowProtocol = store.state.user.aiStatus ? "" : popupInfo.windowProtocol; // 已开通AI换铃不展示选择框
        uni.$emit("operitionShow", {
          popupInfo, btnClickCallBack: (event) => confirmOrderSpcl({ event, ringItem, setCallBack }),
        });
      } else { // 未开通
        const popupInfo = store.state.window.windowAllObj.common_spcl_open;
        popupInfo.windowProtocol = store.state.user.aiStatus ? "" : popupInfo.windowProtocol; // 已开通AI换铃不展示选择框
        uni.$emit("operitionShow", { popupInfo, btnClickCallBack: (event) => operitionBtnClick({ event, ringItem }) });
      }
    });
  } else {
    uni.$emit("openLoginPopup", { msg: "展示登录弹窗" });
  }
};
// 设置视频彩铃
const handleSetPcl = (ringItem, setCallBack = () => { }) => {
  SpclService.setSpcl({ ringId: ringItem.ringId }).then(res => {
    if (res.data.code === 200) {
      if (res.data.data.code === 0) {
        Vue.prototype.$toast("耶，设置成功", 4000);
        // 更新用户所有铃音数据
        store.commit("spcl/UPDATE_USER_SPCL_ALL", ringItem);
        // 更新当前播放数据
        store.commit("spcl/UPDATE_USER_SPCL_SETTINGS", ringItem.ringId);
        setCallBack();
        store.commit("window/SET_OPERITION_SHOW", false);
      } else {
        Vue.prototype.$toast("设置失败，请稍后重试");
        store.commit("window/SET_OPERITION_SHOW", true);
      }
    } else {
      Vue.prototype.$toast(res.data.message);
      store.commit("window/SET_OPERITION_SHOW", true);
    }
    uni.hideLoading();
  });
};
// 确定订购视频彩铃按钮点击
const confirmOrderSpcl = ({ event, ringItem, setCallBack }) => {
  Vue.prototype.$loading("设置中", true, 0);
  if (event.protocolCheckFlag) { // 勾选了AI换铃
    handleOpenAi().then(() => {
      handleSetPcl(ringItem, setCallBack);
    }).catch(() => Vue.prototype.$toast("AI换铃开通,失败请重试"));
  } else {
    handleSetPcl(ringItem, setCallBack);
  }
};
// 订购弹窗按钮点击
const operitionBtnClick = ({ event, ringItem }) => {
  if (event.btnInfo.type === 1) { // 关闭弹窗
  } else if (event.btnInfo.type === 2) { // 订购
    handleOpenSpcl({ event, ringItem });
  }
};
// 开通视频彩铃
const handleOpenSpcl = ({ event, ringItem }) => {
  SpclService.openSpcl({ servType: "001" }).then(res => {
    if (res.data.code === 200) {
      if (event.protocolCheckFlag) { // 勾选了AI换铃
        store.dispatch("user/getUserSpclStatus"); // 更新视频彩铃状态
        handleOpenAi().then(() => {
          Vue.prototype.$toast("成功开通视频彩铃业务");
          store.commit("window/SET_OPERITION_SHOW", false);
        }).catch(() => {
          Vue.prototype.$toast("AI换铃开通,失败请重试");
          store.commit("window/SET_OPERITION_SHOW", true);
        });
      } else {
        Vue.prototype.$toast("成功开通视频彩铃业务");
        // 更新视频彩铃状态
        store.dispatch("user/getUserSpclStatus");
        store.commit("window/SET_OPERITION_SHOW", false);
      }
    } else {
      Vue.prototype.$toast("开通失败，请重新开通");
      store.commit("window/SET_OPERITION_SHOW", true);
    }
  });
};
// 开通或关闭AI换铃
const handleOpenAi = (type = 2) => { // type 2 开通, 1取消
  return new Promise((resolve, reject) => {
    SpclService.openAi({ type }).then(res => {
      if (res.data.code === 200) {
        // 更新ai换铃声状态
        store.dispatch("user/getUserAiStatus");
        resolve(res.data);
      } else {
        reject(res.data);
      }
    });
  });
};
// Ai换铃状态切换
const changeAi = () => {
  store.dispatch("user/getUserSpclStatus").then(spclStatus => {
    if (spclStatus === 1) { // 已开通、展示开启或关闭ai换铃声提示
      store.dispatch("user/getUserAiStatus").then(isAIOpen => {
        const type = isAIOpen === 1 ? 1 : 2; // type 1是取消,2是开启
        const notifyInfo = type === 1 ? store.state.window.windowAllObj.common_ai_cancel : store.state.window.windowAllObj.common_ai_open;
        uni.$emit("changeAi", {
          notifyInfo,
          confirmCallback: () => handleAiConfirmCallback(type),
        });
      });
    } else { // 未开通、展示开通弹窗
      const popupInfo = store.state.window.windowAllObj.common_spcl_open;
      uni.$emit("operitionShow", { popupInfo, btnClickCallBack: (item) => operitionBtnClick(item) });
    }
  });
};
// 处理AI弹窗点击回调
const handleAiConfirmCallback = (type) => {
  const tips = type === 1 ? "取消中" : "开启中";
  Vue.prototype.$loading(tips, true, 0);
  handleOpenAi(type).then(() => {
    type === 1 ? Vue.prototype.$toast("取消成功!") : Vue.prototype.$toast("开启成功!");
  }).catch(err => {
    Vue.prototype.$toast(err.message);
  }).finally(() => {
    uni.hideLoading();
  });
};

module.exports = {
  videoInfoUpdate,
  handlePurchaseVideo,
  handleOpenAi,
  changeAi,
};
