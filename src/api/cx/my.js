import * as axios from '../index.js';
import globalData from '../../globalData.js'
const baseUrl = globalData.portalUrl
const getMyTotal = (params) => axios.get(baseUrl+'/spcl/getMyTotal', params); //获取我的动态中最近播放、试听记录、我的点赞，喜欢的数量
const getMyRingLibrary = (params) => axios.get(baseUrl+'/spcl/icon', params); //获取我的铃音库图标、url
const getMoreWonderful = (params) => axios.get(baseUrl+'/spcl/label/withSource', params); //获取更多精彩的瀑布流
export default {
	getMyTotal,
	getMyRingLibrary,
	getMoreWonderful
}
