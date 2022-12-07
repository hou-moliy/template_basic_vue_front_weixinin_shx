import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const getSpclIcon = (params) => axios.get(baseUrl + "/spcl/icon", params);// 图标
const spclHotKey = (params) => axios.get(baseUrl + "/spcl/top/hotSearchTop", params);// 搜索 视频 热搜榜单
const spclSearch = (params) => axios.get(baseUrl + "/spcl/search/", params);// 搜索
const getSpclLabel = (params) => axios.get(baseUrl + "/spcl/label/", params);// 分类
const getSpclLabelVideoList = (params) => axios.get(baseUrl + "/spcl/label/listWithPageAndType", params);// 分类列表
const getSpclVideoDetail = (params) => axios.get(baseUrl + "/spcl/videoDetail", params);// 视频详情
const getSpclUserBehavior = (params) => axios.post(baseUrl + "/spcl/countVideoOperation", params);// 用户行为
const getBehaviorList = (params) => axios.get(baseUrl + "/spcl/userDetailsWithPage", params);// 获取用户行为列表
export default {
  getSpclIcon,
  getSpclLabel,
  getSpclLabelVideoList,
  getSpclVideoDetail,
  spclSearch,
  spclHotKey,
  getSpclUserBehavior,
  getBehaviorList,
};
