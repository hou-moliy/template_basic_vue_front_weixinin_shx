// 以wx开头的相关接口放这里
import * as axios from "../index.js";
import globalData from "../../globalData.js";
const weixinUrl = globalData.weixinUrl;
const appId = globalData.appId;
const getWxIds = params => axios.get(`${weixinUrl}/wx/user/${appId}/login`, params);
// 微信绑定
const bindWx = params => axios.post(weixinUrl + "/wechat/bind", params);
// 微信手机号登录
const wxuserPhone = params => axios.get(`${weixinUrl}/wx/user/${appId}/phone/v2`, params);
// 获取微信二维码
const qrcode = params => axios.get(`${globalData.weixinUrl}/wx/qrcode/${globalData.appId}/`, params);

export default {
  getWxIds,
  bindWx,
  wxuserPhone,
  qrcode,
};
