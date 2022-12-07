import * as axios from "../index.js";
import globalData from "../../globalData.js";

const baseUrl = globalData.portalUrl;
const weixinUrl = globalData.weixinUrl;
const appId = globalData.appId;

const refreshToken = params => axios.get(baseUrl + "/sso/refreshToken", params);
const getWxIds = params => axios.get(`${weixinUrl}/wx/user/${appId}/login`, params);
const getLoginLn = params => axios.post(baseUrl + "/sso/login", params);
// 获取短信验证码
const getAuthCodeLn = params => axios.get(baseUrl + "/sso/getAuthCode", params);
// 微信绑定
const bindWx = params => axios.post(weixinUrl + "/wechat/bind", params);
// 微信手机号登录
const wxuserPhone = params => axios.get(`${weixinUrl}/wx/user/${appId}/phone/v2`, params);

export default {
  refreshToken,
  getWxIds,
  getLoginLn,
  getAuthCodeLn,
  bindWx,
  wxuserPhone,
};
