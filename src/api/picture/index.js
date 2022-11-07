/*
 * @Author: llw
 * @Date: 2021-10-20 17:20:58
 * @LastEditTime: 2021-10-25 14:54:57
 * @LastEditors: llw
 * @Description: 
 */
import * as axios from '../index.js';
import globalData from '../../globalData'
const baseUrl = globalData.portalUrl

const getPictureList = params => axios.get(baseUrl+'/picture/source/random',params); //获取咪咕图片数据
const getPictureListBlcok = params => axios.get(baseUrl+'/picture/source/list',params); //获取咪咕图片数据
const addShareCount = params => axios.post(baseUrl + '/picture/source/operate', params); //分享

export default {
  getPictureList,
  getPictureListBlcok,
  addShareCount
}