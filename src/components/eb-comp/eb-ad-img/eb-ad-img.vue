<template>
  <view
    v-if="dataList[0] && dataList[0].portalAd[0].url"
    class="ad-banner-view"
  >
    <view v-if="pageConfig.tagIcon" class="more-topic-top-img">
      <image :src="pageConfig.tagIcon" :style="[extraStyle]" />
    </view>
    <block v-for="(inItem, inIndex) in dataList" :key="inIndex">
      <swiper v-if="inItem.style == 5" class="ad-banner">
        <swiper-item
          v-for="(item, index) in inItem.portalAd"
          :key="index"
          @click="navigateToH5(item)"
        >
          <view class="ad-banner-box">
            <image
              class="ad-banner-image"
              :src="item.url"
              :style="[extraStyle]"
            />
          </view>
        </swiper-item>
      </swiper>
      <block v-if="inItem.style == 1">
        <view
          v-for="(contenItem, contentIndex) in inItem.portalAd"
          :key="contentIndex"
          class="ad-banner"
          @click="navigateToH5(contenItem)"
        >
          <view class="ad-banner-box">
            <image
              class="ad-banner-image"
              :src="contenItem.url"
              :style="[extraStyle]"
            />
          </view>
        </view>
      </block>
    </block>
  </view>
</template>

<script>
import AdService from "@/api/ad/index.js";
import { navigateToAnyCheck } from "@/utils/navigateToAny.js";
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
      staticImgs: this.$staticImgs,
      popTit: "温馨提示",
      loginCont: "您还没有登录，请先完成登录",
      login_confirm_content: "前往登录",
      dataList: [],
      extraStyle: {
        height: "142rpx",
      },
    };
  },

  created () {
    this.extraStyle = copyAttr(this.extraStyle, JSON.parse(this.pageConfig.extraStyle));
    this.getAdBanner();
  },

  methods: {
    getAdBanner () {
      const params = {
        pageName: this.pageConfig.pageName,
        code: this.pageConfig.moduleId,
      };
      AdService.getAdvertisement(params).then(res => {
        if (res.data.code === 200) {
          this.dataList = res.data.data;
        }
      });
    },
    navigateToH5 (event) {
      if (event.eventUrl === "/pagesSpcl/clVideo/clVideoSearch") { // 视频搜索埋点
        this.$analysis.dispatch("video_search_count", this.activityId).finally(() => navigateToAnyCheck(event, `swiper_${event.id}`));
      } else {
        this.$analysis.dispatch("ad_img", `${this.activityId}_${event.id}`).finally(() => navigateToAnyCheck(event, `swiper_${event.id}`));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ad-banner-view {
  padding: 0rpx 34rpx;
  box-sizing: border-box;
  margin-bottom: 40rpx;
}
.more-topic-top-img {
  text-align: center;
  margin-bottom: 40rpx;

  image {
    width: 100%;
    height: 48rpx;
  }
}

.ad-banner-box {
  width: 100%;
  display: flex;
  justify-content: center;
}

.ad-banner-image {
  // width: 686rpx;
  // height: 142rpx;
  width: 100%;
  border-radius: 20rpx;
}
</style>
