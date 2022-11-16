<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="navBarBox">
      <view
        class="navBar"
        :style="{ paddingTop: navMarginHeight + 'px', height: navHeight + 'px' }"
      >
        <view
          class="icon"
          @click="goHome"
        >
          <image
            class="home"
            :src="`${staticImgs}/lnmp/custom_nav_home_btn.png`"
          />
        </view>
      </view>
    </view>
    <view
      v-if="isFullScreen"
      class="con-t-fill"
    >
      <view
        class="con-video"
        :style="{ height: 'calc(100vh - 100rpx)' }"
      >
        <video
          :style="{ height: '100%' }"
          style="width: 100%"
          :autoplay="true"
          class="video"
          object-fit="contain"
          :src="videoDetail.ringFilePath"
          loop
          objectFit="cover"
          :controls="false"
        />
        <view class="con-video-title">
          <view class="title-big">
            未知联系人
          </view>
          <view class="title-small">
            正在呼叫...
          </view>
        </view>
        <view class="con-intro">
          <image :src="`${staticImgs}/lnmp/preview-icon.png`" />
        </view>
      </view>
    </view>
    <view
      v-else
      class="con-t-small"
    >
      <view class="con-video">
        <view class="con-video-title">
          <view class="title-big">
            未知联系人
          </view>
          <view class="title-small">
            正在呼叫...
          </view>
        </view>
        <video
          :style="{ height: height }"
          style="width: 100%"
          :autoplay="true"
          class="video"
          object-fit="contain"
          :src="videoDetail.ringFilePath"
          loop
          objectFit="contain"
          :controls="false"
        />

        <view class="con-intro">
          <image :src="`${staticImgs}/lnmp/preview-icon.png`" />
        </view>
      </view>
    </view>
    <view class="con-f">
      <view class="flex-view">
        <view class="icon-box">
          <view class="panel-item share-wx">
            <button @click="shareLogin">
              <image :src="`${staticImgs}/lnmp/open_share.png`" />
              <text>分享</text>
            </button>
          </view>
          <view
            v-if="videoDetail.extraInfo.like"
            class="panel-item sc-mang-even"
            @click="qxscEven(true)"
          >
            <image :src="`${staticImgs}/lnmp/open_share_dzed.png`" />
            <text>点赞</text>
          </view>
          <view
            v-else
            class="panel-item sc-mang-even"
            @click="qxscEven(false)"
          >
            <image :src="`${staticImgs}/lnmp/open_share_dz.png`" />
            <text>点赞</text>
          </view>
        </view>
        <view
          v-if="!videoDetail.isBuyVideo"
          class="panel-item szcl-btn"
          @click.stop="purchaseVideo(videoDetail)"
        >
          设为我的彩铃
        </view>
        <view
          v-else
          class="panel-item is-buy-szcl-btn"
        >
          已设置
        </view>
      </view>
    </view>
    <!-- 提示登录 -->
    <view>
      <uni-popup
        ref="popup_login"
        type="dialog"
      >
        <uni-popup-dialog
          type="info"
          mode="base"
          :title="popTit"
          :content="loginCont"
          before-close="true"
          @close="close"
          @confirm="login_confirm"
        />
      </uni-popup>
    </view>
    <!-- 购买状态 -->
    <view>
      <uni-popup
        ref="popup_open_status"
        type="dialog"
      >
        <purchaseIndex
          :btn-type="btnType"
          :video-mes="purchaseVideoMes"
          @isFinished="popIsFinished"
        />
      </uni-popup>
    </view>
    <!-- 视频遮罩层 -->
    <view class="mask-top" />
    <view class="mask-bottom" />
  </view>
</template>

