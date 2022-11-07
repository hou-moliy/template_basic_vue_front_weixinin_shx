<template>
  <view>
    <view class="spcl_music_icon">
      <view
        v-for="(item, index) in cxMusicIcon"
        :key="index"
        class="spcl_musi_icon-item"
        @click="navigateByEvent(item)"
      >
        <image :src="item.iconUrl" />
        <text>{{ item.iconTitle }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import ckService from "@/api/ck/ck.js";
import cxService from "@/api/cx/cx.js";
import loginService from "@/api/my/my.js";
import videoService from "@/api/cx/video.js";

import { navigateToAny } from "@/utils/tools.js";
export default {
  name: "FindBannerSwiper",

  props: {
    params: {
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
      cxMusicIcon: "",
    };
  },

  created () {
    this.getIconList();
  },
  methods: {
    getIconList () {
      // 获取icon
      const { pageName } = this.params;
      ckService
        .getCkIcon({
          target: pageName,
        })
        .then((resp) => {
          if (resp.data.code == 200 && resp.data.data.length > 0) {
            this.cxMusicIcon = resp.data.data;
          }
        });
    },
    async navigateByEvent (event) {
      const that = this;
      this.$emit("buryIconListId", event.id);
      await this.$store.dispatch("getCustomorderList", `icon_${event.id}`);
      console.log(this.$store.state.offlinePopup.loginShow);
      if (this.$store.state.offlinePopup.loginShow) {
        this.$emit("openLoginPopup");
        return;
      }
      if (this.$store.state.offlinePopup.offlineFlag) {
        return;
      }
      if (event.eventUrl.indexOf("crbtLib") > -1) {
        cxService.queryClStatus().then((res) => {
          if (res.data.code == 200 && res.data.data == 1) {
            loginService.getToken().then((resp) => {
              if (resp.data.code == 200 && resp.data.data.length > 0) {
                uni.setStorageSync("token", resp.data.data);
                if (uni.getStorageSync("token")) {
                  that.$store.commit("changeStore", true);
                  uni.navigateTo({
                    url: "/pagesCommon/webView/miguLyk?type=3",
                  });
                }
              }
            });
          } else {
            that.$emit("open", true);
          }
        });
      } else if (event.eventUrl.indexOf("vrbtLib") > -1) {
        videoService.getSpclStatus().then((res) => {
          if (
            res.data.code === 200 &&
            (res.data.data.baseAbility ||
              res.data.data.baseVip ||
              res.data.data.spclMonthly)
          ) {
            navigateToAny(event);
          } else {
            that.$emit("open", true);
          }
        });
      } else {
        navigateToAny(event);
      }
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
  height: 280rpx;
  // background: #000000;
  margin: 0 4% 0 4%;
}

.spcl_swiper {
  height: 280rpx;
  width: 686rpx;
}

.spcl_banner_image {
  height: 280rpx;
  width: 686rpx;
  display: flex;
  border-radius: 20rpx;
}

.spcl_music_icon {
  width: 100%;
  // height: 123rpx;
  padding: 58rpx auto 45rpx auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.spcl_musi_icon-item {
  // width: 86rpx;
  // height: 123rpx;
  display: flex;
  margin: 14rpx 0 0rpx 0rpx;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20%;
}

.spcl_music_icon image {
  width: 84rpx;
  height: 84rpx;
  display: block;
  // border-radius: 50%;
  flex-shrink: 0;
}

.spcl_music_icon text {
  font-size: 22rpx;
  font-family: PingFang-SC-Medium;
  color: #333333;
  text-align: center;
  font-weight: 500;
  margin-top: 18rpx;
}
</style>
<style>
/* .swiper-box .wx-swiper-dot */
uni-swiper .uni-swiper-dot {
  width: 10rpx !important;
  height: 10rpx !important;
}
</style>
