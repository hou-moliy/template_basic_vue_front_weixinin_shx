import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const getsplykInfo = () => axios.get(baseUrl + "/spcl/qryAllRes"); // 查询铃音库所有内容
const getsplykCurrentInfo = () => axios.get(baseUrl + "/spcl/qrySetRes"); // 查询铃音库所有内容(传settingID)
const delMultiVideo = params => axios.post(baseUrl + "/spcl/delBatch", params); // 批量删除闲置铃音
const cancelCurPlay = params => axios.get(baseUrl + "/spcl/cancelBatch", params); // 当前播放全部取消，设为闲置铃音, 传settingId
const modifySpclByIds = params => axios.post(baseUrl + "/spcl/modifySpcl", params); // 更新当前设置的彩铃，修改当前播放（有一条数据及以上1）取消或设为当前播放，传spclIds
const setCurrentSpcl = params => axios.post(baseUrl + "/spcl/setCurrent", params); // 新增当前播放（当前播放无数据）

export default {
  getsplykInfo,
  getsplykCurrentInfo,
  delMultiVideo,
  cancelCurPlay,
  modifySpclByIds,
  setCurrentSpcl,
};