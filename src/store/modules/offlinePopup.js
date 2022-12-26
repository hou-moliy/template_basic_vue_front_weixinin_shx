import windowService from "@/api/window/index";
import analysis from "@/utils/analysis.js";
const state = {
  offlinePopupShow: false,
  offlineFlag: false, // 是否展示下线弹窗
  startTime: "", // 下线弹窗展示的开始时间
  endTime: "", // 下线弹窗展示的结束时间
  strategyType: false, // 1默认下线弹窗，2时间限制下线弹窗，3优先展示登录弹窗
  dialogCancellable: false,
  loginShow: false,
};

const mutations = {
  SET_OFFLINEPOPUPSHOW (state, data) {
    state.offlinePopupShow = data;
  },
  SET_OFFLINEFLAG (state, data) {
    state.offlineFlag = data;
  },
  SET_STARTTIME (state, data) {
    state.startTime = data;
  },
  SET_ENDTIME (state, data) {
    state.endTime = data;
  },
  SET_STRATEGYTYPE (state, data) {
    state.strategyType = data;
  },
  SET_DIALOGCANCELLABLE (state, data) {
    state.dialogCancellable = data;
  },
  SET_LOGINSHOW (state, data) {
    state.loginShow = data;
  },
};

const actions = {
  // 查询是否下线
  async getCustomorderList ({ commit, dispatch }, payload) {
    // 初始化弹窗数据
    commit("SET_OFFLINEFLAG", false);
    commit("SET_OFFLINEPOPUPSHOW", false);
    commit("SET_LOGINSHOW", false);

    await dispatch("window/getOfflineWindow", null, { root: true });

    return new Promise((resolve, reject) => {
      console.log("2");
      windowService.getPageStatus({ targetId: payload })
        .then(res => {
          if (res.data.code === 200) {
            res.data.data.forEach(item => {
              if (item.limited === false) { // 未配置相关策略
                return reject(item.message);
              } else if ((item.strategyType === 3 && item.limited === true) && !uni.getStorageSync("Authorization")) { // 未登录用户优先展示登录弹窗(strategyType===3，需要校验登录的)
                commit("SET_LOGINSHOW", true);
                commit("SET_OFFLINEFLAG", false);
                commit("SET_OFFLINEPOPUPSHOW", false);
              } else if ((item.strategyType === 2 || item.strategyType === 1) && item.limited === true) { // 已登录用户展示升级弹窗(strategyType===2，需要校验上下时间，strategyType===1，一直下线)
                analysis.dispatch("onPageStatusDown", payload);
                commit("SET_OFFLINEPOPUPSHOW", true);
                commit("SET_OFFLINEFLAG", true);
                commit("SET_STARTTIME", item.data.startTime);
                commit("SET_ENDTIME", item.data.endTime);
                commit("SET_STRATEGYTYPE", item.data.strategyType);
                commit("SET_DIALOGCANCELLABLE", item.data.dialogCancellable);
              }
            });
            resolve();
          } else {
            commit("SET_OFFLINEFLAG", false);
            commit("SET_OFFLINEPOPUPSHOW", false);
            commit("SET_LOGINSHOW", false);
            reject(res.data);
          }
        }).catch(err => reject(err));
    });
  },
};

const getters = {

};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
