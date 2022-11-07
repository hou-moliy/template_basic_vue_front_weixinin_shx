/*
 * @Author: llw
 * @Date: 2021-10-19 16:06:37
 * @LastEditTime: 2021-10-19 16:49:25
 * @LastEditors: llw
 * @Description: 
 */
import * as axios from '../index.js';
import globalData from '../../globalData'
const baseUrl = globalData.portalUrl

const getAdvertisement = params => axios.get(baseUrl+'/ad/advertisement',params); //获取运营位数据
const getAdvertise = params => axios.get(baseUrl+'/ad/advertise',params); //获取轮播运营位数据

export default{
  getAdvertisement,
  getAdvertise
}