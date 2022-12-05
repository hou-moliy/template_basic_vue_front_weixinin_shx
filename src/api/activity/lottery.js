import * as axios from "../index.js";
import globalData from "../../globalData.js";
const activityUrl = globalData.activityUrl;
const listDzp = (params) => axios.get(activityUrl + "/task/listDzp", params); // 大转盘任务查询
const doDzp = (params) => axios.post(activityUrl + "/task/doDzp", params); // 大转盘助力

export default {
  listDzp,
  doDzp,
};
