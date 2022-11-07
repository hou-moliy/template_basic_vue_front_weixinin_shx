import * as axios from '../index.js';
import globalData from '../../globalData.js'

const baseUrl = globalData.portalUrl;
const baseUrlTyrz = globalData.portalTyrz;
const weixinUrl = globalData.weixinUrl;
const appId = globalData.appId;

const emailLogin = () => axios.get(baseUrl+'/threelogin/mailauth');
const getLoginMethods = () => axios.get(baseUrl+'/method/list');
const hgLogin = (params) => axios.get(baseUrl+'/threelogin/hgauth',params);
const getToken =  () => axios.get(baseUrl+'/sso/token');//第三方Token
const diyLogin = (params) => axios.get(baseUrl+'/threelogin/ktxauth',params);
const refreshToken = params =>axios.get(baseUrl+'/sso/refreshToken',params);
const getMyTotal = params =>axios.get(baseUrl+'/spcl/getMyTotal',params);
const getGuide = params =>axios.get(baseUrl+'/guide/',params);
const getAuthInfo = params => axios.get(weixinUrl + '/wechat/authInfo', params);
const getWxIds = params => axios.get(`${weixinUrl}/wx/user/${appId}/login`, params);
const getLoginLn  = params => axios.post(baseUrl+'/sso/loginLn',params);
// 请求用户认证结果
const qryUserAuthInfo2Login  = params => axios.post(baseUrl+'/SIMAuth/qryUserAuthInfo2Login',params);
// 发送模板消息
const sendAuthMsg  = params => axios.post(baseUrl+'/SIMAuth/sendAuthMsg',params);
// 获取协议内容接口
const getAgreementDetails = params => axios.get(baseUrl+'/window/agreement/detail',params);
// 判断是否是非号段
const judgeTargetPhone = params => axios.post(baseUrl+'/sso/isTargetPhone',params);
// 统一认证token
const freeLoginAuth = params => axios.get(baseUrlTyrz + '/threelogin/hcyauth', params);

// 辽友会会员信息查询
const lyhGetUserInfo = params => axios.get(baseUrl+'/lyh/getUserInfo',params);

export default {
	emailLogin,
	getToken,
	diyLogin,
	hgLogin,
	refreshToken,
	getMyTotal,
	getGuide,
	getAuthInfo,
	getLoginMethods,
	getWxIds,
	getLoginLn,
	qryUserAuthInfo2Login,
	sendAuthMsg,
	getAgreementDetails,
	judgeTargetPhone,
	freeLoginAuth,
	lyhGetUserInfo

}
