<template>
  <view
    class="bsList"
    :class="{ 'no-margin': compBottom }"
    @click="bannerClickEvent(pageConfig)"
  >
    <view>
      <image
        class="bsList-image"
        :src="pageConfig.tagIcon"
        :style="[extraStyle]"
      />
    </view>
    <view v-if="pageConfig.title || pageConfig.tip" class="bsList-content">
      <view v-if="pageConfig.title" class="bsList-title">
        {{ pageConfig.title }}
      </view>
      <view v-if="pageConfig.tip" class="bsList-time">
        {{ pageConfig.tip }}
      </view>
    </view>
  </view>
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
    compBottom: { // 是否是页面最后一个
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      extraStyle: {
        height: "480rpx",
      },
    };
  },
  created () {
    console.log(this.compBottom, "ppppppppp");
    this.extraStyle = copyAttr(this.extraStyle, JSON.parse(this.pageConfig.extraStyle));
  },
  methods: {
    bannerClickEvent (item) {
      // 请统一使用eventUrl字段作为跳转路径
      this.$analysis.dispatch("business_list", `${this.activityId}_${item.moduleId}`).finally(() => navigateToAnyCheck(item, `business_list_${item.moduleId}`));
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background: #f6f6f6;
}
.no-margin {
  margin-bottom: 0rpx !important;
}
.bsList {
  margin: 0 auto;
  width: 702rpx;
  margin-bottom: 40rpx;

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
      padding: 0rpx 24rpx;
      box-sizing: border-box;

      overflow: hidden;
      white-space: normal;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      display: -webkit-box;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      word-break: break-all;
    }

    .bsList-time {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: left;
      color: #999999;
      padding: 0rpx 24rpx;
      box-sizing: border-box;
      overflow: hidden;
      white-space: normal;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      display: -webkit-box;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      word-break: break-all;
    }
  }
}
</style>
