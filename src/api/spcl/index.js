// 以spcl开头的相关接口放这里
import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const getsplykInfo = () => axios.get(baseUrl + "/spcl/qryAllRes"); // 查询铃音库所有内容
const getsplykCurrentInfo = () => axios.get(baseUrl + "/spcl/qrySetRes"); // 查询铃音库所有内容(传settingID)
const delMultiVideo = params => axios.post(baseUrl + "/spcl/delBatch", params); // 批量删除闲置铃音
const cancelCurPlay = params => axios.get(baseUrl + "/spcl/cancelBatch", params); // 当前播放全部取消，设为闲置铃音, 传settingId
const modifySpclByIds = params => axios.post(baseUrl + "/spcl/modifySpcl", params); // 更新当前设置的彩铃，修改当前播放（有一条数据及以上1）取消或设为当前播放，传spclIds
const setCurrentSpcl = params => axios.post(baseUrl + "/spcl/setCurrent", params); // 新增当前播放（当前播放无数据）
const getSpclListByLabelId = (params) => axios.get(baseUrl + "/spcl/label/listWithPageAndType", params);// 根据标签ID查询铃音列表接口
const getVideoByActivityId = (params) => axios.get(baseUrl + "/spcl/topic/getVideoByActivityId", params); // 根据活动id查询列表接口
const getVideoByActivityIdPage = (params) => axios.get(baseUrl + "/spcl/topic/getVideoByActivityIdPage", params); // 根据活动id查询列表接口(分页)
const openSpcl = (params) => axios.get(baseUrl + "/mock/spcl_open", params); // 视频彩铃业务开通
const openAi = (params) => axios.get(baseUrl + "/spcl/ai/aiFunction", params); // AI换铃业务开通
const spclStatus = (params) => axios.get(baseUrl + "/mock/spcl_status", params); // 查询视频彩铃开通状态
const aiStatus = (params) => axios.get(baseUrl + "/spcl/ai/status", params); // 查询AI换铃开通状态
const setSpcl = (params) => axios.post(baseUrl + "/spcl/setUpSpcl", params); // 设置视频彩铃（不在个人铃音库）
const getBehaviorIdList = (params) => axios.get(baseUrl + "/spcl/userOperateIdInfo", params);// 获取用户行为列表:dz,fx,sc,bf (id数组)
const getBehaviorList = (params) => axios.get(baseUrl + "/spcl/userDetailsWithPage", params);// 获取用户行为列表:dz,fx,sc,bf (item数组)
const getAiTopic = params => axios.get(baseUrl + "/spcl/ai/aiTopic", params); // 查询所有ai换铃专题
const updateUserTopic = params => axios.post(baseUrl + "/spcl/ai/updateUserTopic", params); // 用户主题开关
const getSpclIcon = (params) => axios.get(baseUrl + "/spcl/icon", params);// 图标
const spclHotKey = (params) => axios.get(baseUrl + "/spcl/top/hotSearchTop", params);// 搜索 视频 热搜榜单
const spclSearch = (params) => axios.get(baseUrl + "/spcl/search/", params);// 搜索
const getSpclLabel = (params) => axios.get(baseUrl + "/spcl/label/", params);// 分类
const getSpclVideoDetail = (params) => axios.get(baseUrl + "/spcl/videoDetail", params);// 视频详情
const getSpclUserBehavior = (params) => axios.post(baseUrl + "/spcl/countVideoOperation", params);// 用户行为
const getSpclLabelVideoList = (params) => axios.get(baseUrl + "/spcl/label/listWithPageAndType", params);// 分类列表

export default {
  getsplykInfo,
  getsplykCurrentInfo,
  delMultiVideo,
  cancelCurPlay,
  modifySpclByIds,
  setCurrentSpcl,
  getSpclListByLabelId,
  getVideoByActivityId,
  getVideoByActivityIdPage,
  openSpcl,
  openAi,
  spclStatus,
  aiStatus,
  setSpcl,
  getBehaviorIdList,
  getBehaviorList,
  getAiTopic,
  updateUserTopic,
  getSpclIcon,
  spclHotKey,
  spclSearch,
  getSpclLabel,
  getSpclVideoDetail,
  getSpclUserBehavior,
  getSpclLabelVideoList,
};
