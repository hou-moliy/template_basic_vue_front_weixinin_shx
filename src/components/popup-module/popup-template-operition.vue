<template>
  <view v-if="show" class="EB-popup" @touchmove.stop.prevent="() => {}">
    <view class="mask" />
    <view v-if="popupInfo.windowScene == 2001" class="popup-box">
      <!-- 头图 -->
      <view v-if="popupInfo.headImg" class="popup-img popup-img1">
        <image :src="popupInfo.headImg" alt="" mode="widthFix" />
        <!-- 标题 -->
        <view v-if="popupInfo.windowTitle" class="popup-title popup-title1">
          {{ popupInfo.windowTitle }}
        </view>
      </view>
      <view class="popup-padding-box">
        <!-- 内容 -->
        <scroll-view scroll-y="true" class="popup-content">
          <rich-text :nodes="popupDes" />
        </scroll-view>
        <!-- 协议 -->
        <view v-if="popupInfo.windowProtocol" class="popup-agreement">
          <view
            class="popup-agreement-check"
            :class="agreementCheckFlag ? 'popup-agreement-checked' : ''"
            @click="check"
          >
            <text v-if="agreementCheckFlag" class="iconfont icon-xuanzhong" />
          </view>
          <view class="popup-agreement-content">
            确认即代表您同意加入
            <text
              class="popup-agreement-content-text2"
              @click="toPolicy(popupInfo)"
            >
              《{{ popupInfo.windowProtocol }}》
            </text>
          </view>
        </view>
        <!-- 按钮 -->
        <view
          class="popup_button"
          :class="[
            popupInfo.buttons.length > 1
              ? 'popup-button-multiple-box'
              : 'popup-button-single-box',
          ]"
        >
          <block v-for="(item, index) in popupInfo.buttons" :key="item.id">
            <view
              :class="[
                popupInfo.buttons.length > 1
                  ? 'popup-button-multiple'
                  : 'popup-button-single',
                item.buttonStyle.indexOf('border-color') > -1
                  ? 'border-show'
                  : 'border-hidden',
              ]"
              :style="item.buttonStyle"
              @click="buttonClick(item, index)"
            >
              {{ item.buttonName }}
            </view>
          </block>
          <slot name="popup-button_add" />
        </view>
        <!-- 关闭按钮 -->
        <view
          v-if="!popupInfo.closeButtonFlag"
          class="close"
          @click="closePopup(popupInfo)"
        >
          <text class="closeIcon icon-guanbi iconfont" />
        </view>

        <!-- 文字注释 -->

        <scroll-view v-if="popupInfo.moreDesc" scroll-y="true" class="moreDes">
          <view v-html="popupInfo.moreDesc" />
        </scroll-view>
      </view>
    </view>
    <uni-drawer
      v-if="popupInfo.windowScene == 2002"
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
          <view class="business-info">
            <view class="business-img">
              <image :src="businessInfo.iconUrl" />
            </view>
            <view class="business-des">
              <view class="business-title">
                {{ businessInfo.title }}
              </view>
              <view class="business-prize">
                ￥{{ businessInfo.price }}{{ businessInfo.units }}
              </view>
            </view>
          </view>
          <scroll-view scroll-y="true" class="popup-content">
            <view class="popup-content-box">
              <image :src="popupDes" mode="widthFix" />
            </view>
          </scroll-view>
          <!-- 发送验证码 -->
          <view class="sms-module">
            <view class="user-phone">手机号码：{{ phoneNumber }}</view>
            <view v-if="phoneNumber" class="sms-box">
              <input
                v-model="smsCode"
                class="m-input sms-code-input"
                type="text"
                clearable
                placeholder="请输入验证码"
              />
              <view v-if="sendSmsTimes > 0" class="sms-code-btn sms-code">
                {{ sendSmsTimes }}s重新获取
              </view>
              <view v-else class="sms-code-btn" @click="$emit('sendSmsCode')">
                获取验证码
              </view>
            </view>
          </view>
          <view v-if="popupInfo.windowProtocol" class="popup-agreement">
            <view
              class="popup-agreement-check"
              :class="agreementCheckFlag ? 'popup-agreement-checked' : ''"
              @click="check"
            >
              <text v-if="agreementCheckFlag" class="iconfont icon-xuanzhong" />
            </view>
            <view class="popup-agreement-content">
              阅读并同意
              <text
                class="popup-agreement-content-text2"
                @click="toPolicy(popupInfo)"
              >
                《{{ popupInfo.windowProtocol }}》
              </text>
            </view>
          </view>
          <view
            class="popup_button"
            :class="[
              popupInfo.buttons.length > 1
                ? 'popup-button-multiple-box'
                : 'popup-button-single-box',
            ]"
          >
            <block v-for="(item, index) in popupInfo.buttons" :key="item.id">
              <view
                :class="[
                  popupInfo.buttons.length > 1
                    ? 'popup-button-multiple'
                    : 'popup-button-single',
                ]"
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
import {
  formatRichText,
} from "./tool/tools.js";
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
    businessInfo: {
      type: Object,
      default: () => { },
    },
    sendSmsTimes: {
      type: String || Number,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    checked: { // 是否默认勾选协议
      type: Boolean,
      default: true,
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
      handler: function (newVal) {
        this.agreementCheckFlag = this.checked && newVal.windowProtocol;
        let tempPopupDes = "";
        this.smsCode = "";
        if (newVal.windowScene === 2002) {
          tempPopupDes = this.businessInfo.businessDesc;
        } else {
          tempPopupDes = newVal.windowDesc;
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

    image {
      width: 100%;
    }
  }

  .popup-content {
    font-size: 28rpx;
    color: #333333;
    line-height: 42rpx;
    margin-top: 30rpx;
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
    width: 380rpx;
    box-sizing: border-box;
    height: 84rpx;
    border-radius: 42rpx;
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
  .popup-agreement {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    // padding-bottom: 31rpx;
    margin-top: 34rpx;

    .popup-agreement-check {
      background-color: #fff;
      border-radius: 50%;
      text-align: center;
      line-height: 30rpx;
      width: 28rpx;
      height: 28rpx;
      border: 2rpx solid #a6a6a6;
    }

    .popup-agreement-checked {
      border: none;
      width: 30rpx;
      height: 30rpx;
      color: #6b61f5;
    }

    .popup-agreement-content {
      // width: 100%;
      padding-left: 15rpx;
      box-sizing: border-box;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      font-size: 24rpx;
      font-weight: 500;
      text-align: left;

      .popup-agreement-content-text2 {
        // overflow: hidden;
        // white-space: nowrap;
        // text-overflow: ellipsis;
        color: #1f87fc;
      }
    }
  }

  .moreDes {
    font-size: 24rpx;
    font-weight: 400;
    color: #999999;
    margin-top: 25rpx;
    max-height: 100rpx;
  }

  .popup-padding-box {
    padding: 0rpx 32rpx 44rpx 32rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
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
  height: 1106rpx;
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
    height: 1006rpx;
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
    background: #f8f8f8;
    max-height: 378rpx;

    // padding: 14rpx 18rpx;
    .popup-content-box {
      padding: 14rpx 18rpx;
    }

    margin-top: 30rpx;
  }

  .business-info {
    display: flex;
    align-items: center;

    .business-img {
      width: 268rpx;
      height: 160rpx;
      flex-shrink: 0;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .business-des {
      display: flex;
      flex-direction: column;
      margin-left: 20rpx;
      height: 160rpx;
      justify-content: space-between;

      .business-title {
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
        line-height: 42rpx;
        margin-bottom: 10rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .business-prize {
        font-size: 38rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ff6d72;
        line-height: 53rpx;
      }
    }
  }

  // 发送验证码
  .sms-module {
    margin-top: 30rpx;

    .user-phone {
      height: 42rpx;
      font-size: 30rpx;
      font-weight: 600;
      color: #333333;
      line-height: 42rpx;
      letter-spacing: 1px;
      margin-bottom: 20rpx;
    }

    .sms-box {
      width: 686rpx;
      height: 88rpx;
      background: #f0f0f0;
      border-radius: 10rpx;
      display: flex;
      justify-content: space-between;

      .m-input {
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 88rpx;
        height: 88rpx;
        padding-left: 30rpx;
      }

      .sms-code-btn {
        width: 250rpx;
        height: 88rpx;
        line-height: 88rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #333333;
        text-align: center;
        // margin-right: 40rpx;
      }

      .sms-code {
        color: #0081ff;
      }
    }
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

  .popup-agreement {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    // padding-bottom: 31rpx;
    margin-top: 34rpx;

    .popup-agreement-check {
      background-color: #fff;
      border-radius: 50%;
      text-align: center;
      line-height: 30rpx;
      width: 28rpx;
      height: 28rpx;
      border: 2rpx solid #a6a6a6;
    }

    .popup-agreement-checked {
      border: none;
      width: 30rpx;
      height: 30rpx;
      color: #1f87fc;
    }

    .popup-agreement-content {
      width: 100%;
      padding-left: 15rpx;
      box-sizing: border-box;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      font-size: 24rpx;
      font-weight: 500;
      text-align: left;

      .popup-agreement-content-text2 {
        // overflow: hidden;
        // white-space: nowrap;
        // text-overflow: ellipsis;
        color: #1f87fc;
      }
    }
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
    height: 1106rpx;
  }
}

// 弹窗样式调整
.popup-img1 {
  position: relative;
}
.popup-title1 {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 55rpx;
}
</style>
