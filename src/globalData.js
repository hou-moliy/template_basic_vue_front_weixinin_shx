const globalData = {
  appId: process.env.VUE_APP_ID,
  staticImgs: process.env.VUE_APP_STATIC_IMGS,
  portalUrl: process.env.VUE_APP_BASE_API_PORTAL || "https://t133.ebupt.com.cn/eApi/portal-shx",
  activityUrl: process.env.VUE_APP_BASE_API_ACTIVITY,
  weixinUrl: process.env.VUE_APP_BASE_API_WEIXIN || "https://t133.ebupt.com.cn/eApi/weixin-shx",
};
console.log("当前环境：globalData", process.env);
export default globalData;
