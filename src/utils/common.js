// 根据eventType跳转
export const navigateByEventType = (event, outmethod) => {
  if (!uni.getStorageSync("Authorization")) {
    return this.$refs.popup_login.open();
  }
  if (event.eventType === 1) { // 跳转h5
    outmethod();
  } else if (event.eventType === 2) { // 跳转内部
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
export const showToast = (title, duration = 2000, icon = "none") => {
  uni.showToast({
    title,
    icon,
    duration,
  });
};

// Loading
export const showLoading = (title, mask = true, duration = 2000, callback = () => { }) => {
  uni.showLoading({
    title,
    mask,
  });
  if (duration) {
    setTimeout(() => {
      uni.hideLoading();
      callback();
    }, duration);
  }
};
export const programaAnalysis = (params, id) => {
  // 埋点暂时未写
};
