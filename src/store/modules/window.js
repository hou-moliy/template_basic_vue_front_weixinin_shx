import windowService from "@/api/window/index";

const state = {
  windowList: [],
};

const mutations = {
  SET_WINDOWLIST ({ state }, windowList) {
    state.windowList = windowList;
    uni.setStorageSync("windowList", windowList);
  },
};

const actions = {
  // 获取公共配置的弹窗，如登录、设置等
  getCommonWinow ({ commit, state }) {
    // if (!state.windowList.length) return;
    windowService.getWindowAll({ windowScene: "common" }).then(res => {
      if (res.data.code === 200) {
        // commit("SET_WINDOWLIST", res.data.data);
        // uni.setStorageSync("windowList", res.data.data);
        const windowList = res.data.data;
        const windowAllObj = {};
        for (const window of windowList) {
          windowAllObj[window.windowCode] = window;
          uni.setStorageSync("windowAllObj", windowAllObj);
        }
      }
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
