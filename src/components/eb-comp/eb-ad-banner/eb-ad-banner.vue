<template>
  <view
    v-if="dataList[0].portalAd[0].url"
    class="ad-banner-view"
  >
    <view
      v-if="pageConfig.tagIcon"
      class="more-topic-top-img"
    >
      <image :src="pageConfig.tagIcon" />
    </view>
    <block
      v-for="(inItem, inIndex) in dataList"
      :key="inIndex"
    >
      <swiper
        v-if="inItem.style == 5"
        class="ad-banner"
      >
        <swiper-item
          v-for="(item, index) in dataList"
          :key="index"
          @click="navigateToH5(item)"
        >
          <view class="ad-banner-box">
            <image
              class="ad-banner-image"
              :src="item.url"
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
            />
          </view>
        </view>
      </block>
    </block>
  </view>
</template>

<script>
import templateService from "@/api/template/topic.js";
import { navigateToAny } from "@/utils/tools.js";
export default {
  props: {
    pageConfig: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      popTit: "温馨提示",
      loginCont: "您还没有登录，请先完成登录",
      login_confirm_content: "前往登录",
      dataList: [],
    };
  },

  created () {
    this.getAdBanner();
  },

  methods: {
    getAdBanner () {
      const params = {
        pageName: this.pageConfig.pageName,
        code: this.pageConfig.moduleId,
      };
      console.log(params, "params");
      templateService.getAdvertisement(params).then(res => {
        if (res.data.code === 200) {
          this.dataList = res.data.data;
        }
      });
    },

    async navigateToH5 (event) {
      this.$emit("buryBannerId", event.id);
      await this.$store.dispatch("getCustomorderList", `swiper_${event.id}`);
      console.log(
        this.$store.state.offlinePopup,
        "this.$store.state.offlinePopup",
      );
      if (this.$store.state.offlinePopup.loginShow) {
        this.$emit("openLoginPopup");
        return;
      }
      if (this.$store.state.offlinePopup.offlineFlag) {
        return;
      }
      this.$analysis.dispatch("dj_clgl", event.id);
      navigateToAny(event);
    },
  },
};
</script>

<style lang="scss" scoped>
.ad-banner-view {
  padding: 30rpx 0;
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
  width: 686rpx;
  height: 142rpx;
  border-radius: 20rpx;
}
</style>
