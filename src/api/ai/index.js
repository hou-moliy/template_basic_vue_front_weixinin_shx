import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const aiFunction = (params) => axios.get(baseUrl + "/spcl/ai/aiFunction", params); /// ai换铃业务接口
const getAiTopic = params => axios.get(baseUrl + "/spcl/ai/aiTopic", params); // 查询所有ai换铃专题
const checkPortalUser = () => axios.get(baseUrl + "/spcl/ai/status"); // 查询用户是否开通ai换铃
const updateUserTopic = params => axios.post(baseUrl + "/spcl/ai/updateUserTopic", params); // 用户主题开关
export default {
  aiFunction,
  getAiTopic,
  checkPortalUser,
  updateUserTopic,
};
