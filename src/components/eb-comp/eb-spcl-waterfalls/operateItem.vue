<template>
  <view class="recommend-wrap">
    <image
      :src="item.url"
      @click="jump(item)"
    />
  </view>
</template>

<script>
import { navigateToAny } from "@/utils/tools.js";
export default {
  name: "OperateItem",
  props: {
    item: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {};
  },
  methods: {
    jump (item) {
      if (uni.getStorageSync("Authorization")) {
        navigateToAny(item);
      } else {
        this.$emit("openLoginPopup");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.recommend-wrap {
  height: 160rpx;
  // background: #f2f2f2;
  border-radius: 10rpx;
  margin-bottom: 25rpx;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;

  image {
    width: 334rpx;
    height: 160rpx;
    // background-color: red;
    border-radius: 10rpx;
  }
}
</style>
