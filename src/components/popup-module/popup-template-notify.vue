<template>
  <view
    v-if="show"
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
} from "./toos/tools.js";
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
  },
  data () {
    return {
      popupDes: "",
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
    buttonClick (item, index) {
      this.$emit("buttonClick", {
        btnInfo: item,
        index,
      });
    },
    closePopup (popupInfo) {
      this.$emit("closePopup", popupInfo);
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
