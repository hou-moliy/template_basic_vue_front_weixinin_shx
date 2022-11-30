import SpclService from "../../api/spcl/index";
const state = {
  spclStatus: uni.getStorageSync("spclStatus"),
  aiStatus: uni.getStorageSync("aiStatus"),
};
const mutations = {
  SET_SPCL_STATUS (state, spclStatus) {
    state.spclStatus = spclStatus;
    uni.setStorageSync("spclStatus", spclStatus);
  },
  SET_AI_STATUS (state, aiStatus) {
    state.aiStatus = aiStatus;
    uni.setStorageSync("aiStatus", aiStatus);
  },
};

const actions = {
  // 获取用户视频彩铃开通状态
  getUserSpclStatus ({ commit }) {
    return new Promise((resolve, reject) => {
      SpclService.spclStatus().then(res => {
        if (res.data.code === 200) {
          commit("SET_SPCL_STATUS", res.data.data);
          resolve(res.data);
        }
      });
    });
  },
  // 获取用户AI换铃开通状态
  getUserAiStatus ({ commit }) {
    return new Promise((resolve, reject) => {
      SpclService.aiStatus().then(res => {
        if (res.data.code === 200) {
          commit("SET_AI_STATUS", res.data.data.isAIOpen);
          resolve(res.data.data.isAIOpen);
        }
      });
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
