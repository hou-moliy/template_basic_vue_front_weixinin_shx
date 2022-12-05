const globalData = {
  appId: process.env.VUE_APP_ID,
  staticImgs: process.env.VUE_APP_STATIC_IMGS,
  portalUrl: process.env.VUE_APP_BASE_API_PORTAL || "https://rcs.telinovo.com/eApi/portal-shx",
  activityUrl: process.env.VUE_APP_BASE_API_ACTIVITY,
  weixinUrl: process.env.VUE_APP_BASE_API_WEIXIN || "https://rcs.telinovo.com/eApi/weixin-shx",
  metaConfig: process.env.VUE_APP_META_CONFIG || "https://uj.ln139.cn/metaConfig/api",
};
console.log("当前环境：globalData", process.env);
export default globalData;

// http://10.4.6.148:9501/portal
// http://10.4.6.148:9502/weixin
// http://10.4.7.239:9501/portal-shx
// https://rcs.telinovo.com/eApi/portal-shx
