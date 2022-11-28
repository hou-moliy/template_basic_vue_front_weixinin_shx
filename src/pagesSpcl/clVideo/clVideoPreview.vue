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
        <view class="icon" @click="goBack">
          <image
            class="back"
            :src="`${staticImgs}/shxmp/init/custom_nav_back_btn.png`"
          />
        </view>
      </view>
    </view>
    <view class="con-t-fill">
      <view class="con-video" :style="{ height: height }">
        <video
          :style="{ height: height }"
          :autoplay="true"
          class="video"
          object-fit="cover"
          :src="src"
          loop
          :controls="false"
        />
        <view
          class="con-video-title"
          :style="{ marginTop: titleMargin + 'rpx' }"
        >
          <view class="title-big">未知联系人</view>
          <view class="title-small">正在呼叫...</view>
        </view>
        <view class="con-intro">
          <image :src="`${staticImgs}/lnmp/preview-icon.png`" />
        </view>
        <view class="btn-box">
          <view v-if="videoMsg.isBuyVideo" class="buy-btn-isbuy">已设置</view>
          <view v-else class="buy-btn" @click="purchaseVideo(videoMsg)">
            设为视频彩铃
          </view>
        </view>
      </view>
      <view class="mask-bttom" />
      <view class="mask-top" />
    </view>
  </view>
</template>

<script>
import videoService from "@/api/cx/video.js";

export default {
  data () {
    return {
      videoMsg: {},
      clid: 1,
      staticImgs: this.$staticImgs,
      height: "",
      autoplay: true,
      src: "",
      navMarginHeight: 0, // 自定义导航栏外边距
      navHeight: 0, // 自定义导航栏高度
      titleMargin: 0, // 标题外边距
    };
  },
  onLoad (options) {
    this.clid = options.videoId;
    // 根据胶囊外边距和高度计算自定义导航栏的外边距和高度
    this.navMarginHeight = uni.getMenuButtonBoundingClientRect().top;
    this.navHeight = uni.getMenuButtonBoundingClientRect().height;
    this.titleMargin = this.navMarginHeight + 145;
  },
  onShow () {
    // this.$analysis.dispatch("spcl_hjyl");
    this.getVideoByIdJK();

    this.sysheight = uni.getSystemInfoSync().windowHeight;
    this.height = `${this.sysheight}px`;
    this.width = "100%";
  },
  methods: {
    goBack () {
      uni.navigateBack();
    },
    getVideoByIdJK () {
      // console.log();
      videoService.getSpclVideoDetail({
        ringId: this.clid,
      }).then((resp) => {
        const tempList = resp.data.data;
        // 筛选已设置的铃音
        const userSpclData = uni.getStorageSync("userSpclData");
        if (uni.getStorageSync("Authorization") && userSpclData && userSpclData[0].vrbtResponse) {
          const isBuyList = userSpclData[0].vrbtResponse;
          const isBuy = isBuyList.filter(item => tempList.ringId === item.ringId);
          if (isBuy[0]) {
            tempList.isBuyVideo = true;
          }
        }

        this.videoMsg = tempList;
        this.src = this.videoMsg.ringFilePath;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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

      .back {
        width: 20rpx;
        height: 32rpx;
      }
    }
  }
}
.container {
  height: 100%;
  background-color: #000;

  image {
    vertical-align: middle;
    width: 100%;
  }

  button::after {
    border: none;
  }

  .con-t-fill {
    .con-video {
      position: relative;

      video {
        // width: 750rpx;
        // height: 422rpx;
        // background: #ffffff;
        width: 100%;
      }

      .con-video-title {
        font-size: 28rpx;
        letter-spacing: 1rpx;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;

        .title-big {
          font-size: 40rpx;
          font-family: PingFang SC Bold, PingFang SC Bold-Bold;
          font-weight: 700;
          text-align: center;
          color: #ffffff;
          line-height: 67rpx;
          letter-spacing: 1rpx;
          text-shadow: 0px 2rpx 6rpx 0px rgba(0, 0, 0, 0.42);
        }

        .title-small {
          font-size: 24rpx;
          font-family: PingFang SC Medium, PingFang SC Medium-Medium;
          font-weight: 500;
          text-align: center;
          color: #ffffff;
          line-height: 49rpx;
          letter-spacing: 1rpx;
          margin-top: 10rpx;
        }
      }

      .con-intro {
        position: absolute;
        bottom: 269rpx;
        left: 0;
        right: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;

        .intro-tit {
          font-size: 30rpx;
          font-weight: bold;
          margin-top: 1%;
        }

        .intro-desc {
          font-size: 22rpx;
          text-align: center;
          height: 60rpx;
          background: #eeeeee;
          line-height: 59rpx;
          border-top-left-radius: 10rpx;
          border-top-right-radius: 10rpx;
          margin-top: 1.2%;
        }

        image {
          width: 574rpx;
          height: 299rpx;
          margin: 0 auto;
        }
      }

      .btn-box {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 90rpx;
        position: absolute;
        bottom: 100rpx;
        left: 0;
        right: 0;
        z-index: 2;

        .buy-btn {
          width: 374rpx;
          height: 90rpx;
          background: linear-gradient(to right, #9e79ff 0%, #ff83d9 100%);
          border-radius: 45rpx;
          font-size: 32rpx;
          font-family: PingFang SC Bold, PingFang SC Bold-Bold;
          font-weight: 700;
          text-align: center;
          color: #ffffff;
          line-height: 90rpx;
        }

        .buy-btn-isbuy {
          width: 374rpx;
          height: 90rpx;
          background: #c6c5c8;
          border-radius: 45rpx;
          font-size: 32rpx;
          font-family: PingFang SC Bold, PingFang SC Bold-Bold;
          font-weight: 700;
          text-align: center;
          color: #ffffff;
          line-height: 90rpx;
        }
      }
    }
  }

  .mask-bttom {
    position: absolute;
    width: 100%;
    height: 50%;
    bottom: 0rpx;
    left: 0rpx;
    background: linear-gradient(bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    // opacity: 0.1;
  }

  .mask-top {
    position: absolute;
    width: 100%;
    height: 50%;
    top: 0rpx;
    left: 0rpx;
    background: linear-gradient(top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    // opacity: 0.1;
  }
}
</style>
