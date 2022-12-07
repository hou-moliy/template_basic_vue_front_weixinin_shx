import * as axios from "../index.js";
import globalData from "../../globalData.js";
const qrcode = params => axios.get(`${globalData.weixinUrl}/wx/qrcode/${globalData.appId}/`, params);
export default {
  qrcode,
};
