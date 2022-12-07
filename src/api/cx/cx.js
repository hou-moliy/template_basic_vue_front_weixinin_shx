import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const search = (params) => axios.get(baseUrl + "/cl/search/", params); // 搜索
const hotSearch = (params) => axios.get(baseUrl + "/cl/top/hotSearchTop", params); // 音频热门搜索
const userPlayMusic = (params) => axios.post(baseUrl + "/cl/countOperation", params); // 用户播放行为
const getSpclVideoList = (params) => axios.post(baseUrl + "/spcl/videosDetail", params); //
export default {
  search,
  hotSearch,
  userPlayMusic,
  getSpclVideoList,
};
