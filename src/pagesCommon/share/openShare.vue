// 视频彩铃分享打开页面
<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="navBarBox">
      <view
        class="navBar"
        :style="{
          paddingTop: navMarginHeight + 'px',
          height: navHeight + 'px',
        }"
      >
        <view class="icon" @click="goHome">
          <image
            class="home"
            :src="`${staticImgs}/shxmp/init/custom_nav_home_btn.png`"
          />
        </view>
      </view>
    </view>
    <!-- 全屏播放组件 -->
    <fullScreenVideo v-if="videoDetail" :item="videoDetail" :is-slide="false" />
    <!-- 新手引导步骤一 -->
    <view v-if="isFirstPlay && step === 1" class="tip-one" @click="nextStep">
      <view class="tip-text" @click.stop="jumpGuide">跳过引导</view>
      <image
        :src="`${staticImgs}/shxmp/init/spcl_tip_one.png`"
        class="tip-bubble"
      />
      <image
        :src="`${staticImgs}/shxmp/init/spcl_detail_next.png`"
        class="tip-button"
      />
      <view class="set-box">
        <view class="inner-box">
          <view class="set-boxImg">
            <image
              :src="`${staticImgs}/shxmp/init/set_spcl_btn_inner.png`"
              class="set-btn-inner"
            />
          </view>
          <view class="spcl_btn1" />
          <view class="spcl_btn2" />
          <view class="spcl_btn3" />
          <view class="spcl_btn4" />
        </view>
        <view class="set-text">设为彩铃</view>
      </view>
    </view>
    <!-- 新手引导步骤二 -->
    <view v-if="isFirstPlay && step === 2" class="tip-two" @click="nextStep">
      <view class="tip-text" @click.stop="jumpGuide">跳过引导</view>
      <image
        :src="`${staticImgs}/shxmp/init/spcl_tip_two.png`"
        class="tip-bubble"
      />
      <image
        :src="`${staticImgs}/shxmp/init/spcl_detail_next.png`"
        class="tip-button"
      />
      <view class="right-icon">
        <image
          :src="`${staticImgs}/shxmp/init/video-preview-icon.png`"
          class="preview-img img"
        />
      </view>
    </view>
    <!-- 滑动提示 -->
    <view
      v-if="isFirstPlay && step === 3"
      class="slide-image"
      @click="isFirstPlay = false"
    >
      <image :src="`${staticImgs}/shxmp/init/slide_indicator.png`" />
    </view>
  </view>
</template>

