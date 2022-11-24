<template>
  <view class="top-img">
    <image
      :src="pageConfig.tagIcon"
      :style="pageConfig.extraStyle"
    />
  </view>
</template>

<script>
export default {
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      styleStr: "height:1016rpx",
    };
  },
  methods: {
    handleExtraStyle (style) {
      return JSON.parse(style);
    },
  },
};
</script>

<style lang="scss" scoped>
.top-img {
  height: 900rpx;

  image {
    width: 100%;
    // height: 1016rpx;
  }
}
</style>
