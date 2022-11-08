import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const getSpclIcon = (params) => axios.get(baseUrl + "/spcl/icon", params);// 图标
const getSpclBanner = (params) => axios.get(baseUrl + "/ad/", params);// banner
// const spclHotKey = (params) => axios.get(baseUrl+'/spcl/search/hot', params);//搜索
const spclHotKey = (params) => axios.get(baseUrl + "/spcl/top/hotSearchTop", params);// 搜索 视频 热搜榜单
const spclSearch = (params) => axios.get(baseUrl + "/spcl/search/", params);// 搜索
const getSpclTopicListIndex = (params) => axios.get(baseUrl + "/spcl/topic/top4", params);// 专题
const getSpclTopicList = (params) => axios.get(baseUrl + "/spcl/topic/", params);// 专题列表
const getSpclByTopicId = (params) => axios.get(baseUrl + "/spcl/topic/getVideoByTopicId", params);// 专题下的列表
const getSpclLabel = (params) => axios.get(baseUrl + "/spcl/label/", params);// 分类
const getSpclLabelVideoList = (params) => axios.get(baseUrl + "/spcl/label/listWithPageAndType", params);// 分类列表
const getSpclLabelMore = (params) => axios.get(baseUrl + "/spcl/label/more", params);// 更多精彩
const getSpclWithSource = (params) => axios.get(baseUrl + "/spcl/label/withSource", params);// 分类列表
const getSpclVideoDetail = (params) => axios.get(baseUrl + "/spcl/videoDetail", params);// 视频详情
const getSpclUserBehavior = (params) => axios.post(baseUrl + "/spcl/countVideoOperation", params);// 用户行为
const getSpclTopicAnother = (params) => axios.get(baseUrl + "/spcl/topic/another", params);// 其他专题
const getSpclAiStatus = (params) => axios.get(baseUrl + "/spcl/status", params);// 查询视频彩铃业务AI专用
const getSpclStatus = (params) => axios.get(baseUrl + "/spcl/statusLn", params);// 视频彩铃业务是否开通
const spclOpen = (params) => axios.get(baseUrl + "/spcl/openSpcl", params);// 开通视频彩铃业务
const setUpSpcl = (params) => axios.post(baseUrl + "/spcl/setUpSpcl", params);// 设置视频彩铃
const getRecentlyList = (params) => axios.get(baseUrl + "/spcl/userDetailsWithPage", params);// 最近播放
const deleteRecentlyList = (params) => axios.post(baseUrl + "/spcl/batchDelete", params);// 删除
const getBehaviorList = (params) => axios.get(baseUrl + "/spcl/userDetailsWithPage", params);// 获取用户行为列表
const getUserLikesList = (params) => axios.get(baseUrl + "/spcl/userOperateIdInfo", params);// 获取用户点赞列表
const getVideosDetail = (params) => axios.post(baseUrl + "/spcl/videosDetail", params);// 获取视频详细信息
const getSceneryListById = (params) => axios.get(baseUrl + "/spcl/label/getByLabelIdWithPage", params);// 获取发现首页风景组件的列表
const getIopList = (params) => axios.get(baseUrl + "/labelAbility/querySpcl", params);// 获取发现首页风景组件的列表
const getSpclByTopicOne = (params) => axios.get(baseUrl + "/spcl/topic/getOne", params);// 获取专题详情
export default {
  getSpclIcon,
  getSpclBanner,
  getSpclTopicListIndex,
  getSpclTopicList,
  getSpclByTopicId,
  getSpclLabel,
  getSpclLabelVideoList,
  getSpclLabelMore,
  getSpclWithSource,
  getSpclVideoDetail,
  spclSearch,
  spclHotKey,
  getSpclTopicAnother,
  getSpclUserBehavior,
  getSpclStatus,
  spclOpen,
  setUpSpcl,
  getRecentlyList,
  deleteRecentlyList,
  getBehaviorList,
  getUserLikesList,
  getVideosDetail,
  getSceneryListById,
  getSpclAiStatus,
  getSpclByTopicOne,
  getIopList,
};
