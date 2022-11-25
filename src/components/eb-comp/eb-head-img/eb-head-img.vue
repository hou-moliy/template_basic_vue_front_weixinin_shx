<template>
  <view class="top-img">
    <image
      :src="pageConfig.tagIcon"
      :style="[extraStyle]"
    />
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
  }
}
</style>
