import windowService from "@/api/window/index";
const state = {
  windowAllObj: uni.getStorageSync("windowAllObj") || {},
};

const mutations = {
  SET_WINDOW_ALL_OBJ (state, windowAllObj) {
    state.windowAllObj = windowAllObj;
    uni.setStorageSync("windowAllObj", windowAllObj);
  },
};

const actions = {
  // 获取公共配置的提示性弹窗，如登录、设置等
  getCommonWindow ({ commit, state }) {
    if (!uni.getStorageSync("windowAllObj")) { // 存弹窗内容信息，避免重复请求
      windowService.getWindowAll({ windowScene: "common" }).then(res => {
        if (res.data.code === 200) {
          const windowList = res.data.data;
          const windowAllObj = {};
          for (const window of windowList) {
            windowAllObj[window.windowCode] = window;
            commit("SET_WINDOW_ALL_OBJ", windowAllObj);
          }
        }
      });
    }
  },
  // 获取下线弹窗
  getOfflineWindow ({ commit, dispatch }, state) {
    console.log("1");
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
