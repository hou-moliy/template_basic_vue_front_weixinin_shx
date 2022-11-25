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
  // 获取公共配置的提示性弹窗，如登录、设置等
  getCommonWinow ({ commit, state }) {
    if (!uni.getStorageSync("pageDownDialog")) { // 存弹窗内容信息，避免重复请求
      windowService.getWindowAll({ windowScene: "common" }).then(res => {
        if (res.data.code === 200) {
          const windowList = res.data.data;
          const windowAllObj = {};
          for (const window of windowList) {
            windowAllObj[window.windowCode] = window;
            uni.setStorageSync("windowAllObj", windowAllObj);
          }
        }
      });
    }
  },
  // 获取下线弹窗
  getOfflineWinow ({ commit, dispatch }, state) {
    if (!uni.getStorageSync("pageDownDialog")) { // 存弹窗内容信息，避免重复请求
      windowService.getWindowAll({ windowCode: "pageDownDialog" })
        .then((res) => {
          uni.setStorageSync("pageDownDialog", res.data.data);
        });
    }
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
