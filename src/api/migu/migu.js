import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const getlistById = params => axios.get(baseUrl + "/video/list", params); // 通过模块Id查询咪咕视频资源列表（包括运营位）
const countVideoOperation = params => axios.post(baseUrl + "/video/countVideoOperation", params); // 用户对视频资源点赞、分享操作进行计数并记录
const miguVideoDetail = params => axios.get(baseUrl + "/video/detail", params); // 通过模块Id查询咪咕视频详情
const moreRecommend = params => axios.get(baseUrl + "/video/more", params); // 查询咪咕视频，小视频更多推荐
export default {
  getlistById,
  countVideoOperation,
  miguVideoDetail,
  moreRecommend,
};
