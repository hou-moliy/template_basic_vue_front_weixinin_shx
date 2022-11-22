<template name="clSharePanel">
  <view>
    <view
      v-show="panelShow"
      class="cur-ring-f"
    >
      <view class="panel-view">
        <!-- 分享 -->
        <view
          class="panel-item share-wx"
          :class="pagesFlag === false ? 'share-wx-cg' : ''"
          @click="shareEvent(currentObj.ringId)"
        >
          <button>
            <image :src="`${staticImgs}/shxmp/init/sp-share.png`" />
            <view class="panel-item-text">
              分享铃音
            </view>
          </button>
        </view>
        <!-- 喜欢 -->
        <view
          v-show="pagesFlag && currentObj.extraInfo.like"
          class="panel-item panel-sc"
          @click="likeEvent(currentObj.ringId, true)"
        >
          <image :src="`${staticImgs}/shxmp/init/sp-liked.png`" />
          <view class="panel-item-text">
            已添加
          </view>
        </view>
        <view
          v-show="pagesFlag && !currentObj.extraInfo.like"
          class="panel-item panel-sc"
          @click="likeEvent(currentObj.ringId, false)"
        >
          <image :src="`${staticImgs}/shxmp/init/sp-liked.png`" />
          <view class="panel-item-text">
            添加到喜欢
          </view>
        </view>
        <!-- 设置 -->
        <view
          v-show="pagesFlag"
          class="panel-item panel-st"
        >
          <view v-if="currentObj.szValue === 0">
            <image
              :src="`${staticImgs}/shxmp/init/sp-settinged.png`"
              @click="qxSzEvent(currentObj.ringId)"
            />
            <view
              class="panel-item-text"
              @click="qxSzEvent(currentObj.ringId)"
            >
              取消当前设置
            </view>
          </view>
          <view v-else>
            <image
              :src="`${staticImgs}/shxmp/init/sp-settinged.png`"
              @click="szEvent(currentObj.ringId)"
            />
            <view
              class="panel-item-text"
              @click="szEvent(currentObj.ringId)"
            >
              设为视频彩铃
            </view>
          </view>
        </view>
      </view>
      <!-- 关闭弹窗 -->
      <view
        class="close-btn"
        @click="hiddenPanelBtn"
      >
        取消
      </view>
    </view>
    <!-- 底部遮罩 -->
    <view
      v-show="panelShow"
      class="mask mask-foot"
    />
  </view>
</template>

<script>
export default {
  name: "ClSharePanel",
  props: {
    panelShow: {
      type: Boolean,
      default: false,
    },
    currentObj: {
      type: Object,
      default: () => { },
    },
    pagesFlag: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
    };
  },
  methods: {
    // 点击取消
    hiddenPanelBtn () {
      this.$emit("hiddenPanelBtn");
    },
    // 点击分享
    shareEvent (ringId) {
      this.$emit("shareEvent", ringId);
    },
    // 添加或取消我喜欢
    likeEvent (ringId, flag) {
      this.$emit("likeEvent", ringId, flag);
    },
    // 设为视频彩铃
    szEvent (clid) {
      this.$emit("szEvent", clid);
    },
    // 取消设置
    qxSzEvent (clid) {
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
    padding: 56rpx 68rpx 51rpx;
    font-size: 24rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: #222222;
    letter-spacing: -0.48rpx;

    .panel-item {
      flex: 1;

      image {
        width: 88rpx;
        height: 88rpx;
      }

      .panel-item-text {
        margin-top: 29rpx;
      }
    }

    .share-wx-cg {
      width: 50%;
    }

    .share-wx {
      button {
        display: inline;
        padding: 0;
        font-size: 24rpx;
        line-height: normal;
        border-radius: 0;
        background: #ffffff;
        color: #222222;
      }

      button::after {
        border: none;
      }
    }
  }

  .close-btn {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    background: #f5f7f9;
    font-size: 30rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: #666666;
    letter-spacing: -0.6rpx;
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
