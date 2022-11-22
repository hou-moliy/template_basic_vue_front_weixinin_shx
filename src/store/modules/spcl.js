import videoService from "@/api/cx/video.js";
import spclService from "@/api/spcl/index.js";
import Vue from "vue";
const state = {
  userSpclData: uni.getStorageSync("userSpclData") || {}, // 用户视频彩铃数据
};

const mutations = {
  // 设置用户的视频彩铃数据
  SET_USER_SPCL_DATA (state, userSpclData) {
    state.userSpclData = userSpclData;
    uni.setStorageSync("userSpclData", JSON.stringify(userSpclData));
  },
  // 设置用户当前播放的数据 vrbtSettingRes
  SET_USER_SPCL_SETTINGS (state, vrbtSettingRes) {
    state.userSpclData.vrbtSettingRes = vrbtSettingRes;
    this.commit("spcl/SET_USER_SPCL_DATA", state.userSpclData);
  },
  // 设置用户所有铃音数据 vrbtResponse
  SET_USER_SPCL_ALL (state, vrbtResponse) {
    state.userSpclData.vrbtResponse = vrbtResponse;
    this.commit("spcl/SET_USER_SPCL_DATA", state.userSpclData);
  },
  // 设置用户铃音的settingId, settingIdRes
  SET_USER_SPCL_SETTINGID (state, settingIdRes) {
    state.userSpclData.settingIdRes = settingIdRes;
    this.commit("spcl/SET_USER_SPCL_DATA", state.userSpclData);
  },
};

const actions = {
  /**
   *
   * 用户行为记录
   * @param {*} { commit }
   * @param {*} {
   * 必传参数：ringId：铃音id, target:目标操作dz/sc/bf/fx, opType:0取消、 1新增 ;
  *  非必传参数：mainId: pageConfig的moduleId, pageName,用于丰富后端日志内容
   * }
   * @return {*}
   */
  handleSpclUserOperate ({ commit }, { ringId, target, opType, mainId, pageName }) {
    return new Promise((resolve) => {
      // 记录
      videoService.getSpclUserBehavior({ ringId, target, opType, mainId, pageName }).then((res) => resolve(res.data));
    });
  },
  // 获取用户所有铃音数据
  getUserAllVideoList ({ dispatch }) {
    return new Promise((resolve) => {
      Vue.prototype.$loading("加载中...", true, 0);
      spclService.getsplykInfo().then(response => {
        if (response.data.code === 200) {
          dispatch("getUserCurVideoList", response).then(() => resolve()).catch(() => resolve());
        } else {
          Vue.prototype.$toast("数据请求失败，请退出重试～");
        }
      });
    });
  },
  // 获取用户当前播放的铃音数据
  getUserCurVideoList ({ commit }, response) {
    return new Promise((resolve, reject) => {
      spclService
        .getsplykCurrentInfo()
        .then(res => {
          if (res.data.code === 200) {
            const userSpclData = {};
            userSpclData.vrbtResponse = response.data?.data ?? []; // 用户的所有铃音
            userSpclData.vrbtSettingRes = res.data?.data?.contentIds ?? []; // 用户当前播放铃音
            userSpclData.settingIdRes = res.data?.data?.settingId ?? "";
            commit("SET_USER_SPCL_DATA", userSpclData);
          }
          resolve();
        })
        .catch((err) => {
          reject(err);
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
