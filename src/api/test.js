import * as axios from "./index";
import globalData from "@/globalData.js";
const baseUrl = globalData.portalUrl;
const aiFunction = (params) => axios.get(baseUrl + "/spcl/ai/aiFunction", params); /// ai换铃业务接口
export default {
  aiFunction,
};
