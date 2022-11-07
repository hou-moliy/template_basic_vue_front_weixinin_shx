import * as axios from "../index";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;

const getPageConfig = params => axios.get(baseUrl + "/page/config", params);

const getBanner = params => axios.get(baseUrl + "/ad/", params);

const getTab = (params) => axios.get(baseUrl + "/tab/v2", params);

const topicsData = () => axios.get(baseUrl + "/cy/activity/featured");

const tjLabelData = () => axios.get(baseUrl + "/cy/label/");

const tjItemData = params => axios.get(baseUrl + "/cy/info/", params);

const applyCy = () => axios.post(baseUrl + "/cy/info/apply");

const weekJjData = params => axios.get(baseUrl + "/cy/weekStar", params);

const setAll = params => axios.post(baseUrl + "/cy/info/setAll", params);

const setTarget = params => axios.post(baseUrl + "/cy/info/setTarget", params);

const favor = params => axios.post(baseUrl + "/cy/operate/favor", params);

const unfavor = params => axios.post(baseUrl + "/cy/operate/unfavor", params);

const countLiveOperation = params => axios.post(baseUrl + "/live/source/countLiveOperation", params);

export default {
  getPageConfig,
  getBanner,
  getTab,
  topicsData,
  tjLabelData,
  tjItemData,
  applyCy,
  weekJjData,
  setAll,
  setTarget,
  favor,
  unfavor,
  countLiveOperation,
};
