<template>
  <view class="top-img" :style="[extraStyle]">
    <image :src="pageConfig.tagIcon" />
  </view>
</template>

<script>
import { copyAttr } from "@/utils/gCopy.js";
export default {
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      extraStyle: {
        height: "480rpx",
      },
    };
  },
  created () {
    this.extraStyle = copyAttr(this.extraStyle, JSON.parse(this.pageConfig.extraStyle));
  },
};
</script>

<style lang="scss" scoped>
.top-img {
  image {
    width: 100%;
    height: 100%;
  }
}
</style>
