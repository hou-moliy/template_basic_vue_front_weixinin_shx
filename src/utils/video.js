import store from "../store";
// 判断是否已设为视彩
const videoInfoUpdate = function (list) {
  const tempList = JSON.parse(JSON.stringify(list));
  const userSpclData = store.state.spcl.userSpclData;
  if (
    uni.getStorageSync("Authorization") && userSpclData && userSpclData.vrbtResponse) {
    const isBuyList = userSpclData.vrbtResponse;
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
