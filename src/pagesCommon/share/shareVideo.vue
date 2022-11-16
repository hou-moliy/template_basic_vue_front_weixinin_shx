<template>
  <view
    class="content"
    :style="{
      backgroundImage: 'url(' + `${staticImgs}/lnmp/shareMuisc-bj.png` + ')',
    }"
  >
    <view
      v-if="poster.finalPath"
      class="poster-box y-f"
    >
      <image
        :src="poster.finalPath"
        mode="widthFix"
        class="posterImage"
      />
      <view class="btns">
        <view class="share-mode">
          <view class="share-mode-wx">
            <button open-type="share">
              <view class="share-mode-wx-img">
                <img :src="`${staticImgs}/lnmp/shareMuisc-wx.png`">
              </view>
              <view class="share-mode-wx-title">
                分享给朋友
              </view>
            </button>
          </view>
          <view
            class="share-mode-wx"
            @click="sharePyq"
          >
            <view class="share-mode-wx-img">
              <img :src="`${staticImgs}/lnmp/shareMuisc-pyq.png`">
            </view>
            <view class="share-mode-wx-title">
              保存分享到朋友圈
            </view>
          </view>
        </view>
      </view>
      <!-- 遮罩 -->
      <view
        v-show="maskShow"
        class="mask"
      />
      <!-- toast弹窗 -->
      <view
        v-show="maskTxtShow"
        class="maskTxt"
      >
        <view class="txt-cont">
          分享到朋友圈需要您的授权
        </view>
        <view class="btn-cont">
          <button
            class="btn-cancel"
            @click="closeSetPop"
          >
            取消
          </button>
          <button
            class="btn-sure"
            open-type="openSetting"
            @click="closeSetPop"
          >
            前往设置
          </button>
        </view>
      </view>
      <!-- 提示成功 -->
      <view
        v-show="maskBCTxt"
        class="maskBCTxt"
      >
        海报已保存至本地相册
      </view>
    </view>
    <view class="hideCanvasView">
      <canvas
        class="hideCanvas"
        canvas-id="goods_poster"
        :style="{
          width: (poster.width || 1) + 'px',
          height: (poster.height || 1) + 'px',
        }"
      />
    </view>
  </view>
</template>

