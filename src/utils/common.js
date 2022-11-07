import analysis from "@/utils/analysis.js";
// 根据eventType跳转
export const navigateByEventType = (event, outmethod) => {
  if (!uni.getStorageSync("Authorization")) {
    return this.$refs.popup_login.open();
  }
  if (event.eventType == 1) { // 跳转h5
    outmethod();
  } else if (event.eventType == 2) { // 跳转内部
    uni.navigateTo({
      url: event.eventUrl,
      fail: function () {
        uni.switchTab({
          url: event.eventUrl,
        });
      },
    });
  }
};

// Toast提示
export const showTost = (title, icon = "none", duration = 2000) => {
  uni.showToast({
    title,
    icon,
    duration: 2000,
  });
};
export const programaAnalysis = (params, id) => {
  const {
    pageName,
    moduleId,
  } = params;
  switch (pageName) {
    case "recommend_page": // 推荐页
      analysis.dispatch("fxtj_id_id", `${moduleId}_${id}`);
      break;
    case "mgimg_page": // 咪咕图片
      analysis.dispatch("fxmgtp_id_id", `${moduleId}_${id}`);
      break;
    case "short_video_page": // 发现小视频
      analysis.dispatch("fxxsp_id_id", `${moduleId}_${id}`);
      break;
    default:
      analysis.dispatch(pageName + "_id_id", `${moduleId}_${id}`);
      break;
  }
};
