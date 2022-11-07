import * as axios from '../index.js';
import globalData from '../../globalData.js'
const baseUrl = globalData.portalUrl
const getLiveList = (params) => axios.get(baseUrl+'/live/source/list', params);//获取直播列表
const getLiveSourceStatus = (params) => axios.get(baseUrl+'/live/source/subUser', params);//获取用户的直播订阅状态
const subscribeLive = (params) => axios.post(baseUrl + '/live/source/sub',params); // 订阅直播
export default {
	getLiveList,
	getLiveSourceStatus,
	subscribeLive
}
