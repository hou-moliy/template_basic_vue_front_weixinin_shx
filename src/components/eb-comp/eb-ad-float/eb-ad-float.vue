<template>
  <image
    class="floatImage"
    :src="`${staticImgs}/lnmp/lottery_float.png`"
    :style="[position.topLeft]"
    @click="floatClick"
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
  created () { },
  methods: {
    floatClick () {
      this.$emit("floatClick");
    },
  },
};
</script>

<style lang="scss" scoped>
.floatImage {
  position: fixed;
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
