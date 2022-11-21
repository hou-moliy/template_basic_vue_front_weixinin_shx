import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const getsplykInfo = () => axios.get(baseUrl + "/spcl/qryAllRes"); // 查询铃音库所有内容
const getsplykCurrentInfo = () => axios.get(baseUrl + "/spcl/qrySetRes"); // 查询铃音库所有内容(收settingID)
const delMultiVideo = params => axios.post(baseUrl + "/spcl/delBatch", params); // ——批量删除闲置铃音()

export default {
  getsplykInfo,
  getsplykCurrentInfo,
  delMultiVideo,
};