<script>
import SpclService from "@/api/spcl/index.js";
import fullScreenVideo from "@/components/full-screen-video/full-screen-video.vue";
import { formatCount } from "@/utils/tools.js";
import { videoInfoUpdate } from "@/utils/video";
export default {
  components: {
    fullScreenVideo,
  },
  data () {
    return {
      videoDetail: null, // 视频彩铃详情
      videoId: "", // 视频Id
      staticImgs: this.$staticImgs,
      userName: "您的好友",
      navMarginHeight: 0, // 自定义导航栏外边距
      navHeight: 0, // 自定义导航栏高度
      step: 0, // 新手引导步骤
      isFirstPlay: false, // 控制引导弹窗的展示
    };
  },
  onLoad (options) {
    this.$analysis.dispatch("share_spcl");
    if (options.videoId) {
      this.videoId = options.videoId;
    } else {
      uni.switchTab({
        url: "/pages/cl/index",
      });
    }
    this.initStyle();
    if (uni.getStorageSync("userPlayVideo")) {
      this.isFirstPlay = false;
    } else {
      this.step = 1;
      this.isFirstPlay = true;
    }
  },
  async onShow () {
    this.getVideoDetail();
  },
  onShareAppMessage () {
    if (uni.getStorageSync("Authorization")) {
      const userInfo = uni.getStorageSync("userInfo");
      const phone = uni.getStorageSync("phone");
      this.userName = userInfo?.nickName || `${phone.substring(0, 3)}****${phone.substring(7)}`;
    }
    const imageUrl = this.videoDetail.coverUrl || this.videoDetail.openVCoverUrl || this.videoDetail.openHCoverUrl;
    return {
      title: this.userName + "悄悄分享给您一个[视频彩铃]小程序，赶快去看看吧",
      path: "/pagesCommon/share/openShare?videoId=" + this.videoId,
      imageUrl,
    };
  },
  methods: {
    formatCount,
    // 新手引导下一步
    nextStep () {
      this.$analysis.dispatch("spcl_dgcl_jx");
      if (this.step === 1) {
        this.step = 2;
      } else if (this.step === 2) {
        this.step = 3;
        this.isFirstPlay = true;
      } else {
        console.log("step:way 故障", this.step);
      }
    },
    // 新手引导跳过引导
    jumpGuide () {
      this.$analysis.dispatch("spcl_dgcl_tg");
      this.step = 3;
      this.isFirstPlay = true;
    },
    // 初始化样式
    initStyle () {
      this.$nextTick(() => {
        // 根据胶囊外边距和高度计算自定义导航栏的外边距和高度
        this.navMarginHeight = uni.getMenuButtonBoundingClientRect().top;
        this.navHeight = uni.getMenuButtonBoundingClientRect().height;
      });
    },
    // 回到首页
    goHome () {
      uni.switchTab({
        url: "/pages/cl/index",
      });
    },
    // 获取视频彩铃详情
    getVideoDetail () {
      const data = {
        ringId: this.videoId,
      };
      SpclService.getSpclVideoDetail(data).then((res) => {
        if (res.data.code === 200 && res.data.data) {
          let list = [res.data.data];
          list = videoInfoUpdate(list);
          this.videoDetail = list[0];
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  flex: 1;
}

// 自定义导航栏
.navBarBox {
  position: absolute;
  z-index: 10;
  width: 100%;

  .navBar {
    display: flex;
    align-items: center;

    .icon {
      width: 80rpx;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .home {
        width: 35rpx;
        height: 32rpx;
      }
    }
  }
}

// 视频彩铃内容
.video-box {
  flex: 1;
  width: 750rpx;
  .video {
    flex: 1;
  }
  .cover_image {
    width: 100%;
    height: 100vh;
  }
}

.view-center {
  position: absolute;
  justify-content: center;
  align-items: center;
  opacity: 0.1;
  z-index: 999;
}

.view-left {
  position: absolute;
  width: 100%;
  bottom: 100rpx;
  left: 0rpx;
  font-size: 32rpx;
  color: #ffffff;
  /* #ifndef APP-PLUS */
  white-space: pre-wrap;
  text-overflow: ellipsis;
  /* #endif */
}

.left-view {
  box-sizing: border-box;
  margin-bottom: 20rpx;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 30rpx 0 30rpx;

  .set-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 210rpx;
    position: relative;
  }
}

.left-text {
  width: 480rpx;
  font-size: 32rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium, sans-serif;
  font-weight: 500;
  text-align: left;
  color: #ffffff;
  line-height: 48rpx;
  text-shadow: 0rpx 2rpx 7rpx 0rpx rgba(4, 0, 0, 0.23);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
}

.left-view-right {
  width: 168rpx;
  height: 58rpx;
  border-radius: 29px;
}

.inner-box {
  width: 162rpx;
  height: 162rpx;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.set-btn-inner {
  width: 100rpx;
  height: 100rpx;
  animation-name: camera;
  animation-duration: 0.3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  /* Safari and Chrome: */
  -webkit-animation-name: camera;
  -webkit-animation-duration: 0.3s;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}

@keyframes camera {
  from {
    transform: rotate(-8deg);
  }
  to {
    transform: rotate(8deg);
  }
}

@-webkit-keyframes camera {
  from {
    transform: rotate(-8deg);
  }
  to {
    transform: rotate(8deg);
  }
}

.set-text {
  font-size: 28rpx;
  font-family: PingFang SC, PingFang SC-Medium, sans-serif;
  color: #ffffff;
  line-height: 36rpx;
}

.setted-video {
  width: 168rpx;
  height: 58rpx;
  background: #c6c5c8;
  border-radius: 29rpx;
  font-size: 22rpx;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  line-height: 58rpx;
}

.avater {
  border-radius: 50rpx;
  border-color: #fff;
  border-style: solid;
  border-width: 4rpx;
}

.view-right {
  position: absolute;
  bottom: 350rpx;
  right: 30rpx;
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* #endif */

  .right-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.right-text {
  font-size: 28rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium, sans-serif;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  line-height: 42rpx;
  text-shadow: 0rpx 2rpx 5rpx 0rpx rgba(4, 0, 0, 0.23);
  margin: 7rpx 0 46rpx 0;
}

.img {
  height: 90rpx;
  width: 90rpx;
  opacity: 0.9;
}

.other-img {
  width: 66rpx;
  height: 66rpx;
}

.preview-img {
  height: 90rpx;
  width: 90rpx;
}

.mask-top {
  position: absolute;
  width: 100%;
  height: 50%;
  top: 0rpx;
  left: 0rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
}

.mask-bottom {
  position: absolute;
  width: 100%;
  height: 50%;
  bottom: 0rpx;
  left: 0rpx;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
}

.blank-space {
  width: 100vw;
  height: 25rpx;
  background-color: black;
}

// 视频彩铃设置动态按钮
@keyframes active {
  0% {
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    opacity: 0;
  }
  25% {
    transform: scale(0.6);
    -webkit-transform: scale(0.6);
    opacity: 0.3;
  }
  50% {
    transform: scale(0.7);
    -webkit-transform: scale(0.7);
    opacity: 0.6;
  }
  75% {
    transform: scale(0.8);
    -webkit-transform: scale(0.8);
    opacity: 0.3;
  }
  100% {
    transform: scale(0.9);
    -webkit-transform: scale(0.9);
    opacity: 0;
  }
}

.spcl_btn1,
.spcl_btn2,
.spcl_btn3,
.spcl_btn4 {
  position: absolute;
  width: 200rpx;
  height: 200rpx;
  border: 4rpx solid #ff366f;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  box-shadow: 0 0 0 3rpx #ff366f; /* 阴影效果 */
  transform: translate(-50%, -50%);
}
/* 第一个圆圈动画 */
.spcl_btn1 {
  animation: active 2s linear 0s infinite;
}
/* 第二个圆圈动画 */
.spcl_btn2 {
  animation: active 2s linear 0.5s infinite;
}
/* 第三个圆圈动画 */
.spcl_btn3 {
  animation: active 2s linear 1s infinite;
}
/* 第四个圆圈动画 */
.spcl_btn4 {
  animation: active 2s linear 1.5s infinite;
}

.set-boxImg {
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(131deg, #ff7254 0%, #ff008c 100%);
  border-radius: 50%;
}
.slide-image {
  position: absolute;
  width: 265rpx;
  height: 475rpx;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  image {
    width: 265rpx;
    height: 475rpx;
  }
}
.tip-one {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  background: #000000;
  z-index: 888;

  .tip-text {
    opacity: 0.8;
    font-size: 26rpx;
    color: #ffffff;
    line-height: 36rpx;
    position: absolute;
    right: 154rpx;
    bottom: 747rpx;
    height: 40rpx;
    border-bottom: 2rpx solid rgba(255, 255, 255, 0.8);
  }

  .tip-bubble {
    width: 544rpx;
    height: 349rpx;
    position: absolute;
    right: 140rpx;
    bottom: 370rpx;
    z-index: 999;
  }

  .tip-button {
    width: 191rpx;
    height: 97rpx;
    position: absolute;
    right: 370rpx;
    bottom: 360rpx;
  }

  .set-box {
    position: absolute;
    right: 30rpx;
    bottom: 120rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 210rpx;
  }
}

.tip-two {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  background: #000000;

  .tip-text {
    opacity: 0.8;
    font-size: 26rpx;
    color: #ffffff;
    line-height: 36rpx;
    position: absolute;
    right: 116rpx;
    bottom: 1170rpx;
    height: 40rpx;
    border-bottom: 2rpx solid rgba(255, 255, 255, 0.8);
  }

  .tip-bubble {
    width: 600rpx;
    height: 293rpx;
    position: absolute;
    right: 90rpx;
    bottom: 850rpx;
  }

  .tip-button {
    width: 191rpx;
    height: 97rpx;
    position: absolute;
    right: 380rpx;
    bottom: 800rpx;
  }

  .right-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 15rpx;
    bottom: 739rpx;
    image {
      width: 134rpx;
      height: 134rpx;
    }
  }
}
</style>