<script>
import { getSharePoster } from "@/utils/QS-SharePoster/QS-SharePoster.js";
import ShareService from "@/api/share/share.js";
import videoService from "@/api/cx/video.js";
import Util from "@/utils/tools.js";
export default {
  components: {},
  data () {
    return {
      poster: {},
      canvasId: "goods_poster",
      scene: "",
      staticImgs: this.$staticImgs,
      qrCodeUrl: "", // 二维码图片
      videoDetail: {},
      maskShow: false,
      maskTxtShow: false,
      maskBCTxt: false,
      userName: "",
      shareCont: "",
      period: "",
      screenWidth: "",
      videoId: "",
      phoneNumber: "",
      pageName: "",
      pageFirstLoad: true,
    };
  },
  onLoad (options) {
    // 自测开始
    this.videoId = "600926000002698008";
    this.getVideoDetail();
    this.shareFc();
    // 自测结束

    if (uni.getStorageSync("Authorization")) {
      if (options.videoId) {
        this.videoId = options.videoId;
        this.getVideoDetail();
      }
      uni.showLoading({
        title: "绘制中...",
      });
      if (options.pageName) {
        this.pageName = options.pageName;
      } else {
        this.pageName = "";
      }
      const userInfo = uni.getStorageSync("userInfo");
      const phone = uni.getStorageSync("phone");
      if (phone) {
        if (userInfo) {
          this.avatarUrl = userInfo.avatarUrl;
          this.userName = userInfo.nickName;
        } else {
          this.userName = phone.substring(0, 3) + "****" + phone.substring(7);
          this.avatarUrl = `${this.globalData.staticImgs}/lnmp/avater_def.png`;
        }
        this.phoneNumber = phone;
        this.qrcodeJk();
      }
    }
  },
  async onShow () {
    // await this.$getAuthInfo();
    if (!this.pageFirstLoad) {
      if (uni.getStorageSync("Authorization")) {
        this.getVideoDetail();
        uni.showLoading({
          title: "绘制中...",
        });
        const userInfo = uni.getStorageSync("userInfo");
        const phone = uni.getStorageSync("phone");
        if (phone) {
          if (userInfo) {
            this.avatarUrl = userInfo.avatarUrl;
            this.userName = userInfo.nickName;
          } else {
            this.userName = phone.substring(0, 3) + "****" + phone.substring(7);
            this.avatarUrl = `${this.globalData.staticImgs}/lnmp/avater_def.png`;
          }
          this.phoneNumber = phone;
          this.qrcodeJk();
        }
      }
    }
  },
  onHide () {
    this.pageFirstLoad = false;
    uni.hideLoading();
  },
  onShareAppMessage (res) {
    this.$analysis.dispatch("spcl_share");
    if (res.from === "button") {
      console.log("button");
      // 来自页面内分享按钮
      const data = {
        ringId: this.videoId,
        target: "fx",
        opType: 1,
      };
      videoService.getSpclUserBehavior(data).then((res) => {
        if (res.data.code == 200) {
          this.uploadData();
        } else {
          uni.showToast({
            title: "分享失败，请稍后再试",
            icon: "none",
            duration: 2000,
          });
        }
      });
    }
    console.log("no-button");
    console.log(this.pageName, "tempVideoList");
    return {
      title: this.userName + "分享给您一首视频彩铃，赶快去看看吧～",
      path: "/pagesCommon/share/openShare?videoId=" + this.videoId,
      imageUrl: this.videoDetail.coverUrl,
    };
  },
  methods: {
    // 获取二维码
    qrcodeJk () {
      const that = this;
      // 二维码页面
      const mpath = encodeURI(
        "/pagesCommon/share/openShare?phonenumber=" +
        this.phoneNumber +
        "&videoId=" +
        this.videoId,
      );
      ShareService
        .qrcode({
          path: mpath,
          width: "430",
        })
        .then((resp) => {
          this.qrCodeUrl = resp.data;
          setTimeout(() => {
            that.qrToImg();
          }, 500);
        });
    },
    // 二维码转化成图片
    qrToImg () {
      const urlStr = this.qrCodeUrl;
      // 小程序二维码图片
      const fsm = uni.getFileSystemManager();
      let showImgData = urlStr;
      showImgData = showImgData.replace(/\\+/g, ""); // 去掉空格方法
      showImgData = showImgData.replace(/[\r\n]/g, "");
      const buffer = wx.base64ToArrayBuffer(showImgData);
      const fileName = `${wx.env.USER_DATA_PATH}/share_img_${Math.random() * 1000000}.png`;
      fsm.writeFileSync(fileName, buffer, "binary");
      this.qrCodeUrl = fileName;
      this.shareFc();
    },
    // 获取视频彩铃详情
    getVideoDetail () {
      const data = {
        ringId: this.videoId,
      };
      videoService.getSpclVideoDetail(data).then((res) => {
        if (res.data.code === 200) {
          this.videoDetail = res.data.data;
        }
      });
    },
    // 关闭去设置弹窗
    closeSetPop () {
      this.maskShow = false;
      this.maskTxtShow = false;
    },
    async shareFc () {
      try {
        const d = await getSharePoster({
          _this: this, // 若在组件中使用 必传
          alpha: 0.92,
          backgroundImage: `${this.globalData.staticImgs}/lnmp/shareVideo-bg.png`, // 接口返回的背景图
          formData: {
            // 访问接口获取背景图携带自定义数据
          },
          posterCanvasId: this.canvasId, // canvasId
          delayTimeScale: 20, // 延时系数
          drawDelayTime: 500, // draw延时时间
          drawArray: ({ bgObj, type, bgScale }) => this.setDrawArray({ bgObj, type, bgScale }),
          setCanvasWH: ({ bgObj, type, bgScale }) => {
            // 为动态设置画布宽高的方法，
            this.poster = bgObj;
          },
        });
        // console.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + d.poster.tempFilePath);
        this.$set(this.poster, "finalPath", d.poster.tempFilePath);
        // 要删除本地文件
        uni.getFileSystemManager().unlink({
          filePath: this.qrCodeUrl,
          success: (res) => {
          },
          fail: (err) => {
            console.log("删除失败", err);
          },
        });
      } catch (e) { }
    },
    // 设置海报的绘制元素
    setDrawArray ({ bgObj, type, bgScale }) {
      // const dx = bgObj.width * 0.3;
      // const fontSize = bgObj.width * 0.042;
      // const lineHeight = bgObj.height * 0.04;
      // 可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
      return new Promise((resolve) => {
        resolve([
          {
            type: "image", // 封面图
            url: Util.forwardingURL(
              this.videoDetail.coverUrl ||
              this.videoDetail.coverUrl ||
              this.videoDetail.openVCoverUrl ||
              this.videoDetail.openVCoverUrl ||
              this.videoDetail.openHCoverUrl,
            ),
            alpha: 1,
            mode: "aspectFill",
            drawDelayTime: 800, // draw延时时间
            dx: bgObj.width * 0,
            dy: bgObj.width * 0,
            infoCallBack (imageInfo) {
              return {
                dWidth: bgObj.width * 1,
                dHeight: bgObj.width * 1.37,
              };
            },
          },
          {
            type: "image", // 播放按钮
            url: `${this.globalData.staticImgs}/lnmp/play.png`,
            alpha: 1,
            drawDelayTime: 800, // draw延时时间
            dx: bgObj.width * 0.395,
            dy: bgObj.width * 0.721,
            infoCallBack (imageInfo) {
              return {
                dWidth: bgObj.width * 0.211,
                dHeight: bgObj.width * 0.211,
              };
            },
          },
          {
            type: "image", // 头像
            url: this.avatarUrl,
            alpha: 1,
            dx: bgObj.width * 0.063,
            dy: bgObj.width * 1.295,
            infoCallBack (imageInfo) {
              const scale = (bgObj.width * 0.127) / imageInfo.height;
              return {
                circleSet: {
                  x: (imageInfo.width * scale) / 2,
                  y: (bgObj.width * 0.127) / 2,
                  r: (bgObj.width * 0.127) / 2,
                }, // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
                dWidth: imageInfo.width * scale, // 因为设置了圆形图片 所以要乘以2
                dHeight: bgObj.width * 0.127,
              };
            },
          },
          {
            type: "text", // 昵称
            text: this.userName,
            size: "32",
            color: "#333",
            alpha: 1,
            textAlign: "middle",
            textBaseline: "middle",
            fontWeight: "bold",
            infoCallBack (textLength) {
              return {
                dx: bgObj.width * 0.063,
                dy: bgObj.width * 1.465,
              };
            },
            serialNum: 0,
            id: "tag1", // 自定义标识
          },
          // 描述
          {
            type: "text",
            text: "向您推荐了一首视频彩铃",
            size: "24",
            color: "#666",
            alpha: 1,
            textAlign: "middle",
            textBaseline: "middle",
            infoCallBack (textLength) {
              return {
                dx: bgObj.width * 0.063,
                dy: bgObj.width * 1.541,
              };
            },
            serialNum: 0,
            id: "tag1", // 自定义标识
          },
          // 二维码
          {
            type: "image",
            url: this.qrCodeUrl,
            alpha: 1,
            drawDelayTime: 800, // draw延时时间
            dx: bgObj.width * 0.74,
            dy: bgObj.width * 1.465,
            infoCallBack (imageInfo) {
              return {
                dWidth: bgObj.width * 0.206,
                dHeight: bgObj.width * 0.206,
              };
            },
          },
          // 手机符号
          {
            type: "image",
            url: `${this.globalData.staticImgs}/lnmp/share-phone.png`,
            alpha: 1,
            drawDelayTime: 800, // draw延时时间
            dx: bgObj.width * 0.063,
            dy: bgObj.width * 1.638,
            infoCallBack (imageInfo) {
              return {
                dWidth: bgObj.width * 0.237,
                dHeight: bgObj.width * 0.098,
              };
            },
          },
          {
            type: "text", // 描述
            text: "立即扫码观看",
            size: "22",
            color: "#666",
            alpha: 1,
            textAlign: "middle",
            textBaseline: "middle",
            infoCallBack (textLength) {
              return {
                dx: bgObj.width * 0.735,
                dy: bgObj.width * 1.689,
              };
            },
            serialNum: 0,
            id: "tag1", // 自定义标识
          },
        ]);
      });
    },
    // 点击分享朋友圈，保存海报
    sharePyq () {
      this.$analysis.dispatch("spcl_share");
      const that = this;
      uni.getSetting({
        success (res) {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            uni.authorize({
              scope: "scope.writePhotosAlbum",
              success () {
                that.saveImage();
              },
              fail () {
                // 用户拒绝了授权，弹出设置弹窗，
                that.maskShow = true;
                that.maskTxtShow = true;
              },
            });
          } else {
            that.saveImage();
          }
        },
      });
    },
    // 更新数据
    uploadData () {
    },
    // 保存图片
    saveImage () {
      if (!this.poster.finalPath) {
        return;
      }
      uni.saveImageToPhotosAlbum({
        filePath: this.poster.finalPath,
        success: () => {
          // 记录
          const data = {
            ringId: this.videoId,
            target: "fx",
            opType: 1,
          };
          this.$store.dispatch("spcl/handleSpclUserOperate", data).then(() => this.$toast("海报已保存到本地相册"));
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}

.content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  .bg_img {
    width: 100%;
    height: 100%;
  }

  .poster-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 45rpx;

    .posterImage {
      width: 600rpx;
    }
  }
}

.hideCanvasView {
  position: relative;
}

.hideCanvas {
  position: fixed;
  top: -99999upx;
  left: -99999upx;
  z-index: -99999;
}

.btns {
  width: 100%;
  margin-top: 60rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .share-hy {
    image {
      width: 32rpx;
      height: 26rpx;
    }

    text {
      margin-left: 11rpx;
    }
  }
  .share-mode {
    margin: 0 131rpx;
    // height: 240rpx;
    color: #fff;
    display: flex;
    justify-content: space-between;
    .share-mode-wx {
      width: 278rpx;
      height: 100%;
      display: flex;
      flex-direction: column;
      // justify-content: space-between;
      align-items: center;
      .share-mode-wx-img {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100rpx;
          height: 100rpx;
        }
      }
      .share-mode-wx-title {
        font-size: 26rpx;
        margin-top: 28rpx;
        color: #fff;
      }
      button {
        display: inline;
        padding: 0;
        font-size: 28rpx;
        line-height: normal;
        border-radius: 0;
        background-color: transparent;
        border: none;
      }
      button::after {
        border: none;
      }
    }
  }
}

.mask {
  position: fixed;
  background: rgba(0, 0, 0, 1);
  opacity: 0.5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
}

.maskTxt {
  position: fixed;
  z-index: 1002;
  bottom: 30%;
  left: 50%;
  width: 80%;
  text-align: center;
  background: white;
  border-radius: 10rpx;
  transform: translate(-50%, -50%);

  .txt-cont {
    color: rgba(51, 51, 51, 1);
    font-size: 28rpx;
    padding-top: 60rpx;
    padding-bottom: 60rpx;
  }

  .btn-cont {
    display: flex;

    button {
      width: 50%;
      border-radius: 0;
      border-left: 1rpx solid #ddd;
      border-top: 1px solid #ddd;
      border-bottom-left-radius: 10rpx;
      border-bottom-right-radius: 10rpx;
      font-size: 31rpx;
      color: #333333;
    }

    button::after {
      border: none;
    }

    .btn-cancel {
    }

    .btn-sure {
      color: rgba(255, 183, 56, 1);
    }
  }
}

.maskBCTxt {
  position: fixed;
  background: black;
  opacity: 0.7;
  z-index: 1003;
  color: white;
  top: 45%;
  left: 15%;
  width: 70%;
  height: 78rpx;
  text-align: center;
  line-height: 75rpx;
  font-size: 30rpx;
}
</style>
