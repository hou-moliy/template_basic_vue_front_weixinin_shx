const globalData = {
  appId: process.env.VUE_APP_ID,
  // staticImgs: process.env.VUE_APP_STATIC_IMGS,
  staticImgs: "https://rcs.telinovo.com/imgs",
  // portalUrl: process.env.VUE_APP_BASE_API_PORTAL || "https://t133.ebupt.com.cn/eApi/portal-shx",
  portalUrl: process.env.VUE_APP_BASE_API_PORTAL || "https://rcs.telinovo.com/eApi/portal-shx",
  // portalUrl: process.env.VUE_APP_BASE_API_PORTAL || "http://10.4.7.239:9501/portal-shx",
  activityUrl: process.env.VUE_APP_BASE_API_ACTIVITY,
  weixinUrl: process.env.VUE_APP_BASE_API_WEIXIN || "https://rcs.telinovo.com/eApi/weixin-shx",
  // weixinUrl: process.env.VUE_APP_BASE_API_WEIXIN || "http://10.4.7.239:9502/weixin-shx",
};
console.log("当前环境：globalData", process.env);
export default globalData;
