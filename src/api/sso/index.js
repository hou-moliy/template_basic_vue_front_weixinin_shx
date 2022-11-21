import * as axios from "../index.js";
import globalData from "../../globalData.js";

const baseUrlTyrz = globalData.portalTyrz;

// 统一认证token
const tyrzAuth = params => axios.get(baseUrlTyrz + "/threelogin/hcyauth", params);

export default {
  tyrzAuth,
};
