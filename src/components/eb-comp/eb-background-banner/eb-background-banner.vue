<template>
  <view>
    <view class="spcl_music_banner">
      <view class="spcl_banner-swiper">
        <swiper
          class="spcl_swiper"
          autoplay="true"
          interval="3000"
          duration="500"
          :circular="true"
          @change="changebanner"
        >
          <swiper-item
            v-for="(item, index) in cxVideoBanner"
            :key="index"
            style="border-radius: 20rpx"
            @click="navigateToH5(item)"
          >
            <image
              class="spcl_banner_image"
              :src="item.url"
            />
            <image
              class="spcl_banner_bg_image"
              :src="item.headerBgUrl"
            />
          </swiper-item>
        </swiper>
        <view
          v-if="totalSwiper"
          class="indicator"
        >
          {{ currentSwiper + "/" + totalSwiper }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import tabAndbannerService from "@/api/find/tabAndbanner.js";
import { navigateToAny } from "@/utils/tools.js";
export default {
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
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
      const { pageName } = this.pageConfig;
      // 获取bannner
      tabAndbannerService
        .getBanner({
          target: pageName,
        })
        .then(res => {
          this.cxVideoBanner = res.data.data;
          this.totalSwiper = res.data.data.length;
          // this.$emit('changeBanner', this.cxVideoBanner[0])
        });
    },

    changebanner (event) {
      this.currentSwiper = event.detail.current + 1;
      // this.$emit('changeBanner', this.cxVideoBanner[event.detail.current])
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
      navigateToAny(event);
    },
  },
};
</script>

<style lang="scss" scoped>
.spcl_music_banner {
  width: 100%;
  // height: 381rpx;
  // background: linear-gradient(#ff6f50, #ff6f50, white);
}

.spcl_banner-swiper {
  // width: 92%;
  height: 580rpx;
  position: relative;
}

.spcl_swiper {
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

.spcl_banner_image {
  height: 280rpx;
  width: 686rpx;
  display: flex;
  border-radius: 20rpx;
  position: absolute;
  bottom: 30rpx;
  left: 50%;
  // box-shadow: 1px 9px 16px 0px rgba(6, 0, 1, 0.12);
  transform: translateX(-50%);
}

.spcl_banner_bg_image {
  width: 100%;
  height: 463rpx;
  display: flex;
}

.spcl_music_icon {
  width: 88%;
  // height: 123rpx;
  margin: 88rpx 6% 47rpx 6%;
  display: flex;
  justify-content: space-between;
}

.spcl_musi_icon-item {
  // width: 86rpx;
  // height: 123rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spcl_music_icon image {
  width: 84rpx;
  height: 84rpx;
  display: block;
  border-radius: 50%;
  flex-shrink: 0;
}

.spcl_music_icon text {
  font-size: 22rpx;
  // line-height: 36rpx;
  font-family: PingFang-SC-Medium;
  color: #333333;
  text-align: center;
  font-weight: 500;
  margin-top: 30rpx;
}
</style>
<style>
/* .swiper-box .wx-swiper-dot */
uni-swiper .uni-swiper-dot {
  width: 10rpx !important;
  height: 10rpx !important;
}
</style>
