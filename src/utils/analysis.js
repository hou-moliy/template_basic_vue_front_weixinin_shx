import analysis from "@/api/analysis/analysis.js";

const uuid = () => {
  return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c == "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 采集自定义事件类型
const dispatch = (eventId, extraInfo) => {
  let param = getParams();
  param = {
    ...param,
    eventId,
    extraInfo,
  };
  analysis.send(param);
};
// 采集活动id，用于区分是哪个活动的事件
const setActivityId = (activityId) => {
  uni.setStorageSync("analysis_activityId", activityId);
};
const setChannel = (channel) => {
  uni.setStorageSync("analysis_channel", channel);
};

const getParams = () => {
  const activityId = uni.getStorageSync("analysis_activityId");
  const channel = uni.getStorageSync("analysis_channel");
  // eslint-disable-next-line no-undef
  const currentPages = getCurrentPages();
  return {
    activityId,
    channel,
    currentUrl: currentPages.length > 0 ? currentPages[currentPages.length - 1].route : "",
    sourceUrl: currentPages[currentPages.length - 2] ? currentPages[currentPages.length - 2].route : "",
  };
};

export default {
  uuid,
  dispatch,
  setActivityId,
  setChannel,
  getParams,
};
