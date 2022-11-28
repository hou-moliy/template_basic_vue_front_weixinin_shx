const globalData = {
  appId: process.env.VUE_APP_ID,
  staticImgs: process.env.VUE_APP_STATIC_IMGS,
  portalUrl: process.env.VUE_APP_BASE_API_PORTAL || "http://10.4.6.148:9501/portal",
  activityUrl: process.env.VUE_APP_BASE_API_ACTIVITY,
  weixinUrl: process.env.VUE_APP_BASE_API_WEIXIN || "http://10.4.6.148:9502/weixin",
  metaConfig: process.env.VUE_APP_META_CONFIG || "https://uj.ln139.cn/metaConfig/api",
};
console.log("当前环境：globalData", process.env);
export default globalData;

// http://10.4.6.148:9501/portal
// http://10.4.6.148:9502/weixin
