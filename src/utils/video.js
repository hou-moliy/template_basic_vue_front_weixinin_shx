
const videoInfoUpdate = function (list) {
  const tempList = JSON.parse(JSON.stringify(list));
  if (
    uni.getStorageSync("Authorization") &&
    uni.getStorageSync("userData")[0] &&
    uni.getStorageSync("userData")[0].vrbtResponse
  ) {
    const isBuyList = uni.getStorageSync("userData")[0].vrbtResponse;
    for (let i = 0; i < tempList.length; i++) {
      const isBuy = isBuyList.filter(
        (item) => tempList[i].ringId === item.ringId,
      );
      if (isBuy[0]) {
        tempList[i].isBuyVideo = true;
      }
    }
  } else {
    for (let i = 0; i < tempList.length; i++) {
      tempList[i].isBuyVideo = false;
    }
  }
  return tempList;
};

module.exports = {
  videoInfoUpdate,
};
