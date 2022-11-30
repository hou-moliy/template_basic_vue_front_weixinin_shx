import videoService from "@/api/cx/video.js";
import spclService from "@/api/spcl/index.js";
// import Vue from "vue";
import videoTools from "@/utils/video.js";
const state = {
  userSpclData: uni.getStorageSync("userSpclData")[0] || {}, // 用户视频彩铃数据
  searchList: [], // 搜索结果列表
  videoList: [],
  VedioListTalNum: 0, // 更多视彩列表总数
  vedioLabelId: -1, // 更多精彩标签id
  moreVideoList: [],
  videoListFromCxVideoType: [],
  myLikeVideoList: [],
  isFirstPlay: uni.getStorageSync("isFirstPlay"), // 是否第一次,控制引导弹窗的展示
  step: 1, // 新手引导步骤
};

const mutations = {
  // 设置是否展示引导弹窗
  SET_FIRST_PLAY (state, isFirstPlay) {
    state.isFirstPlay = isFirstPlay;
    uni.setStorageSync("isFirstPlay", isFirstPlay);
  },
  // 设置新手引导步骤
  SET_STEP (state, step) {
    state.step = step;
  },
  // 设置用户的视频彩铃数据
  SET_USER_SPCL_DATA (state, userSpclData) {
    state.userSpclData = userSpclData;
    uni.setStorageSync("userSpclData", [userSpclData]);
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
  UPDATE_USER_SPCL_ALL (state, ringItem) {
  },
  // 设置用户铃音的settingId, settingIdRes
  SET_USER_SPCL_SETTINGID (state, settingIdRes) {
    state.userSpclData.settingIdRes = settingIdRes;
    this.commit("spcl/SET_USER_SPCL_DATA", state.userSpclData);
  },
  // 修改搜索列表数据
  getSearchList (state, payload) {
    let tempList = payload;
    tempList = videoTools.videoInfoUpdate(tempList);
    tempList = JSON.parse(JSON.stringify(tempList));
    console.log(tempList, "tempList");
    state.searchList = tempList;
  },
  // 修改视彩列表
  M_changeVideoList (state, payload) {
    let tempList = payload;
    tempList = videoTools.videoInfoUpdate(tempList);
    console.log(tempList, "获取视彩列表");
    tempList = JSON.parse(JSON.stringify(tempList));
    state.videoList = tempList;
  },
  // 修改视彩列表总数
  getVedioListTalNum (state, payload) {
    state.VedioListTalNum = payload;
  },
  // 修改标签Id
  getVideoLabelId (state, payload) {
    state.vedioLabelId = payload;
  },
  // 修改更多精彩视频列表
  getMoreVideoList (state, payload) {
    let tempList = payload;
    tempList = videoTools.videoInfoUpdate(tempList);
    tempList = JSON.parse(JSON.stringify(tempList));
    state.moreVideoList = tempList;
  },
  // 修改视频分类视频列表
  getVideoListFromCxVideoType (state, payload) {
    let tempList = payload;
    tempList = videoTools.videoInfoUpdate(tempList);
    tempList = JSON.parse(JSON.stringify(tempList));
    state.videoListFromCxVideoType = tempList;
  },
  // 修改我的喜欢视频列表
  getMyLikeVideoList (state, payload) {
    let tempList = payload;
    tempList = videoTools.videoInfoUpdate(tempList);
    tempList = JSON.parse(JSON.stringify(tempList));
    state.myLikeVideoList = tempList;
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
    return new Promise((resolve, reject) => {
      spclService.getsplykInfo().then(response => {
        if (response.data.code === 200) {
          dispatch("getUserCurVideoList", response).then(() => resolve()).catch(() => resolve());
        } else {
          // Vue.prototype.$toast("数据请求失败，请退出重试～");
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
            const spclData = {};
            spclData.vrbtResponse = response.data?.data ?? []; // 用户的所有铃音
            spclData.vrbtSettingRes = res.data?.data?.contentIds ?? []; // 用户当前播放铃音
            spclData.settingIdRes = res.data?.data?.settingId ?? "";
            commit("SET_USER_SPCL_DATA", spclData);
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
