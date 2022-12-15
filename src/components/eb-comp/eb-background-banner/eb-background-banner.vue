<template>
  <view v-if="totalSwiper">
    <view
      class="ad-banner-container"
      :style="{ marginBottom: compTop ? '0rpx' : '40rpx' }"
    >
      <view :class="compTop ? `ad-banner-swiper-top` : `ad-banner-swiper`">
        <swiper
          class="ad-swiper"
          autoplay="false"
          interval="3000"
          duration="500"
          :circular="true"
          @change="changeBanner"
        >
          <swiper-item
            v-for="(item, index) in cxVideoBanner"
            :key="index"
            style="border-radius: 20rpx"
            @click="navigateToH5(item)"
          >
            <image
              class="ad-banner-image"
              :src="item.url"
              :style="{
                bottom: compTop && item.headerBgUrl ? '30rpx' : '0rpx',
                height: compTop && item.headerBgUrl ? '280rpx' : '100%',
              }"
            />
            <!-- 只有当是头部组件时才展示 -->
            <image
              v-if="compTop && item.headerBgUrl"
              class="ad-banner-bg-image"
              :src="item.headerBgUrl"
            />
          </swiper-item>
        </swiper>
        <view v-if="totalSwiper" class="indicator">
          {{ currentSwiper + "/" + totalSwiper }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import AdService from "@/api/ad/index.js";
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
    compTop: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      popTit: "温馨提示",
      loginCont: "您还没有登录，请先完成登录",
      login_confirm_content: "前往登录",
      cxVideoBanner: [],
      currentSwiper: 1,
      totalSwiper: 0,
    };
  },

  created () {
    this.getBannerByPageName();
  },

  methods: {
    getBannerByPageName () {
      const { pageName, moduleId } = this.pageConfig;
      // 获取banner
      AdService.getAdList({
        target: pageName,
        moduleId,
      }).then(res => {
        this.cxVideoBanner = res.data.data;
        this.totalSwiper = res.data.data.length;
      });
    },
    changeBanner (event) {
      this.currentSwiper = event.detail.current + 1;
    },
    navigateToH5 (event) {
      this.$analysis.dispatch("banner_count", `${this.activityId}_${event.id}`).finally(() => navigateToAnyCheck(event, `swiper_${event.id}`));
    },
  },
};
</script>

<style lang="scss" scoped>
.ad-banner-container {
  width: 100%;
}

.ad-banner-swiper-top {
  height: 580rpx;
  position: relative;
}

.ad-banner-swiper {
  // height: 350rpx;
  position: relative;
}

.ad-swiper {
  width: 100%;
  // height: 350rpx;
  text-align: center;
}

.ad-banner-swiper-top > .ad-swiper {
  width: 100%;
  height: 580rpx;
  text-align: center;
}

.indicator {
  position: absolute;
  z-index: 3;
  bottom: 46rpx;
  right: 46rpx;
  background: rgba($color: #000000, $alpha: 0.4);
  border-radius: 14px;
  padding: 4rpx 14rpx;
  color: #fff;
  font-size: 22rpx;
  line-height: 33rpx;
}

.ad-banner-image {
  height: 280rpx;
  width: 686rpx;
  display: flex;
  border-radius: 20rpx;
  position: absolute;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
}

.ad-banner-bg-image {
  width: 100%;
  height: 420rpx;
  display: flex;
}
</style>
<style>
/* .swiper-box .wx-swiper-dot */
uni-swiper .uni-swiper-dot {
  width: 10rpx !important;
  height: 10rpx !important;
}
</style>
