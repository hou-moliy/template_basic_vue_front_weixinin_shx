import SsoService from "@/api/sso";
import store from "../store";
import { log } from "./QS-SharePoster/app";
// 跳转-需要统一验证、登录、下线弹窗的
const navigateToAnyCheck = async (item, targetId, callback = () => { }) => {
  uni.showLoading({
    title: "",
    mask: true,
  });
  await store.dispatch("offlinePopup/getCustomorderList", targetId).then(() => {
    // 配置了策略
    if (store.state.offlinePopup.loginShow) {
      return uni.$emit("openLoginPopup", { msg: "展示登录弹窗" });
    }
    if (store.state.offlinePopup.offlineFlag) { // 展示线下弹窗
      return;
    }
    navigateToAny(item, callback);
  }).catch(() => {
    // 未配置策略
    if (!uni.getStorageSync("Authorization")) {
      return uni.$emit("openLoginPopup", { msg: "展示登录弹窗" });
    }
    navigateToAny(item, callback);
  });
  uni.hideLoading();
};
// 跳转-不需要统一验证、登录、升级弹窗的
const navigateToAny = (item, callback) => {
  console.log("跳转");
  uni.showLoading({
    title: "",
    mask: true,
  });
  try {
    switch (item.eventType) {
      case 1:
        // 1-跳转外部url
        handleExternalLink(item, callback);
        break;
      case 2:
        // 2-跳转自身小程序内地址
        handleInternalLink(item, callback);
        break;
      case 4:
        // 4-跳转外部小程序
        handleExternalProgram(item, callback);
        break;
      case 5:
        handleFaXianPage(item, callback);
        break;
      default:
        uni.hideLoading();
    }
  } catch (error) {
    uni.hideLoading();
  }
};
//  处理外部跳转
const handleExternalLink = async (item, callback) => {
  let tempEventUrl = item.eventUrl;
  tempEventUrl = await freeLoginFun(item.eventUrl);
  console.log(tempEventUrl, "tempEventUrl");
  uni.setStorageSync("ckH5Data", tempEventUrl);
  uni.hideLoading();
  uni.navigateTo({
    url: "/pagesCommon/webView/ckWebview",
  });
};

const handleInternalLink = (item, callback) => {
  uni.hideLoading();
  uni.navigateTo({
    url: item.eventUrl,
    fail: function () {
      uni.switchTab({
        url: item.eventUrl,
      });
    },
  });
};

// 处理跳转外部小程序
const handleExternalProgram = async (item, callback) => {
  let tempEventUrl = item.eventUrl;
  tempEventUrl = await freeLoginFun(item.eventUrl);
  uni.hideLoading();
  wx.navigateToMiniProgram({
    appId: item.outAppId || item.appId || item.appid,
    path: tempEventUrl,
    extraData: {},
    envVersion: "release",
    success (res) {
      if (callback) {
        callback();
      }
    },
  });
};

// 处理跳转小程序发现页面
const handleFaXianPage = (item, callback) => {
  // 判断当前页面所在位置：
  // eslint-disable-next-line no-undef
  const currentPages = getCurrentPages();
  if (currentPages.length > 0) {
    const currentRouter = currentPages[currentPages.length - 1].route;
    if (currentRouter.indexOf("liaoNingFind/views/index") > -1) {
      uni.hideLoading();
      uni.$emit("changeTabByMore", item.eventUrl);
      return;
    }
  }
  // 判断下当前页面地址，是否为fxPageName
  uni.setStorageSync("fxPageName", item.eventUrl);
  uni.hideLoading();
  uni.switchTab({
    url: "/pages/liaoNingFind/views/index",
  });
};

// 免登地址处理
const freeLoginFun = (eventUrl) => {
  // let tempUrl = eventUrl;
  let tempUrl = "https://m.music.migu.cn/v4/mg?ch=014092P&token=ANDT$token{tyrz_token} ";
  // https://g.migufun.com/yquayu/-$token{tyrz_token}
  return new Promise(function (resolve, reject) {
    let tokenStr = tempUrl.match(/\$token\{.*?\}/);
    if (tokenStr) {
      if (!uni.getStorageSync("Authorization")) {
        tempUrl = tempUrl.replace(/\$token\{.*?\}/g, "");
        resolve(tempUrl);
        return;
      }
      tokenStr = tokenStr[0];
    } else {
      resolve(tempUrl);
      return;
    }
    tokenStr = tokenStr.replace(/\$token\{/, "");
    tokenStr = tokenStr.replace(/\}/, "");
    const tokenArr = tokenStr.split("_");
    if (tokenArr[0] === "tyrz") {
      SsoService
        .tyrzAuth({
          channel: tokenArr[1],
        })
        .then((res) => {
          if (res.data.code === 200) {
            tempUrl = tempUrl.replace(
              /\$token\{.*?\}/g,
              res.data.data.artifact,
            );
            tempUrl = tempUrl.replace(
              /\$account\{.*?}/g,
              res.data.data.account,
            );
          }
          resolve(tempUrl);
        })
        .catch((err) => {
          resolve(tempUrl, err);
        });
    } else {
      resolve(tempUrl);
    }
  });
};

module.exports = {
  navigateToAny,
  navigateToAnyCheck,
};
