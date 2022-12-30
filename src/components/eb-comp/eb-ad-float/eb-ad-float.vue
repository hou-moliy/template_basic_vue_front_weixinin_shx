<template>
  <image
    class="floatImage"
    :src="pageConfig.tagIcon"
    :style="{ position: extraStyle.fixed ? 'fixed' : 'absolute' }"
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
    activityId: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      extraStyle: {
        fixed: false, // true表示固定位置
        position: "left-bot",
      },
    };
  },
  created () {
    this.extraStyle = copyAttr(this.extraStyle, JSON.parse(this.pageConfig.extraStyle));
  },
  methods: {
    floatClick () {
      this.$analysis.dispatch("ad_float", this.activityId).finally(() => {
        navigateToAnyCheck(this.pageConfig, `ad_float_${this.pageConfig.id}`);
      });
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
}
// 固定定位
.left-bot {
  left: 20rpx;
  bottom: 30rpx;
}
.right-bot {
  right: 20rpx;
  bottom: 30rpx;
}
.left-top {
  left: 20rpx;
  top: 285rpx;
}
.right-top {
  right: 20rpx;
  top: 285rpx;
}
</style>
