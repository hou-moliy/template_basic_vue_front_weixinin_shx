import * as axios from '../index.js';
import globalData from '../../globalData.js';
const activityUrl = globalData.activityUrl
const baseUrl = globalData.portalUrl


const pick = params => axios.get(activityUrl + '/lottery/user/pick', params); //大转盘领奖
const helpDzp = params => axios.post(activityUrl + '/user/helpDzp', params); //大转盘助力
const doDzp = params => axios.post(activityUrl + '/task/doDzp', params); //大转盘助力
const countTask = params => axios.get(activityUrl + '/task/countTask', params); //大转盘每日邀请


const getInviteRecord = params => axios.get(activityUrl + '/user/page', params); //获取活动邀请成功+
const getHelp = params => axios.post(activityUrl + '/user/help', params); //好友助力成功+
const getCount = params => axios.get(activityUrl + '/user/count', params); //统计用户的邀请记录每天一次
const getTaskList = params => axios.get(activityUrl + '/task/listBlind', params); //获取任务列表+
const getMpStatus = params => axios.get(activityUrl + '/task/mp/status', params); //是否关注公众号+
const taskDone = params => axios.post(activityUrl + '/task/doBlind', params); //任务完成接口+
const getInfo = params => axios.get(activityUrl + '/config/info', params); //获取活动信息+
const getWinningLog = params => axios.get(activityUrl + '/lottery/user/winningLog', params); //用户中奖记录+
const getBlind = params => axios.get(activityUrl + '/lottery/blind', params); //拆盲盒+
const getChance = params => axios.get(activityUrl + '/lottery/user/chance', params); //用户抽奖次数+
const getAccept = params => axios.get(activityUrl + '/lottery/user/accept', params); //用户领奖
const activityOpen = params => axios.get(activityUrl + '/lottery/activity', params); //活动是否到期

const getInviteRecordSpring = params => axios.get(activityUrl + '/user/pageSpring', params); //新春用户邀请记录
const getHelpSpring = params => axios.post(activityUrl + '/user/helpSpring', params); //新春好友助力成功2
const getInfoSpring = params => axios.get(activityUrl + '/config/infoSpring', params); //新春查询活动的配置信息
const getVerify = params => axios.get(activityUrl + '/config/verify', params); //查询新春活动是否到期
const getWinningLogSpring = params => axios.post(activityUrl + '/lottery/user/winLogSpring', params); //新春活动用户中奖记录
const getTaskListSpring = params => axios.get(activityUrl + '/task/listSpring', params); //新春活动查询用户的任务列表信息
const taskDoneSpring = params => axios.post(activityUrl + '/task/doSpring', params); //新春活动任务完成接口

const getAwardInfo = params => axios.get(activityUrl + '/award/info', params); //查询派奖活动参与情况
const getAwardPick = params => axios.get(activityUrl + '/award/pick', params); //领取当日奖品
const getAwardQueryTemp = params => axios.get(activityUrl + '/award/queryTemp', params); //获取今日的订阅消息的模板ID
const getAwardSubscribe = params => axios.get(activityUrl + '/award/subscribe', params); //订阅
const getAwardToday = params => axios.get(activityUrl + '/award/today', params); //获取今日派送的奖品信息
const getAwardUnSubscribe = params => axios.get(activityUrl + '/award/unSubscribe', params); //取消订阅
const getChanceSpring = params => axios.get(activityUrl + '/lottery/user/chanceSpring', params); //用户抽奖次数+
const hcyauth = params => axios.get(baseUrl + '/threelogin/hcyauth', params); //用户抽奖次数+
const getAcceptSpring = params => axios.get(activityUrl + '/lottery/user/acceptSpring', params); //用户新春活动领奖


export default {
	getInviteRecord,
	getTaskList,
	getInfo,
	getMpStatus,
	taskDone,
	getWinningLog,
	getChance,
	getHelp,
	getBlind,
	getCount,
	getAccept,
	activityOpen,
	getInviteRecordSpring,
	getHelpSpring,
	getInfoSpring,
	getVerify,
	getWinningLogSpring,
	getTaskListSpring,
	taskDoneSpring,
	getAwardInfo,
	getAwardPick,
	getAwardQueryTemp,
	getAwardSubscribe,
	getAwardToday,
	getAwardUnSubscribe,
	getChanceSpring,
	hcyauth,
	getAcceptSpring,
	pick,
	helpDzp,
	doDzp,
	countTask
}
