import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const getPageConfigByPageName = (params) => axios.get(baseUrl + "/page/config", params); // 查询页面的配置信息
export default {
  getPageConfigByPageName,
};
