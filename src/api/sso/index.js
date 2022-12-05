import * as axios from "../index.js";
import globalData from "../../globalData.js";

const baseUrl = globalData.portalUrl;

// 统一认证token
const tyrzAuth = params => axios.get(baseUrl + "/threelogin/tyrzauth", params);

export default {
  tyrzAuth,
};
