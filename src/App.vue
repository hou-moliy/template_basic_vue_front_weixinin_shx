<template>
  <div />
</template>
<script>
export default {
  name: "App",
  onLaunch: function () {
    this.$store.dispatch("window/getCommonWindow");
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
page {
  height: 100%;
}
/*每个页面公共css */
</style>
