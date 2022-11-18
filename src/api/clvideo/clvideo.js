import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;

const countFavor = () => axios.get(baseUrl + "/cl/countFavor");

const countRecent = () => axios.get(baseUrl + "/cl/countRecent");

const topicTopFour = () => axios.get(baseUrl + "/cl/topic/top4");

// 最近播放
const recentDetail = () => axios.get(baseUrl + "/cl/recentDetail");
// 我的收藏
const favorDetail = () => axios.get(baseUrl + "/cl/favorDetail");

// 点赞
const like = params => axios.post(baseUrl + "/cl/like", params);

const unlike = params => axios.post(baseUrl + "/cl/unlike", params);

// 收藏
const favor = params => axios.post(baseUrl + "/cl/favor", params);

const unFavor = params => axios.post(baseUrl + "/cl/unFavor", params);

const getVideoById = params => axios.get(baseUrl + "/cl/getVideoById", params);

// 获取小程序码
const qrcode = params => axios.get(`${globalData.weixinUrl}/wx/qrcode/${globalData.appId}/clQrcode`, params);

// 根据topicid获取视频详情
const getVideoByTopicId = params => axios.get(baseUrl + "/cl/getVideoByTopicId", params);

// 获取其他3条推荐专题
const another = params => axios.get(baseUrl + "/cl/topic/another", params);

// 记录分享
const sharenotes = params => axios.post(baseUrl + "/cl/share", params);

export default {
  countFavor,
  countRecent,
  topicTopFour,
  recentDetail,
  favorDetail,
  like,
  unlike,
  favor,
  unFavor,
  getVideoById,
  qrcode,
  getVideoByTopicId,
  another,
  sharenotes,
};
