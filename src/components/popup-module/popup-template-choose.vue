<template>
  <view v-if="show" class="EB-popup" @touchmove.stop.prevent="() => {}">
    <view class="mask" />
    <uni-drawer
      v-if="popupInfo.windowScene == 3001"
      ref="showBottom"
      class="popup-box-bottom"
      mode="bottom"
      :mask-click="false"
    >
      <view v-if="popupInfo.windowTitle" class="popup-title">
        {{ popupInfo.windowTitle }}
      </view>
      <scroll-view scroll-y="true" class="popup-padding-scroll">
        <view class="popup-padding-box">
          <scroll-view scroll-y="true" class="popup-content">
            <view class="popup-content-box">
              <view v-html="popupDes" />
            </view>
          </scroll-view>
          <view class="label-box">
            <view
              v-for="(item, index) in iopLabel"
              :key="index"
              @click="handlerSelect(item.labelName)"
            >
              <view
                :class="[
                  'label-info',
                  { 'checked-item': selectLabel.includes(item.labelName) },
                ]"
              >
                {{ item.labelName }}
              </view>
            </view>
          </view>
          <view class="popup_button popup-button-single-box">
            <block v-for="(item, index) in popupInfo.buttons" :key="item.id">
              <view
                :class="['popup-button-single']"
                :style="item.buttonStyle"
                @click="buttonClick(item, index)"
              >
                {{ item.buttonName }}
              </view>
            </block>
            <slot name="popup-button_add" />
          </view>
        </view>
      </scroll-view>
      <view
        v-if="!popupInfo.closeButtonFlag"
        class="close"
        @click="closePopup(popupInfo)"
      >
        <text class="closeIcon icon-guanbi iconfont" />
      </view>
    </uni-drawer>
  </view>
</template>

