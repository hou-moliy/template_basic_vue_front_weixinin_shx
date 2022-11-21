<template name="clSharePanel">
  <view>
    <view class="cur-ring-f" v-show="panelShow">
      <view class="panel-view">
        <!-- 分享 -->
        <view
          class="panel-item share-wx"
          :class="pagesFlag == false ? 'share-wx-cg' : ''"
          @click="shareEvent(currentObj.ringId)"
        >
          <button>
            <image :src="`${staticImgs}/lnmp/sp-share.png`"></image>
            <view>分享铃音</view>
          </button>
        </view>
        <!-- 喜欢 -->
        <view
          class="panel-item panel-sc"
          v-show="pagesFlag && currentObj.extraInfo.like"
          @click="likeEvent(currentObj.ringId, true)"
        >
          <image :src="`${staticImgs}/lnmp/sp-liked.png`"></image>
          <view>已添加</view>
        </view>
        <view
          class="panel-item panel-sc"
          v-show="pagesFlag && !currentObj.extraInfo.like"
          @click="likeEvent(currentObj.ringId, false)"
        >
          <image :src="`${staticImgs}/lnmp/sp-like.png`"></image>
          <view>添加到喜欢</view>
        </view>
        <!-- 设置 -->
        <view class="panel-item panel-st" v-show="pagesFlag">
          <view v-if="currentObj.szValue === 0">
            <image
              :src="`${staticImgs}/lnmp/sp-settinged.png`"
              @click="qxSzEvent(currentObj.ringId)"
            ></image>
            <view @click="qxSzEvent(currentObj.ringId)">取消当前设置</view>
          </view>
          <view v-else>
            <image
              :src="`${staticImgs}/lnmp/sp-setting.png`"
              @click="szEvent(currentObj.ringId)"
            ></image>
            <view @click="szEvent(currentObj.ringId)">设为视频彩铃</view>
          </view>
        </view>
      </view>
      <!-- 关闭弹窗 -->
      <view class="f-btn" @click="hiddenPanelBtn">取消</view>
    </view>
    <!-- 底部遮罩 -->
    <view class="mask mask-foot" v-show="panelShow"></view>
  </view>
</template>

<script>
export default {
  name: "clSharePanel",
  data() {
    return {
      staticImgs: this.$staticImgs,
    };
  },
  props: {
    panelShow: {
      type: Boolean,
      default: false,
    },
    currentObj: {
      type: Object,
      default: () => {},
    },
    pagesFlag: true,
  },
  methods: {
    // 点击取消
    hiddenPanelBtn() {
      this.$emit("hiddenPanelBtn");
    },
    // 点击分享
    shareEvent(ringId) {
      this.$emit("shareEvent", ringId);
    },
    // 添加或取消我喜欢
    likeEvent(ringId, flag) {
      this.$emit("likeEvent", ringId, flag);
    },
    // 设为视频彩铃
    szEvent(clid) {
      this.$emit("szEvent", clid);
    },
    // 取消设置
    qxSzEvent(clid) {
      this.$emit("qxSzEvent", clid);
    },
  },
};
</script>

<style lang="scss" scoped>
.cur-ring-f {
  position: fixed;
  bottom: 0;
  background: #ffffff;
  width: 100%;
  font-size: 25rpx;
  z-index: 1003;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;

  .panel-view {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    color: #999999;
    padding: 50rpx 20rpx 0 20rpx;

    .panel-item {
      width: 33%;

      image {
        width: 88rpx;
        height: 88rpx;
      }

      view {
        margin-top: 14rpx;
      }
    }

    .share-wx-cg {
      width: 50%;
    }

    .share-wx {
      button {
        display: inline;
        padding: 0;
        font-size: 25rpx;
        line-height: normal;
        border-radius: 0;
        background: #ffffff;
        color: #999999;
      }

      button::after {
        border: none;
      }
    }
  }

  .f-line {
    width: 100%;
    background: #e5e5e5;
    height: 1rpx;
    margin-top: 46rpx;
  }

  .f-btn {
    color: #333333;
    text-align: center;
    font-size: 30rpx;
    margin-top: 50rpx;
    height: 100rpx;
    border-top: 1rpx solid #e5e5e5;
    line-height: 100rpx;
  }
}

.mask {
  position: fixed;
  background: rgba(0, 0, 0, 1);
  opacity: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
}

.mask-foot {
  opacity: 0.5;
}
</style>
