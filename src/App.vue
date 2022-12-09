<template>
  <div />
</template>
<script>
export default {
  name: "App",
  onLaunch: function () {
    this.$store.dispatch("window/getCommonWindow");
    this.$store.dispatch("window/getOfflineWindow");
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
// page {
//   height: 100%;
// }
/*每个页面公共css */
//设置圆角
checkbox.round .wx-checkbox-input,
checkbox.round .uni-checkbox-input {
  border-radius: 50%;
}

//设置背景色
checkbox.red[checked] .wx-checkbox-input,
checkbox.red.checked .uni-checkbox-input {
  background-color: #8b6cf0 !important;
  border-color: #8b6cf0 !important;
  color: #ffffff !important;
}
//元素使用的时候就是使用 round 和 red
</style>
