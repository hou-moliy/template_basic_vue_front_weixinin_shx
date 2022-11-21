
const state = {
  tabbarList: {
    color: "rgba(153,153,153,1)", // 非选择项的字体颜色
    selectedColor: "#000", // 选择项的字体颜色
    list: [
      {
        iconPath: "/static/tabbar/cl_tabbar.png",
        selectIconPath: "/static/tabbar/cl_active_tabbar.png",
        text: "彩铃",
        pagePath: "/pages/cl/index",
      },
      {
        iconPath: "/static/tabbar/mine_tabbar.png",
        selectIconPath: "/static/tabbar/mine_active_tabbar.png",
        text: "我的",
        pagePath: "/pages/mine/index",
      },
    ],
  },
};

const mutations = {
};

const actions = {
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