<script>
import { formatRichText } from "./toos/tools.js";
export default {
  name: "EBPopup",
  model: {
    prop: "show",
  },
  props: {
    popupInfo: {
      type: Object,
      default: () => { },
    },
    show: {
      type: Boolean,
      default: false,
    },
    iopLabel: {
      type: Array,
      default: () => [],
    },
    selectLabel: {
      type: Array,
      default: () => [],
    },
    sendSmsTimes: {
      type: String || Number,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      agreementCheckFlag: false,
      popupDes: "",
      smsCode: "",
    };
  },
  watch: {
    popupInfo: {
      handler: function () {
        this.agreementCheckFlag = false;
        let tempPopupDes = "";
        if (this.popupInfo.windowScene === 3001) {
          tempPopupDes = this.popupInfo.windowDesc;
        }
        if (tempPopupDes) {
          this.popupDes = formatRichText(tempPopupDes);
        } else {
          this.popupDes = tempPopupDes;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handlerSelect (labelName) {
      this.$emit("handlerSelect", labelName);
    },
    buttonClick (item, index) {
      this.$emit("buttonClick", {
        btnInfo: item,
        index,
        protocolStatus: !!this.popupInfo.windowProtocol,
        protocolCheckFlag: this.agreementCheckFlag,
        windowScene: this.popupInfo.windowScene,
        smsCode: this.smsCode,
      });
    },
    closePopup (popupInfo) {
      this.$emit("closePopup", popupInfo);
    },
    toPolicy (item) {
      uni.setStorageSync("windowProtocolDetail", item.windowProtocolDetail);
      uni.navigateTo({
        url: "/pagesCommon/policy/commonPolicy",
      });
    },
    check () {
      this.agreementCheckFlag = !this.agreementCheckFlag;
    },
  },
};
</script>
<style>
@import "/font/font-css.css";
</style>
<style lang="scss" scoped>
.EB-popup {
  font-family: PingFang SC, PingFang SC-Medium;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000;
  filter: alpha(opacity=50);
  -moz-opacity: 0.5;
  opacity: 0.5;
  z-index: 1000;
}
.label-box {
  display: flex;
  flex-wrap: wrap;
  padding-top: 15rpx;
  max-height: 630rpx;
  overflow-y: auto;
  .label-info,
  .checked-item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20rpx;
    margin-bottom: 28rpx;
    padding: 13rpx 61rpx;
    background-color: #eff0f3;
    border-radius: 38rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: #8c8f92;
  }
  .checked-item {
    color: #fff;
    background-color: #ff6f50;
  }
}
// 中间弹窗
.popup-box {
  width: 626rpx;
  position: relative;
  background-color: white;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1001;
  animation-name: popup-open;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;

  .popup-title {
    text-align: center;
    // padding-top: 34rpx;
    font-size: 36rpx;
    font-weight: 600;
    color: #333333;
    margin-top: 30rpx;
  }

  .popup-img {
    width: 100%;
    text-align: center;
    // padding-top: 78rpx;

    image {
      width: 100%;
    }
  }

  .popup-content {
    font-size: 28rpx;
    color: #333333;
    line-height: 42rpx;
    margin-top: 30rpx;
    // text-align: center;
    max-height: 378rpx;
  }

  .popup_button {
    width: 100%;
    border-radius: 0 0 20rpx 20rpx;
    margin-top: 30rpx;
    display: flex;
  }

  .popup-button-multiple-box {
    justify-content: space-between;
  }

  .popup-button-single-box {
    justify-content: center;
  }

  .popup_button_multiple {
    // border-top: 1rpx solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .popup-button-multiple {
    line-height: 84rpx;
    width: 270rpx;
    height: 84rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    text-align: center;
    border: 2rpx solid;
    border-color: rgba(255, 255, 255, 0);
    box-sizing: border-box;
  }
  .popup-button-single {
    width: 100%;
    box-sizing: border-box;
    height: 84rpx;
    border-radius: 44rpx;
    line-height: 84rpx;
    font-size: 30rpx;
    font-weight: 500;
    text-align: center;
    border: 2rpx solid;
    border-color: rgba(255, 255, 255, 0);
  }
  .border-hidden {
    border: none;
  }

  .moreDes {
    font-size: 24rpx;
    font-weight: 400;
    color: #999999;
    margin-top: 25rpx;
    max-height: 100rpx;
  }

  .popup-padding-box {
    padding: 0rpx 32rpx 50rpx 32rpx;
  }

  .close {
    text-align: center;
    font-size: 0px;
    position: absolute;
    right: 25rpx;
    top: 25rpx;
  }

  .closeIcon {
    display: inline-block;
    color: #cdcdcd;
  }
}

// 抽屉底部弹窗
.popup-box-bottom {
  max-height: 1106rpx;
  background: #ffffff;
  border-radius: 20px 20px 0px 0px;
  z-index: 1001;
  bottom: 0;
  width: 750rpx;
  position: fixed;
  animation-name: popup-bottom-open;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
  .popup-padding-scroll {
    max-height: 1006rpx;
  }
  .popup-padding-box {
    padding: 24rpx 32rpx 30rpx 32rpx;

    // overflow-y: auto;
    box-sizing: border-box;
  }

  .popup-title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333333;
    line-height: 36px;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    border-bottom: 2rpx solid #f7f7f7;
  }

  .popup-content {
    // background: #f8f8f8;
    max-height: 378rpx;

    // padding: 14rpx 18rpx;
    .popup-content-box {
      padding: 14rpx 18rpx;
    }

    // margin-top: 30rpx;
  }

  .popup_button {
    width: 100%;
    border-radius: 0 0 20rpx 20rpx;
  }

  .popup-button-single {
    width: 686rpx;
    box-sizing: border-box;
    height: 86rpx;
    border-radius: 44rpx;
    line-height: 86rpx;
    font-size: 30rpx;
    font-weight: 500;
    text-align: center;
    border: 2rpx solid;
    border-color: rgba(255, 255, 255, 0);
    margin-top: 30rpx;
  }
  .close {
    // border-radius: 50%;
    text-align: center;
    font-size: 0px;
    position: absolute;
    right: 32rpx;
    top: 32rpx;
  }

  .closeIcon {
    display: inline-block;
    // font-size: 34rpx;
    color: #cdcdcd;
  }
}

@keyframes popup-open {
  0% {
    opacity: 0;
    transform: scale3d(1.1, 1.1, 1);
  }

  100% {
    opacity: 1;
    transform: scale(1, 1, 1);
  }
}
@keyframes popup-bottom-open {
  0% {
    opacity: 0;
    height: 0;
  }

  100% {
    opacity: 1;
    max-height: 1106rpx;
  }
}
</style>
