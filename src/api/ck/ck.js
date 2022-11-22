import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;

const getCkCloum = () => axios.get(baseUrl + "/spcl/categories");
const getCkBanner = params => axios.get(baseUrl + "/ad/", params);
const getCkIcon = params => axios.get(baseUrl + "/spcl/icon", params);
const getCkToken = () => axios.get(baseUrl + "/threelogin/tyrzauth");
export default {
  getCkCloum,
  getCkBanner,
  getCkIcon,
  getCkToken,
};
