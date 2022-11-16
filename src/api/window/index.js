import * as axios from '../index.js';
import globalData from '../../globalData.js'
const baseUrl = globalData.portalUrl
const pageStatuslUrl = globalData.metaConfig

const getPageStatus = params => {

  // 获取当前帐号信息
  const accountInfo = wx.getAccountInfoSync();

  // env类型
  const envVersion = accountInfo.miniProgram.envVersion;
  console.log('version-', envVersion);
  if (envVersion === 'develop' || envVersion === 'trial') {
    params.targetId = "test_" + params.targetId;
  }
  return axios.get(pageStatuslUrl + '/pageStatus/', params)
}
const getWindowList = params => axios.get(baseUrl + '/window/list', params); // 查弹窗接口
export default {
  getWindowList,
  getPageStatus

}
