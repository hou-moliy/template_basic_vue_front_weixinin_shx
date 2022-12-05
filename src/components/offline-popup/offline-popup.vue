<template>
  <view class="mask" @touchmove.stop.prevent="() => {}">
    <view :class="flag ? 'offline' : 'offlineClose'">
      <image
        class="offline_popup_image"
        :src="`${staticImgs}/lnmp/offlinePop/offlinePopup.png`"
        mode=""
      />
      <view class="offline_title">
        <view>
          {{ pageDownDialog.windowTitle || "温馨提示" }}
        </view>
      </view>
      <view class="offline_content">
        <view class="offline_content_text">
          {{
            pageDownDialog.windowDesc ||
            "尊敬的客户，您好，小程序正在升级中，部分功能暂时不可用，请您谅解~"
          }}
        </view>
        <view v-if="strategyType == '2'" class="offline_content_time">
          预计恢复时间：
          <text>{{ endTime }}</text>
        </view>
      </view>
      <view v-if="dialogCancellable == '1'" class="offline_button">
        <view class="offline_button_cancel" @click="cancel">
          {{ pageDownDialog.buttonName || "我知道了" }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      flag: true,
      staticImgs: this.$staticImgs,
    };
  },
  computed: {
    strategyType () {
      return this.$store.state.offlinePopup.strategyType;
    },
    endTime () {
      return this.$store.state.offlinePopup.endTime;
    },
    dialogCancellable () {
      return this.$store.state.offlinePopup.dialogCancellable;
    },
    pageDownDialog () {
      return uni.getStorageSync("pageDownDialog")[0];
    },
  },
  mounted () { },
  methods: {
    cancel () {
      this.flag = false;
      this.$store.commit("offlinePopup/SET_OFFLINEPOPUPSHOW", false);
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes offlineShow {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.75);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes offlineClose {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.75);
  }
}
.offline {
  width: 560rpx;
  z-index: 5;
  background: #ffffff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20rpx;
  animation: offlineShow 0.25s 1;
  -moz-animation: offlineShow 0.25s 1;
  /* Firefox */
  -webkit-animation: offlineShow 0.25s 1;
  /* Safari 和 Chrome */
  -o-animation: offlineShow 0.25s 1;
  /* Opera */
}
.offlineClose {
  width: 560rpx;
  z-index: 5;
  background: #ffffff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20rpx;
  animation: offlineClose 0.25s 1;
  -moz-animation: offlineClose 0.25s 1;
  /* Firefox */
  -webkit-animation: offlineClose 0.25s 1;
  /* Safari 和 Chrome */
  -o-animation: offlineClose 0.25s 1;
  /* Opera */
}

.offline_title {
  text-align: center;
  padding-top: 215rpx;
  font-size: 36rpx;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  text-align: center;
  color: #333333;
  line-height: 36rpx;
}
.offline_popup_image {
  width: 100%;
  height: 426rpx;
  position: absolute;
  top: -105rpx;
  left: 0;
  z-index: -1;
}
.offline_content {
  display: flex;
  justify-content: center;
  padding-bottom: 40rpx;
  flex-direction: column;
  .offline_content_text {
    width: 443rpx;
    margin: 0rpx auto;
    margin-top: 30rpx;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: #999999;
    line-height: 38rpx;
  }
  .offline_content_time {
    width: 443rpx;
    margin: 0rpx auto;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: #999999;
    line-height: 38rpx;
    color: #ff6f50;
  }
}
.offline_button {
  display: flex;
  justify-content: center;
  width: 100%;

  .offline_button_cancel {
    width: 380rpx;
    height: 84rpx;
    border-radius: 42rpx;
    line-height: 84rpx;
    box-sizing: border-box;
    font-size: 30rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: white;
    background-image: linear-gradient(to right, #ff6f50, #ff008c);
    margin-bottom: 52rpx;
  }
}

.mask {
  position: fixed;
  top: 0rpx;
  bottom: 0rpx;
  left: 0rpx;
  right: 0rpx;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 4;
}
</style>
