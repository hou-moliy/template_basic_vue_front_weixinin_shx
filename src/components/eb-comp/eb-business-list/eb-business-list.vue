<template>
  <view
    class="bsList"
    @click="bannerClickEvent(pageConfig)"
  >
    <view>
      <image
        class="bsList-image"
        :src="pageConfig.tagIcon"
        :style="pageConfig.extraStyle"
      />
    </view>
    <view
      v-if="pageConfig.title || pageConfig.tip"
      class="bsList-content"
    >
      <view
        v-if="pageConfig.title"
        class="bsList-title"
      >
        {{ pageConfig.title }}
      </view>
      <view
        v-if="pageConfig.tip"
        class="bsList-time"
      >
        {{ pageConfig.tip }}
      </view>
    </view>
  </view>
</template>

<script>
import { navigateToAny } from "@/utils/tools.js";
export default {
  props: {
    pageConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
    };
  },
  onLoad () { },
  onShow () { },
  methods: {
    async bannerClickEvent (item) {
      console.log(item);
      // 埋点
      // programaAnalysis(this.params, item.id)
      await this.$store.dispatch(
        "getCustomorderList",
        `runAd_${item.moduleId}`,
      );
      if (this.$store.state.offlinePopup.loginShow) {
        this.$emit("openLoginPopup");
        return;
      }
      if (this.$store.state.offlinePopup.offlineFlag) {
        return;
      }
      this.$analysis.dispatch("dj_yywid", item.id);
      navigateToAny(item);
      this.$emit("bannerClickEvent", item);
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background: #f6f6f6;
}
.bsList {
  margin: 0 auto;
  padding-top: 28rpx;
  width: 702rpx;

  .bsList-image {
    border-radius: 10rpx 10rpx 0 0;
    width: 100%;
    display: inline-block;
    vertical-align: top;
  }

  .bsList-content {
    background-color: #ffffff;
    line-height: 45rpx;
    border-radius: 0 0 10rpx 10rpx;
    padding-top: 21rpx;
    box-sizing: border-box;
    padding-bottom: 19rpx;
    .bsList-title {
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: left;
      color: #333333;
      padding-left: 24rpx;
    }

    .bsList-time {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: left;
      color: #999999;
      padding-left: 24rpx;
    }
  }
}
</style>
