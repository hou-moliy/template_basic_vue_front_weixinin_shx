import MyService from "../../api/my/my";
import SpclService from "../../api/spcl/index";
const state = {
  name: "xxx",
  spclStatus: uni.setStorageSync("spclStatus"),
};
const mutations = {
  SET_SPCL_STATUS (state, spclStatus) {
    state.spclStatus = spclStatus;
    uni.setStorageSync("spclStatus", spclStatus);
  },
};

const actions = {
  // 获取用户视频彩铃开通状态
  getUserSpclStatus () {
    return new Promise((resolve, reject) => {
      SpclService.spclStatus().then(res => {
        // if (res.data.code === 200) {

        // }
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
