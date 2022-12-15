<template>
  <view class="top-img">
    <image :src="pageConfig.tagIcon" :style="[extraStyle]" />
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
    activityId: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      extraStyle: {
        height: "900rpx",
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
  }
}
</style>
