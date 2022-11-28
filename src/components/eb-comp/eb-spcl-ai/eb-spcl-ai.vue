<!--test.vue-->
<template>
  <view v-if="dataList[0].portalAd[0].url" class="spcl-ai">
    <view v-if="pageConfig.tagIcon" class="more-topic-top-img">
      <image :src="pageConfig.tagIcon" />
    </view>
    <view class="ad-banner">
      <view class="ad-banner-box">
        <image class="ad-banner-image" :src="dataList[0].portalAd[0].url" />
        <view
          v-if="!aiOpenStatus"
          class="oper-btn"
          :style="{ background: `${pageConfig.innerColor}` }"
          @click="openAiFun"
        >
          立即开启
        </view>
        <view v-else class="oper-btn oper-btn-grey" @click="openAiFun">
          已开启
        </view>
      </view>
    </view>
    <!-- 温馨提示弹窗 -->
    <ai-popup
      v-if="simplePopupFlag"
      :content="simpleContent"
      :button-type="buttonType"
      @cancel="simplePopupCancel"
      @open="openConfirm"
      @confirm="confirm"
    />
  </view>
</template>

<script>
import aiService from "@/api/ai/index.js";
import AdService from "@/api/ad/index.js";
import {
  navigateToAny,
} from "@/utils/tools.js";
export default {
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
    aiOpenStatus: {
      type: Boolean,
      default: false,
    },
    spclStatus: {
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
      simplePopupFlag: false,
      simpleContent: "",
      buttonType: "",
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
      AdService.getAdvertisement(params).then(res => {
        if (res.data.code === 200) {
          this.dataList = res.data.data;
          this.$forceUpdate();
        }
      });
    },
    async navigateToH5 (event) {
      this.$emit("buryBannerId", event.id);
      await this.$store.dispatch("getCustomorderList", `swiper_${event.id}`);
      if (this.$store.state.offlinePopup.loginShow) {
        this.$emit("openLoginPopup");
        return;
      }
      if (this.$store.state.offlinePopup.offlineFlag) {
        return;
      }
      navigateToAny(event);
    },
    openAiFun () {
      if (!uni.getStorageSync("Authorization")) {
        this.$analysis.dispatch("dj_kq");
        this.$emit("openLoginPopup");
        return;
      }
      // ai换铃业务开关接口
      if (!this.spclStatus) { // 是否开通视频彩铃业务
        this.$analysis.dispatch("dj_kq");
        this.buttonType = "open";
        this.simplePopupFlag = true;
        this.simpleContent = "AI智能换铃体验计划是辽宁移动对本省视频彩铃用户提供的专属特权服务，请您开通视频彩铃后体验!";
      } else {
        if (!this.aiOpenStatus) { // 未开启ai功能
          this.$analysis.dispatch("dj_kq");
          uni.showLoading({
            title: "操作中...",
            icon: "none",
            mask: true,
          });
          aiService.aiFunction({
            type: 2,
          }).then(res => {
            uni.hideLoading();
            if (res.data.code == 200) {
              this.$analysis.dispatch("dj_kq_cgkq");
              // this.aiOpenStatus = true
              // 父组件修改值
              this.$emit("openAiSuccessed", true);
              uni.showToast({
                title: "开启成功",
                icon: "none",
                duration: 1500,
              });
              uni.setStorageSync("aiStatus", true);
            } else {
              uni.showToast({
                title: "操作失败，请稍后再试",
                icon: "none",
                duration: 1500,
              });
            }
          }).catch(() => {
            uni.hideLoading();
          });
        } else { // 已开启ai功能
          this.$analysis.dispatch("dj_ykq");
          this.simpleContent = "您确定要关闭Ai换铃功能吗？关闭后将无法享受Ai换铃特权哦～";
          this.simplePopupFlag = true;
          this.buttonType = "confirm";
        }
      }
    },
    // 弹窗关闭
    simplePopupCancel () {
      this.$analysis.dispatch("dj_ykq_qx");
      this.simplePopupFlag = false;
    },
    // 视频彩铃弹窗弹出确认
    openConfirm () {
      this.$emit("aiEleOpenSpcl");
      this.simplePopupFlag = false;
    },
    // 换铃主题是否关闭
    confirm () {
      // uni.showLoading({
      // title: "请稍等..."
      // });
      aiService.aiFunction({
        type: 1,
      }).then(res => {
        if (res.data.code == 200) {
          this.$analysis.dispatch("dj_ykq_qr");
          this.$emit("openAiSuccessed", false);
          uni.showToast({
            title: "关闭成功",
            icon: "none",
            duration: 1500,
          });
          uni.setStorageSync("aiStatus", false);
        } else {
          uni.showToast({
            title: "操作失败，请稍后再试",
            icon: "none",
            duration: 1500,
          });
        }
        // uni.hideLoading()
        this.simplePopupFlag = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.spcl-ai {
  padding: 40rpx 0;
}
.more-topic-top-img {
  text-align: center;
  margin-bottom: 40rpx;
  image {
    width: 100%;
    height: 48rpx;
  }
}

.ad-banner {
  height: 142rpx;
}

.ad-banner-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
}

.ad-banner-image {
  width: 686rpx;
  height: 142rpx;
  border-radius: 20rpx;
}

.oper-btn {
  width: 148rpx;
  height: 58rpx;
  background: linear-gradient(90deg, #fc6e5b 0%, #ff1c7d 100%);
  border-radius: 29rpx;
  font-size: 24rpx;
  color: #ffffff;
  line-height: 58rpx;
  text-align: center;
  position: absolute;
  right: 60rpx;
  top: 40rpx;
}

.oper-btn-grey {
  background: #c6c5c8;
}
</style>
