<template>
  <view class="block">
    <view class="block-box">
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
        <text>{{ pageConfig.moreTitle || "查看更多" }}</text>
        <image
          class="arrow-right"
          :src="`${staticImgs}/shxmp/init/arrow-right.png`"
          alt=""
        />
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
    activityId: {
      type: String,
      default: "",
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
        navigateToAnyCheck(this.pageConfig, `seeMore${this.pageConfig.moduleId}`);
      } else {
        uni.setStorageSync("moreData", this.pageConfig);
        const params = { ...this.pageConfig };
        const activityId = this.getUrlSingleParam("activityId", params.eventUrl) || params.eventUrl;
        this.$analysis.dispatch("more_count", activityId).finally(() => {
          // 请统一使用eventUrl字段作为跳转路径
          if (params.eventUrl && params.eventUrl.indexOf("?") > -1) {
            params.eventUrl = `${params.eventUrl}&moduleId=${params.moduleId}&pageName=${params.title}`;
          } else if (params.eventUrl && params.eventUrl.indexOf("?") < -1) {
            params.eventUrl = `${params.eventUrl}?moduleId=${params.moduleId}&pageName=${params.title}`;
          }
          console.log(params.eventUrl);
          navigateToAnyCheck(params, `seeMore${params.moduleId}`);
        });
      }
    },
    /**
  * 获取当前 URL 单个 GET 查询参数
  * 入参：要解析的 URL，不传则默认为当前 URL
  * 返回：一个<key, value>参数对象
  */
    getUrlSingleParam (key, url = location.search) {
      const reg = new RegExp("(\\?|&)" + key + "=([^&]*)(&|$)");
      const r = url.match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
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
  padding: 0rpx 34rpx;
  box-sizing: border-box;
  margin-bottom: 40rpx;

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
        font-size: 36rpx;
        color: #000000;
        font-weight: 700;
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
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 48rpx;
      color: #666666;
      padding: 0 25rpx;
      box-sizing: border-box;
      border: 1rpx solid #dcdcdc;
    }
  }
}
.arrow-right {
  width: 13rpx;
  height: 22rpx;
  margin-left: 13rpx;
}
</style>
