<template>
  <view
    v-if="popupInfo.isVisible"
    class="EB-popup"
    @touchmove.stop.prevent="() => {}"
  >
    <view class="mask" />
    <view class="popup-box">
      <!-- 头图 -->
      <view
        v-if="popupInfo.headImg"
        class="popup-img"
      >
        <img
          :src="popupInfo.headImg"
          alt=""
          mode="widthFix"
        >
      </view>
      <view class="popup-padding-box">
        <view
          v-if="popupInfo.windowTitle"
          class="popup-title"
        >
          {{ popupInfo.windowTitle }}
        </view>
        <scroll-view
          scroll-y="true"
          class="popup-content"
        >
          <rich-text :nodes="popupDes" />
        </scroll-view>
        <view
          class="popup_button"
          :class="[popupInfo.buttons.length>1?'popup-button-multiple-box':'popup-button-single-box']"
        >
          <block
            v-for="(item,index) in popupInfo.buttons"
            :key="item.id"
          >
            <view
              :class="[popupInfo.buttons.length>1?'popup-button-multiple':'popup-button-single',item.buttonStyle.indexOf('border-color')>-1?'border-show':'border-hidden']"
              :style="item.buttonStyle"
              @click="buttonClick(item,index)"
            >
              {{ item.buttonName }}
            </view>
          </block>
          <slot name="popup-button_add" />
        </view>

        <view
          v-if="!popupInfo.closeButtonFlag"
          class="close"
          @click="closePopup(popupInfo)"
        >
          <text class="closeIcon icon-guanbi iconfont" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  formatRichText,
} from "../popup-module/toos/tools";
export default {
  name: "NotifyPop",
  data () {
    return {
      popupDes: "", // 文本描述
      promiseStatus: null, // 按钮点击的promise
      defaultOptions: {
        isVisible: false, // 是否展示弹窗
        windowTitle: "温馨提示", // 标题
        time: 0,
        windowDesc: "这里是描述", // 弹窗描述
        buttons: [
          {
            buttonName: "取消",
            buttonStyle: "color:#ffffff;border-color:none;background:linear-gradient(-87deg,#fee5ff 0%, #ddddff 100%);",
            id: 9,
            type: 1,
          },
          {
            buttonName: "确定",
            buttonStyle: "color:#ffffff;border-color:none;background:linear-gradient(-90deg,#ff83d9 0%, #9e79ff 100%);",
            id: 9,
            type: 2,
          },
        ],
      }, // 默认弹窗的展示
      popupInfo: {}, // 传入的弹窗内容
      timer: null, // 自动关闭弹窗的定时器，当传入time的时候生效
    };
  },
  watch: {
    popupInfo: {
      handler: function () {
        this.agreementCheckFlag = false;
        this.popupDes = "";
        if (this.popupInfo.windowDesc) {
          this.popupDes = formatRichText(this.popupInfo.windowDesc);
        } else {
          this.popupDes = this.popupInfo.windowDesc;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 显示弹窗事件（处理传参）
    show (args) {
      this.popupInfo = Object.assign({}, this.defaultOptions, args, { isVisible: true });
      // 自动关闭
      if (this.popupInfo.time) {
        this.timer = setTimeout(() => {
          this.popupInfo = Object.assign({}, this.defaultOptions, { isVisible: false });
        }, this.popupInfo.time * 1000);
      }
      return new Promise((resolve, reject) => {
        this.promiseStatus = { resolve, reject };
      });
    },
    // 关闭弹窗
    closePopup () {
      this.popupInfo = Object.assign({}, this.defaultOptions, { isVisible: false });
      this.promiseStatus && this.promiseStatus.reject();
    },
    // 按钮点击
    buttonClick (btnInfo, index) {
      const res = {
        btnInfo,
        index,
      };
      if (btnInfo.type === 1) { // 关闭弹窗按钮点击
        this.closePopup();
      } else { // 非关闭按钮点击弹窗
        this.popupInfo = Object.assign({}, this.defaultOptions, { isVisible: false });
        this.promiseStatus && this.promiseStatus.resolve(res);
      }
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

.popup-box {
  width: 626rpx;
  position: relative;
  background-color: white;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1001;
  animation-name: popup-open;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
}

.popup-padding-box {
  padding: 0rpx 32rpx 50rpx 32rpx;
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
  padding: 40rpx 0;
  // text-align: center;
  max-height: 400rpx;
  // overflow-y: auto;
}

.popup_button {
  width: 100%;
  border-radius: 0 0 20rpx 20rpx;
  // margin-top: 20rpx;
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

  image {
    width: 100%;
    height: 100%;
  }
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

  image {
    width: 100%;
    height: 100%;
  }
}
.border-hidden {
  border: none;
}
</style>
