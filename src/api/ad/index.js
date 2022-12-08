// 以ad开头的相关接口放这里
import * as axios from "../index.js";
import globalData from "../../globalData";
const baseUrl = globalData.portalUrl;

const getAdvertisement = params => axios.get(baseUrl + "/ad/advertisement", params); // 获取运营位数据
const getAdvertise = params => axios.get(baseUrl + "/ad/advertise", params); // 获取轮播运营位数据
const getAdList = params => axios.get(baseUrl + "/ad/", params); // 获取广告位数据，banner、icon
export default {
  getAdvertisement,
  getAdvertise,
  getAdList,
};
