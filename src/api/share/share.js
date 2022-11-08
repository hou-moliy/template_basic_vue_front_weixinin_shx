import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;
const qrcode = params => axios.get(`${globalData.weixinUrl}/wx/qrcode/${globalData.appId}/`, params);

const infoDetail = params => axios.get(baseUrl + "/cy/info/infoDetail", params);

export default {
  qrcode,
  infoDetail,
};
