<template>
  <view class="block" :style="{ padding: blockPadding }">
    <view class="block-box" :style="{ margin, padding }">
      <view class="block-box-title">
        <view>
          <image
            v-if="pageConfig.tagIcon !== '' && extraStyle.position === 'left'"
            class="eb-icon"
            :src="pageConfig.tagIcon"
          />
        </view>
        <span :style="{ color: extraStyle.color }">{{ pageConfig.title }}</span>
        <view>
          <image
            v-if="pageConfig.tagIcon !== '' && extraStyle.position === 'right'"
            :src="pageConfig.tagIcon"
          />
        </view>
      </view>
      <view
        v-if="pageConfig.showMoreFlag"
        class="block-box-button"
        :style="{ borderRadius: extraStyle.borderRadius }"
        @click="jumpTo"
      >
        {{ pageConfig.moreTitle || "查看更多" }}
      </view>
    </view>
    <!-- 组件 -->
    <slot />
  </view>
</template>

<script>
import { navigateToAnyCheck } from "@/utils/navigateToAny.js";
import { copyAttr } from "@/utils/gCopy.js";
export default {
  components: {},
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
    // 外边距
    margin: {
      type: String,
      default: "0",
    },
    // 内边距
    padding: {
      type: String,
      default: "0",
    },
    // 内边距
    blockPadding: {
      type: String,
      default: "0rpx 34rpx",
    },
  },
  data () {
    return {
      extraStyle: {
        position: "left",
        color: "#000",
        borderRadius: "26rpx",
      },
      staticImgs: this.$staticImgs,
    };
  },
  computed: {},
  created () {
    this.extraStyle = copyAttr(this.extraStyle, JSON.parse(this.pageConfig.extraStyle));
  },
  mounted () {
  },
  methods: {
    jumpTo () {
      if (this.pageConfig.eventType === 5) {
        // eventType为5的时候表示首页swiper切换，此时eventUrl为要切换的swiper-item的pageName
        navigateToAnyCheck(this.pageConfig, `seeMore_rec_${this.pageConfig.moduleId}`);
      } else {
        uni.setStorageSync("moreData", this.pageConfig);
        const params = { ...this.pageConfig };
        // 请统一使用eventUrl字段作为跳转路径
        if (params.eventUrl.indexOf("?") > -1) {
          params.eventUrl = `${params.eventUrl}&moduleId=${params.moduleId}&pageName=${params.title}&showDirection=V`;
        } else {
          params.eventUrl = `${params.eventUrl}?moduleId=${params.moduleId}&pageName=${params.title}&showDirection=V`;
        }
        console.log(params.eventUrl);
        navigateToAnyCheck(params, `seeMore_rec_${params.moduleId}`);
      }
    },

  },
};
</script>
<style lang="scss" scoped>
.block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  &-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    &-title {
      /* margin-left: 34rpx; */
      /* text-indent: 0.3em; */
      display: flex;
      align-items: center;

      view {
        height: 100%;
        display: flex;
        align-items: center;
      }

      span {
        font-size: 40rpx;
        color: #000000;
        font-weight: 600;
      }

      image {
        width: 37rpx;
        height: 49rpx;
        margin-left: 6rpx;
        padding-bottom: 6rpx;
      }

      .eb-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 14rpx;
        margin-left: 0;
        padding-bottom: 0;
      }
    }

    &-button {
      font-size: 24rpx;
      font-family: PingFang SC Medium, PingFang SC Medium-Medium;
      font-weight: 500;
      height: 51rpx;
      color: #666666;
      line-height: 51rpx;
      padding: 0 28rpx 0 28rpx;
      border: 2rpx solid #999999;
    }
  }
}
</style>
