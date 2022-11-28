<template>
  <image
    class="floatImage"
    :src="pageConfig.url"
    :style="{ position: [extraStyle].fixed ? 'fixed' : 'absolute' }"
    :class="[extraStyle.position]"
    @click="floatClick"
  />
</template>

<script>
import { copyAttr } from "@/utils/gCopy.js";
import { navigateToAnyCheck } from "@/utils/navigateToAny.js";
export default {
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      extraStyle: {
        fixed: false, // true表示固定位置
        position: "topLeft",
      },
    };
  },
  created () {
    this.extraStyle = copyAttr(this.extraStyle, JSON.parse(this.pageConfig.extraStyle));
  },
  methods: {
    floatClick () {
      navigateToAnyCheck(this.pageConfig);
    },
  },
};
</script>

<style lang="scss" scoped>
.floatImage {
  overflow: hidden;
  z-index: 999;
  width: 103rpx;
  height: 204rpx;
  display: inline-block;
  vertical-align: top;
  background-color: black;
}
// 固定定位
.botLeft {
  left: 20rpx;
  bottom: 30rpx;
}
.botRight {
  right: 20rpx;
  bottom: 30rpx;
}
.topLeft {
  left: 20rpx;
  top: 285rpx;
}
.topRight {
  right: 20rpx;
  top: 285rpx;
}
</style>
