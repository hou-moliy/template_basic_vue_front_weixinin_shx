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
  image {
    width: 100%;
  }
}
</style>
