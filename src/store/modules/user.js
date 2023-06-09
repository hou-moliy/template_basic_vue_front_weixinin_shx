import SpclService from "@/api/spcl/index";
const state = {
  spclStatus: uni.getStorageSync("spclStatus") || 0, // 0 未开通,1已开通
  aiStatus: uni.getStorageSync("aiStatus") || 0, // 0 未开通,1已开通
  navFlag: "curt", // 个人铃音库的tab
};
const mutations = {
  SET_SPCL_STATUS (state, spclStatus) {
    state.spclStatus = parseInt(spclStatus);
    uni.setStorageSync("spclStatus", parseInt(spclStatus));
  },
  SET_AI_STATUS (state, aiStatus) {
    state.aiStatus = parseInt(aiStatus);
    uni.setStorageSync("aiStatus", parseInt(aiStatus));
  },
  SET_NAV_FLAG (state, navFlag) {
    state.navFlag = navFlag;
  },
};

const actions = {
  // 获取用户视频彩铃开通状态
  getUserSpclStatus ({ commit }) {
    if (!uni.getStorageSync("Authorization")) return;
    return new Promise((resolve, reject) => {
      SpclService.spclStatus().then(res => {
        if (res.data.code === 200) {
          commit("SET_SPCL_STATUS", res.data.data);
          resolve(res.data.data);
        } else {
          reject(res.data);
        }
      }).catch(err => reject(err));
    });
  },
  // 获取用户AI换铃开通状态
  getUserAiStatus ({ commit }) {
    if (!uni.getStorageSync("Authorization")) return;
    return new Promise((resolve, reject) => {
      SpclService.aiStatus().then(res => {
        if (res.data.code === 200) {
          const isAIOpen = res.data?.data?.isAIOpen ?? 0;
          commit("SET_AI_STATUS", isAIOpen);
          resolve(isAIOpen);
        } else {
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
