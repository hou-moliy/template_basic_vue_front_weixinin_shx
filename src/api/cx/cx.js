import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const getCxTab = () => axios.get(baseUrl + "/tab/"); // 获取彩秀tab
const getCxMusicLabel = () => axios.get(baseUrl + "/cl/label/"); // 获取彩秀label
const getCxMusicByLabelId = (params) => axios.get(baseUrl + "/cl/label/getByLabelId", params); // 通过LabelId获取音频
const getCxMusicHotListByTopicId = (params) => axios.get(baseUrl + "/cl/topic/hotList", params); // 获取专题音乐列表
const getCxMusicHistory = (params) => axios.get(baseUrl + "/cl/userListenRecords", params); // 试听记录
const getCxMusicTopic = (params) => axios.get(baseUrl + "/cl/topic/"); // 专题
const getCxMusicDetail = (params) => axios.get(baseUrl + "/cl/videoDetail", params); // 获取音频详情
const search = (params) => axios.get(baseUrl + "/cl/search/", params); // 搜索
const hotSearch = (params) => axios.get(baseUrl + "/cl/top/hotSearchTop", params); // 音频热门搜索
const getCxMusicAnotherTopic = (params) => axios.get(baseUrl + "/cl/topic/another", params); // 获取另外专题
const queryClStatus = () => axios.get(baseUrl + "/cl/status"); // 获取音频开通状态
const openYpcl = () => axios.get(baseUrl + "/cl/openCl"); // 开通音频业务
const userPlayMusic = (params) => axios.post(baseUrl + "/cl/countOperation", params); // 用户播放行为
const userPlayTopicMusic = (params) => axios.post(baseUrl + "/cl/topic/countOperation", params); // 用户专题播放
const userShareMusic = (params) => axios.post(baseUrl + "/cl/topic/countTopicOperation", params); // 专题分享行为
const getSpclVideoList = (params) => axios.post(baseUrl + "/spcl/videosDetail", params); //
const getClMusicList = (params) => axios.post(baseUrl + "/cl/videosDetail", params); //
const batchDelete = (params) => axios.post(baseUrl + "/cl/batchDelete", params); // 删除最近播放
const behaviors = params => axios.get(baseUrl + "/cl/topic/behaviors", params);
const getSpclByTopicOne = (params) => axios.get("/spcl/topic/getOne", params);// 获取专题详情
export default {
  getCxTab,
  getCxMusicLabel,
  getCxMusicByLabelId,
  getCxMusicHotListByTopicId,
  getCxMusicHistory,
  getCxMusicTopic,
  search,
  hotSearch,
  getCxMusicAnotherTopic,
  userPlayTopicMusic,
  queryClStatus,
  getCxMusicDetail,
  userPlayMusic,
  openYpcl,
  // getClSourceList,
  getSpclVideoList,
  getClMusicList,
  batchDelete,
  userShareMusic,
  behaviors,
  getSpclByTopicOne,
};
