<template>
  <view
    v-if="show"
    class="EB-popup"
    @touchmove.stop.prevent="() => {}"
  >
    <view class="mask" />
    <view class="popup-box">
      <view
        v-if="popupInfo.windowTitle"
        class="popup-title"
      >
        {{ popupInfo.windowTitle }}
      </view>
      <view
        v-if="src"
        class="popup-img"
      >
        <img
          :src="src"
          alt=""
        >
      </view>
      <scroll-view
        scroll-y="true"
        class="popup-content"
      >
        <view
          class=""
          v-html="popupInfo.windowDesc"
        />
      </scroll-view>

      <view
        class="popup_button"
        :class="[popupInfo.buttons.length>1?'popup-button-multiple-box':'popup-button-single-box']"
      >
        <!-- <view class=""> -->
        <block
          v-for="(item,index) in popupInfo.buttons"
          :key="item.id"
        >
          <view
            :class="[popupInfo.buttons.length>1?'popup-button-multiple':'popup-button-single']"
            :style="item.buttonStyle"
            @click="buttonClick(item,index)"
          >
            {{ item.buttonName }}
          </view>
        </block>
        <!-- </view> -->
        <slot name="popup-button_add" />
      </view>

      <view
        v-if="closeIcon"
        class="close"
        @click="closePopup(popupInfo)"
      >
        <text class="closeIcon icon-guanbi iconfont" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "EBPopup",
  model: {
    prop: "show",
  },
  props: {
    popupInfo: {
      type: Object,
      default: {},
    },
    src: {
      type: String,
      default: "",
    },
    buttonColor: {
      type: String,
      default: "#ffffff",
    },
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "multiple",
    },
    closeIcon: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {

    };
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
  width: 80%;
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
  padding: 25rpx 25rpx 50rpx 25rpx;
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
  width: 25rpx;
  height: 25rpx;
  line-height: 27rpx;
  // border-radius: 50%;
  text-align: center;
  font-size: 0px;
  position: absolute;
  right: 25rpx;
  top: 25rpx;
}

.closeIcon {
  display: inline-block;
  font-size: 34rpx;
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
  padding-top: 78rpx;

  // height: 100%;
  img {
    width: 341rpx;
    height: 226rpx;
    // border-radius: 20rpx 20rpx 0 0;
  }
}

.popup-content {
  font-size: 28rpx;
  color: #333333;
  line-height: 42rpx;
  padding: 40rpx 0;
  text-align: center;
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
  line-height: 88rpx;
  width: 270rpx;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  text-align: center;
  border: 2rpx solid;
  border-color: rgba(255, 255, 255, 0);
}

.popup-button-single {
  width: 100%;
  box-sizing: border-box;
  height: 88rpx;
  border-radius: 44rpx;
  line-height: 88rpx;
  font-size: 30rpx;
  font-weight: 500;
  text-align: center;
  border: 2rpx solid;
  border-color: rgba(255, 255, 255, 0);
}
</style>
