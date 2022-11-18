<template>
  <view>
    <!-- header -->
    <view class="header-ai">
      <image
        class="header-ai-image"
        :src="`${staticImgs}/shxmp/init/ai_bg.png`"
      />
    </view>

    <!-- 介绍 -->
    <view class="introduce">
      <view class="introduce-title">
        AI换铃计划
      </view>
      <view class="introduce-content">
        AI换铃是陕西移动为视频彩铃会员研发的一款智能换铃黑科技，根据用户喜好定时更换高质量的视频彩铃，让每一秒通话等待与众不同！
      </view>
      <view class="introduce-subcontent">
        您可自定义选择视频彩铃的主题，彩铃管家会为您在主题周期更换您选择的主题最近播放量最高的免费视频彩铃。
        注意：开启AI换铃计划后，新的视频彩铃将会自动设置为“当前播放”，您之前的彩铃将会放置到“闲置彩铃”里。
      </view>
      <view
        class="introduce-button"
        :style="{background:aiStatus?'#e9e9e9':''}"
        @click="aiOpenChange"
      >
        <view
          v-if="!aiStatus"
          class="introduce-button-open"
        >
          立即开启
        </view>
        <view
          v-if="!aiStatus"
          class="introduce-button-price"
        >
          体验资费0元
        </view>
        <view
          v-else="aiStatus"
          class="introduce-button-opened"
        >
          已开启
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "AiPage",
  data () {
    return {
      staticImgs: this.$staticImgs,
      aiStatus: false,
    };
  },
  methods: {
    aiOpenChange () {
      /*
      // ai换铃业务开关接口
      if (!this.spclStatus) { // 是否开通视频彩铃业务
        this.buttonType = "open";
        this.simplePopupFlag = true;
        this.simpleContent = "AI智能换铃体验计划是辽宁移动对本省视频彩铃用户提供的专属特权服务，请您开通视频彩铃后体验!";
      } else {
        if (!this.aiStatus) { // 未开启ai功能
          aiService.aiFunction({
            type: 2,
          }).then(res => {
            if (res.data.code == 200) {
              this.$analysis.dispatch("aihl_kq");
              this.aiStatus = true;
              uni.showToast({
                title: "开启成功",
                icon: "none",
                duration: 1500,
              });
              uni.setStorageSync("aiStatus", true);
              this.getAiTopic();
            } else {
              uni.showToast({
                title: "操作失败，请稍后再试",
                icon: "none",
                duration: 1500,
              });
            }
          });
        } else { // 已开启ai功能
          this.simpleContent = "您确定要关闭Ai换铃功能吗？关闭后将无法享受Ai换铃特权哦～";
          this.simplePopupFlag = true;
          this.buttonType = "confirm";
        }
      }
      */
    },
  },
};
</script>

<style lang="scss" scoped>
.header-ai {
  .header-ai-image {
    display: inline-block;
    width: 100%;
    height: 801rpx;
    vertical-align: top;
  }
}
.introduce {
  position: absolute;
  top: 368rpx;
  left: 50%;
  transform: translate(-50%, 0rpx);
  width: 686rpx;
  height: 674rpx;
  margin: 0 auto;
  border-radius: 20rpx;
  box-shadow: 0px 0px 22rpx 2rpx rgba(32, 32, 32, 0.11);
  background: #ffffff;
  padding-left: 38rpx;
  padding-right: 38rpx;
  box-sizing: border-box;

  .introduce-title {
    height: 100rpx;
    font-size: 36rpx;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    text-align: center;
    color: #333333;
    line-height: 100rpx;
    border-bottom: 1rpx solid #e5e5e5;
  }

  .introduce-content {
    text-indent: 26rpx;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 400;
    text-align: left;
    color: #666666;
    margin: 32rpx 0 40rpx 0;
    line-height: 40rpx;
  }
  .introduce-subcontent{
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 400;
    text-align: left;
    color: #666666;
    margin: 32rpx 0 40rpx 0;
    line-height: 40rpx;
  }

  .introduce-button {
    width: 428rpx;
    height: 88rpx;
    border-radius: 44rpx;
    margin: 0 auto;
    background: linear-gradient(90deg, #ff704f 0%, #ff008c 100%);
    display: flex;
    flex-direction: column;
    // justify-content: space-around;
    justify-content: center;
    padding: 6rpx 0rpx;
    box-sizing: border-box;

    .introduce-button-open {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-align: center;
      color: #ffffff;
      line-height: 35rpx;
    }

    .introduce-button-opened {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: center;
      color: #999999;
    }

    .introduce-button-price {
      font-size: 22rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: center;
      color: #ffec9f;
      line-height: 25rpx;
      padding-top: 8rpx;
    }
  }
}
</style>
