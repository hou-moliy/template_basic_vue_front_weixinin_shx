import * as axios from '../index.js';
import globalData from '../../globalData.js';
const baseUrl=globalData.portalUrl

const send = params =>axios.post(baseUrl+'/analysis/',params);
const channelRecord=params=>axios.post(baseUrl+'/channel/record/',params)
const getOrderLog=params=>axios.post(baseUrl+'/ln/orderLog/uploadLog',params)//获取订购日志

export default{
	send,
	channelRecord,
	getOrderLog
}