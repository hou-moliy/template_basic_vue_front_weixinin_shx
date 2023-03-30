<template>
  <view class="top-img" :style="[extraStyle]">
    <image :src="pageConfig.tagIcon" :style="[extraStyle]" mode="widthFix" />
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
        height: "",
      },
    };
  },
  created () {
    this.extraStyle = copyAttr(this.extraStyle, JSON.parse(this.pageConfig.extraStyle));
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.top-img {
  image {
    width: 100%;
    vertical-align: middle;
  }
}
</style>
