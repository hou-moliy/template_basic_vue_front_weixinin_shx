const globalData = {
  appId: process.env.VUE_APP_ID,
  staticImgs: process.env.VUE_APP_STATIC_IMGS,
  portalUrl: process.env.VUE_APP_BASE_API_PORTAL || "https://rcs.telinovo.com/portalTest",
  activityUrl: process.env.VUE_APP_BASE_API_ACTIVITY,
  weixinUrl: process.env.VUE_APP_BASE_API_WEIXIN || "http://10.4.7.249:9502/weixin",
  metaConfig: process.env.VUE_APP_META_CONFIG || "https://uj.ln139.cn/metaConfig/api",
};
console.log("当前环境：globalData", process.env);
export default globalData;
