// 模板配置化相关接口
import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const activityUrl = globalData.activityUrl;
const getPageConfigByPageName = (params) => axios.get(baseUrl + "/page/config", params); // 查询页面的组件化配置信息
const getTabAndPageConfig = (params) => axios.get(baseUrl + "/tab/", params); // 首页查询tab信息和tab下的页面配置信息
const getPageConfigByActivityId = (params, headers) => axios.get(activityUrl + "/config/getInfoStrict", params, true, { headers }); // 查询页面背景图、标题等配置信息(校验有效期)
const getTabList = (params) => axios.get(baseUrl + "/tab/config", params); // 首页查询tab信息
const getActivityStatusByActivityId = (params) => axios.get(baseUrl + "/page/activity/verify", params); // 查询页面配置状态

export default {
  getPageConfigByPageName,
  getTabAndPageConfig,
  getPageConfigByActivityId,
  getTabList,
  getActivityStatusByActivityId,
};
