import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const getPageConfigByPageName = (params) => axios.get(baseUrl + "/page/config", params); // 查询页面的配置信息
const getTabAndPageConfig = (params) => axios.get(baseUrl + "/tab/", params); // 首页查询tab信息和tab下的页面配置信息
export default {
  getPageConfigByPageName,
  getTabAndPageConfig,
};
