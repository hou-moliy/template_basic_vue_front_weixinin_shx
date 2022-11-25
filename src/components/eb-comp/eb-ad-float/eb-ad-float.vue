<template>
  <image
    class="floatImage"
    :src="`${staticImgs}/lnmp/lottery_float.png`"
    :style="[position.topLeft]"
    @click="flaotClick"
  />
</template>

<script>
export default {
  props: {

  },

  data () {
    return {
      staticImgs: this.$staticImgs,
      position: {
        botLeft: {
          left: "20rpx",
          bottom: "30rpx",
        },
        botRight: {
          right: "20rpx",
          bottom: "30rpx",
        },
        topLeft: {
          left: "20rpx",
          top: "285rpx",
        },
        topRight: {
          right: "20rpx",
          top: "285rpx",
        },
      },
    };
  },
  onShow () {

  },
  methods: {
    // 返回任务
    backTotask () {
      this.$emit("flaotClick");
    },
  },
};
</script>

<style lang="scss" scoped>
// .float {
// position: fixed;
// // top: 285rpx;
// bottom: 30rpx;
// right: 20rpx;
// overflow: hidden;
// z-index: 999;
.floatImage {
  position: fixed;
  // top: 285rpx;
  bottom: 30rpx;
  right: 20rpx;
  overflow: hidden;
  z-index: 999;
  width: 103rpx;
  height: 204rpx;
  display: inline-block;
  vertical-align: top;
}
// }
</style>
