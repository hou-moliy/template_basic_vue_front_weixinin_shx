import store from "../store";
const videoInfoUpdate = function (list) {
  const tempList = JSON.parse(JSON.stringify(list));
  const userData = store.state.spcl.userData;
  if (
    uni.getStorageSync("Authorization") && userData && userData.vrbtResponse) {
    const isBuyList = userData.vrbtResponse;
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
