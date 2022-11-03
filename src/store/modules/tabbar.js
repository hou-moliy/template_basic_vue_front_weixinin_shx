
const state = {
  tabbarList: {
    color: "#7A7E83", // 非选择项的字体颜色
    selectedColor: "#3cc51f", // 选择项的字体颜色
    list: [
      {
        iconPath: "/static/tabbar/component.png",
        selectIconPath: "/static/tabbar/component_select.png",
        text: "彩铃",
        pagePath: "/pages/cl/index",
      },
      {
        iconPath: "/static/tabbar/template.png",
        selectIconPath: "/static/tabbar/template_select.png",
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
