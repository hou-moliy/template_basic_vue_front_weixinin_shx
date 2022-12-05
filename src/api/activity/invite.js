import * as axios from "../index.js";
import globalData from "../../globalData.js";
const activityUrl = globalData.activityUrl;
const baseUrl = globalData.portalUrl;

const windowAllList = (params) => axios.get(activityUrl + "/portal/window/all", params); // 活动所有弹窗
const activityCheck = (params) => axios.get(activityUrl + "/config/period/check", params); // 活动有效期校验
const activityInfo = (params) => axios.get(activityUrl + "/config/getInfo", params); // 活动基础信息查询
const lotteryWinner = (params) => axios.get(activityUrl + "/lottery/period/winner", params); // 中奖公告
const prizeProgress = (params) => axios.get(activityUrl + "/lotteryPrize/period/prize", params); // 活动奖品步长、邀请进度查询
const userInviteLog = (params) => axios.get(activityUrl + "/userLog/inviteLog", params); // 用户邀请记录
const userInvited = (params) => axios.post(activityUrl + "/lottery/user/invite", params); // 用户邀请好友记录
const userPrizeLogs = (params) => axios.get(activityUrl + "/winningLog/getWinLogs", params); // 用户邀请好友记录
const userPrizeReceive = (params) => axios.get(activityUrl + "/lottery/user/receive", params); // 奖品领取
const userPrizePending = (params) => axios.get(activityUrl + "/lottery/user/prize/pending", params); // 未领取奖品查询
const userOperateLog = (params) => axios.post(activityUrl + "/lottery/user/operateLog", params); // 用户进入页面记录
const lotteryUserStatus = (params) => axios.get(activityUrl + "/lottery/user/status", params); // 抽奖和黑名单用户
const getBanner = params => axios.get(baseUrl + "/ad/", params);
export default {
  windowAllList,
  activityCheck,
  activityInfo,
  lotteryWinner,
  prizeProgress,
  userInviteLog,
  userInvited,
  userPrizeReceive,
  userPrizePending,
  userOperateLog,
  lotteryUserStatus,
  userPrizeLogs,
  getBanner,
};
