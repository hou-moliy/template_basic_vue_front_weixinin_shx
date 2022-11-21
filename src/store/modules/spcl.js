import videoService from "@/api/cx/video.js";
const state = {
};

const mutations = {
};

const actions = {
  /**
   *
   *
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
