import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;

// 页面状态
const getPageStatus = params => {
  // 获取当前帐号信息
  const accountInfo = wx.getAccountInfoSync();
  // env类型
  const envVersion = accountInfo.miniProgram.envVersion;
  console.log("version-", envVersion);
  if (envVersion === "develop" || envVersion === "trial") {
    params.targetId = "test_" + params.targetId;
  }
  return axios.get(baseUrl + "/pageStatus/", params);
};
const getWindowAll = params => axios.get(baseUrl + "/window/all", params); // 查弹窗接口
export default {
  getPageStatus,
  getWindowAll,
};
