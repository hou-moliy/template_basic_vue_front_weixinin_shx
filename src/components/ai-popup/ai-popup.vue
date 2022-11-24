<template>
  <view>
    <view class="simple-popup">
      <view class="simple-popup-header">
        <view class="simple-popup-header-title">
          温馨提示
        </view>
      </view>
      <view class="simple-popup-content">
        {{ content }}
      </view>
      <view class="simple-popup-button">
        <view
          class="simple-popup-button-cancel"
          @click="cancel"
        >
          取消
        </view>
        <view
          v-if="buttonType=='open'"
          class="simple-popup-button-confirm"
          @click="open"
        >
          立即开通
        </view>
        <view
          v-else-if="buttonType=='confirm'"
          class="simple-popup-button-confirm"
          @click="confirm"
        >
          确认
        </view>
      </view>
    </view>
    <view class="mask" />
  </view>
</template>

<script>
/*
  buttonType-确定按钮的类型:open-立即关注、confirm-确定
  */
export default {
  props: {
    content: {
      type: String,
      default: "",
    },
    buttonType: {
      type: String,
      default: "",
    },

  },
  data () {
    return {
      staticImgs: this.$staticImgs,
    };
  },
  methods: {
    cancel () {
      this.$emit("cancel");
    },
    confirm () {
      this.$emit("confirm");
    },
    open () {
      this.$emit("open");
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-popup {
  width: 560rpx;
  z-index: 6;
  background: #ffffff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20rpx;

  .simple-popup-header {
    position: relative;
    margin: 0 auto;
    width: 100%;

    .simple-popup-header-title {
      font-size: 36rpx;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-align: center;
      color: #333333;
      padding-top: 50rpx;
      box-sizing: border-box;
    }

    .simple-popup-header-image {
      position: absolute;
      width: 194rpx;
      height: 205rpx;
      display: inline-block;
      vertical-align: top;
      left: 183rpx;
      top: -103rpx;
      z-index: 5;
    }
  }

  .simple-popup-content {
    padding-top: 27rpx;
    box-sizing: border-box;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: #999999;
    width: 462rpx;
    margin: 0 auto;
  }

  .simple-popup-button {
    margin-top: 38rpx;
    display: flex;
    width: 100%;
    justify-content: space-between;
    height: 99rpx;

    .simple-popup-button-cancel {
      width: 50%;
      box-sizing: border-box;
      border-top: 1rpx solid #e5e5e5;
      border-right: 1rpx solid #e5e5e5;
      font-size: 34rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: center;
      color: #666666;
      line-height: 91rpx;
    }

    .simple-popup-button-confirm {
      width: 50%;
      box-sizing: border-box;
      border-top: 1rpx solid #e5e5e5;
      font-size: 34rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 700;
      text-align: center;
      background-image: -webkit-linear-gradient(
        right,
        #ff008c 10%,
        #ff6f50 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 91rpx;
    }
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
  opacity: 0.5;
  background: #000000;
  z-index: 5;
}
</style>
