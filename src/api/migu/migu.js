import * as axios from '../index.js';
import globalData from '../../globalData.js'
const baseUrl = globalData.portalUrl
const getsplykInfo = () => axios.get(baseUrl + '/spcl/qryAllRes'); // 查询铃音库所有内容
const getsplykCurrentInfo = () => axios.get(baseUrl + '/spcl/qrySetRes'); // 查询铃音库所有内容(收settingID)
const delMultiVideo = params => axios.post(baseUrl + '/spcl/delBatch', params); // ——批量删除闲置铃音()
const canMultiVideo = params => axios.get(baseUrl + '/spcl/cancelBatch', params); // (传当前勾选settingId)
// const moveToAvailble = params => axios.get('/spcl/moveToIdle', params) // 当前播放移动到闲置()
const modifySpcl = params => axios.post(baseUrl + '/spcl/modifySpcl', params) // ——修改当前播放（有一条数据及以上1）
const setCurrentSpcl = params => axios.post(baseUrl + '/spcl/setCurrent', params) // 新增当前播放（当前播放无数据）
const getlistById = params => axios.get(baseUrl + '/video/list', params) // 通过模块Id查询咪咕视频资源列表（包括运营位）
const countVideoOperation = params => axios.post(baseUrl + '/video/countVideoOperation', params) // 用户对视频资源点赞、分享操作进行计数并记录
const miguVideoDetail = params => axios.get(baseUrl + '/video/detail', params) // 通过模块Id查询咪咕视频详情
const moreRecommend = params => axios.get(baseUrl + '/video/more', params) // 查询咪咕视频，小视频更多推荐
export default {
	getsplykInfo,
	getsplykCurrentInfo,
	delMultiVideo,
	canMultiVideo,
	// moveToAvailble,
	modifySpcl,
	setCurrentSpcl,
	getlistById,
	countVideoOperation,
	miguVideoDetail,
	moreRecommend
}