<script>
import clVideoService from "@/api/clvideo/clvideo.js";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import purchaseIndex from "@/components/purchase-popup/index.vue";
import videoService from "@/api/cx/video.js";
export default {
  components: {
    uniPopup,
    uniPopupDialog,
    purchaseIndex,
  },
  data () {
    return {
      videoDetail: {},
      videoId: "",
      clid: 1,
      isFullScreen: true,
      popTit: "温馨提示",
      loginCont: "您还没有登录，请先完成登录",
      staticImgs: this.$staticImgs,
      userName: "您的好友",
      height: "",
      width: "",
      autoplay: true,
      isLogin: false,
      src: "",
      purchaseIndexIsShow: false,
      purchaseVideoMes: {},
      btnType: "",
      isClickLike: false,
      navMarginHeight: 0, // 自定义导航栏外边距
      navHeight: 0, // 自定义导航栏高度
    };
  },
  onLoad (options) {
    // console.log("clOpenShare");
    this.$analysis.dispatch("share_spcl");
    if (options.videoId) {
      // console.log('进入',options)
      this.videoId = options.videoId;
      // console.log('触发')
      // this.getVideoDetail();
    } else {
      uni.switchTab({
        url: "/pages/ck/index",
      });
    }
    // 根据胶囊外边距和高度计算自定义导航栏的外边距和高度
    this.navMarginHeight = uni.getMenuButtonBoundingClientRect().top;
    this.navHeight = uni.getMenuButtonBoundingClientRect().height;
  },
  async onShow () {
    await this.$getAuthInfo();
    // this.isLogin = uni.getStorageSync("Authorization");
    this.getVideoDetail();
    if (this.isFullScreen) {
      this.sysheight = (uni.getSystemInfoSync().windowHeight - 50) * 2;
      this.height = `${this.sysheight}rpx`;
      this.width = "100%";
    } else {
      this.height = "211px";
      this.width = "100%";
    }
  },
  onShareAppMessage: function (res) {
    console.log("res");

    this.$analysis.dispatch("cl_share", "视频彩铃");
    if (uni.getStorageSync("Authorization")) {
      const userInfo = uni.getStorageSync("userInfo");
      const phone = uni.getStorageSync("phone");

      if (userInfo) {
        this.userName = userInfo.nickName;
      } else {
        this.userName = phone.substring(0, 3) + "****" + phone.substring(7);
      }
    }
    const imageUrl = this.videoDetail.coverUrl || this.videoDetail.openVCoverUrl || this.videoDetail.openHCoverUrl;
    return {
      title: this.userName + "悄悄分享给您一个[视频彩铃]小程序，赶快去看看吧",
      path: "/pagesCommon/share/openShare?videoId=" + this.videoId,
      imageUrl,
    };
  },
  methods: {
    goHome () {
      uni.switchTab({
        url: "/pages/liaoNingFind/views/index",
      });
    },
    checkAuthorization () {
      if (uni.getStorageSync("Authorization")) {
        return true;
      }
      return false;
    },
    // 未开通签名弹窗关闭
    close (done) {
      done();
    },
    // 登录弹框确认
    login_confirm (done, value) {
      // 输入框的值
      uni.navigateTo({
        url: "/pagesD/my/login",
      });
      done();
    },
    getVideoDetail () {
      const data = {
        ringId: this.videoId,
      };
      videoService.getSpclVideoDetail(data).then((res) => {
        // console.log(res, "---===----");
        if (res.data.code === 200) {
          const tempList = res.data.data;
          if (uni.getStorageSync("Authorization") && uni.getStorageSync("userData")[0] && uni.getStorageSync("userData")[
            0].vrbtResponse) {
            const isBuyList = uni.getStorageSync("userData")[0].vrbtResponse;
            const isBuy = isBuyList.filter(
              (item) => tempList.ringId === item.ringId,
            );
            if (isBuy[0]) {
              tempList.isBuyVideo = true;
            }
          }
          this.videoDetail = tempList;
        }
      });
    },

    scEven (clid) {
      // console.log("scEven");
      // console.log(clid);
      const logFlag = this.checkAuthorization();
      if (logFlag == true) {
        clVideoService
          .favor({
            clid,
          })
          .then((resp) => {
            // console.log("favor");
            // console.log(resp);
            this.getVideoByIdJK(clid);
          });
      } else {
        this.$refs.popup_login.open();
      }
    },
    qxscEven (flag) {
      if (!uni.getStorageSync("Authorization")) {
        this.$refs.popup_login.open();
      } else {
        if (this.isClickLike) {
          return;
        }
        this.isClickLike = true;
        // 请求点赞接口
        let data = {
          ringId: this.videoId,
          target: "dz",
          opType: 1,
        };
        // 取消点赞
        if (flag) {
          data = {
            ringId: this.videoId,
            target: "dz",
            opType: 0,
          };
        }

        videoService.getSpclUserBehavior(data).then((res) => {
          this.isClickLike = false;
          if (res.data.code === 200) {
            if (res.data.data) {
              const specialNewsLists = this.videoDetail;
              // console.log(specialNewsLists);
              if (flag) {
                specialNewsLists.extraInfo.like = false;
                specialNewsLists.extraInfo.likeCount -= 1;
                uni.showToast({
                  title: "您已取消点赞",
                  icon: "none",
                  duration: 2000,
                });
              } else {
                specialNewsLists.extraInfo.like = true;
                specialNewsLists.extraInfo.likeCount += 1;
                uni.showToast({
                  title: "点赞成功",
                  icon: "none",
                  duration: 2000,
                });
              }
              this.$set(this.videoDetail, specialNewsLists);
            }
          } else {
            uni.showToast({
              title: res.data.message,
              icon: "none",
              duration: 2000,
            });
          }
        });
      }
    },
    // 查看详情
    seeDetail (seeDetail) {
      const logFlag = this.checkAuthorization();
      if (logFlag == true) {
        // this.$analysis.dispatch("seeDetail");
        uni.navigateTo({
          url: "/pages/clvideo/detail?videoList=" +
            encodeURIComponent(JSON.stringify(seeDetail)),
        });
      } else {
        this.$refs.popup_login.open();
      }
    },
    shareLogin () {
      if (!uni.getStorageSync("Authorization")) {
        this.$refs.popup_login.open();
      } else {
        // console.log('77777',this.videoId)
        this.$analysis.dispatch("spcl_share");
        uni.navigateTo({
          url: "/pagesCommon/share/shareVideo?videoId=" + this.videoId,
        });
      }
    },
    // 设为我的彩铃
    purchaseVideo (videoMes) {
      if (!uni.getStorageSync("Authorization")) {
        this.$refs.popup_login.open();
      } else {
        this.purchaseVideoMes = videoMes;
        this.btnType = "openAndPurchase";
        this.$refs.popup_open_status.open();
      }
    },
    // 订购完成
    popIsFinished (data) {
      if (data.videoId) {
        // 修改数据
        const tempList = this.videoDetail;
        if (tempList.ringId === data.videoId) {
          tempList.isBuyVideo = true;
        }
        this.videoDetail = tempList;
      }
      // console.log("结束");
      this.purchaseVideoMes = {};
      this.btnType = "";
      this.$refs.popup_open_status.close();
    },
  },
};
</script>
<style>
uni-page-body,
uni-page-refresh {
  height: 100%;
}
</style>
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

      .home {
        width: 35rpx;
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
        top: 175rpx;
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
        bottom: 190rpx;
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
          background: linear-gradient(to right, #ff6f50 0%, #ff008c 100%);
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

  .con-t-small {
    padding-top: 50rpx;

    .con-video {
      video {
        // width: 750rpx;
        // height: 422rpx;
        // background: #ffffff;
        margin-top: 30rpx;
      }

      .con-video-title {
        font-size: 28rpx;
        letter-spacing: 1rpx;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

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
          margin-top: 20rpx;
        }
      }

      .con-intro {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 66rpx;

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

        .buy-btn {
          width: 374rpx;
          height: 90rpx;
          background: linear-gradient(to right, #ff6f50 0%, #ff008c 100%);
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

  .con-f {
    position: fixed;
    bottom: 0;
    height: 100rpx;
    width: 100%;
    background: white;
    border-top: 1px solid #e6e7e9;

    .flex-view {
      width: 90%;
      height: 100%;
      margin-left: 5%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .icon-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .share-wx {
        margin-right: 60rpx;

        button {
          display: inline;
          padding: 0;
          font-size: 28rpx;
          line-height: normal;
          border-radius: 0;
          background: #ffffff;
          color: #999999;
          border: none;
          background-color: transparent;
          outline: none; //消除默认点击蓝色边框效果
          display: flex;
          align-items: center;
          flex-direction: column;

          image {
            width: 40rpx;
            height: 40rpx;
          }

          text {
            font-size: 28rpx;
            margin-left: 5rpx;
            color: #9e9e9e;
          }
        }
      }

      .sc-mang-even {
        display: flex;
        align-items: center;
        flex-direction: column;

        image {
          width: 40rpx;
          height: 40rpx;
        }

        text {
          font-size: 28rpx;
          color: #a2a2a2;
          margin-left: 5rpx;
        }
      }

      .szcl-btn {
        width: 300rpx;
        height: 78rpx;
        background: linear-gradient(#ff6f50 0%, #ff008c 100%);
        border-radius: 10rpx;
        font-size: 28rpx;
        font-family: PingFang SC Medium, PingFang SC Medium-Medium;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        line-height: 78rpx;
      }

      .is-buy-szcl-btn {
        width: 300rpx;
        height: 78rpx;
        background: #c6c5c8;
        border-radius: 10rpx;
        font-size: 28rpx;
        font-family: PingFang SC Medium, PingFang SC Medium-Medium;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        line-height: 78rpx;
      }
    }
  }

  .mask-top {
    position: absolute;
    width: 100%;
    height: 50%;
    top: 0rpx;
    left: 0rpx;
    background: linear-gradient(top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  }

  .mask-bottom {
    position: absolute;
    width: 100%;
    height: 40%;
    bottom: 100rpx;
    left: 0rpx;
    background: linear-gradient(bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  }
}
</style>
