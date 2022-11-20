<template>
  <view
    class="content"
    :style="{
      backgroundImage: 'url(' + `${staticImgs}/shxmp/init/share_bg.png` + ')',
    }"
  >
    <view v-if="poster.finalPath" class="poster-box y-f">
      <image :src="poster.finalPath" mode="widthFix" class="posterImage" />
      <view class="btns">
        <view class="share-mode">
          <view class="share-mode-wx">
            <button open-type="share">
              <view class="share-mode-wx-img">
                <img :src="`${staticImgs}/shxmp/init/share_wx.png`" />
              </view>
              <view class="share-mode-wx-title">分享给微信朋友</view>
            </button>
          </view>
          <view class="share-mode-wx" @click="sharePyq">
            <view class="share-mode-wx-img">
              <img :src="`${staticImgs}/shxmp/init/share_pyq.png`" />
            </view>
            <view class="share-mode-wx-title">保存分享朋友圈</view>
          </view>
        </view>
        <view class="close-btn" @click="goBack">
          <image :src="`${staticImgs}/shxmp/init/close.png`" />
        </view>
      </view>
      <!-- 遮罩 -->
      <view v-show="maskShow" class="mask" />
      <!-- toast弹窗 -->
      <view v-show="maskTxtShow" class="maskTxt">
        <view class="txt-cont">分享到朋友圈需要您的授权</view>
        <view class="btn-cont">
          <button class="btn-cancel" @click="closeSetPop">取消</button>
          <button class="btn-sure" open-type="openSetting" @click="closeSetPop">
            前往设置
          </button>
        </view>
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
  data() {
    return {
      poster: {},
      canvasId: "goods_poster",
      scene: "",
      staticImgs: this.$staticImgs,
      qrCodeUrl: `${this.globalData.staticImgs}/shxmp/init/qr.jpg`, // 二维码图片
      videoDetail: {},
      maskShow: false,
      maskTxtShow: false,
      userName: "",
      shareCont: "",
      period: "",
      screenWidth: "",
      videoId: "",
      phoneNumber: "",
      pageName: "",
      pageFirstLoad: true, // 是否第一次加载页面
      shareType: 1, // 分享类型，1是视频彩铃，其他值是音频彩铃
    };
  },
  onLoad(options) {
    this.initData(options);
  },
  async onShow() {
    // await this.$getAuthInfo();
    if (!this.pageFirstLoad) {
      this.initData();
    }
  },
  onHide() {
    this.pageFirstLoad = false;
    uni.hideLoading();
  },
  onShareAppMessage(res) {
    this.$analysis.dispatch("spcl_share");
    if (res.from === "button") {
      console.log("button");
      // 来自页面内分享按钮
      const data = {
        ringId: this.videoId,
        target: "fx",
        opType: 1,
      };
      videoService.getSpclUserBehavior(data).then(res => {
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
    // 初始化页面数据
    initData(options) {
      // if (uni.getStorageSync("Authorization")) return;
      this.videoId = options?.videoId || "600926000002698008";
      this.pageName = options?.pageName;
      this.shareType = parseInt(options?.shareType);
      const userInfo = uni.getStorageSync("userInfo");
      const phone = uni.getStorageSync("phone") || "13006463380";
      this.$loading("绘制中");
      this.getVideoDetail().then(() => {
        if (phone) {
          this.avatarUrl =
            userInfo.avatarUrl ||
            `${this.globalData.staticImgs}/shxmp/init/avater_def.png`;
          this.userName =
            userInfo.nickName ||
            `${phone.substring(0, 3)}****${phone.substring(7)}`;
          this.phoneNumber = phone;
          // this.qrcodeJk();
          // 自测开始
          this.shareFc();
          // 自测结束
        }
      });
    },
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    // 获取二维码
    qrcodeJk() {
      // 二维码页面
      const shareVideoUrl = encodeURI(
        `/pagesCommon/share/openShare?phonenumber=${this.phoneNumber}&videoId=${this.videoId}`,
      );
      const shareClUrl = encodeURI(
        `/pagesCommon/share/openShare?phonenumber=${this.phoneNumber}&videoId=${this.videoId}`,
      );
      const mpath = this.shareType === 1 ? shareVideoUrl : shareClUrl;
      ShareService.qrcode({
        path: mpath,
        width: "430",
      }).then(resp => {
        this.qrCodeUrl = resp.data;
        setTimeout(() => {
          this.qrToImg();
        }, 500);
      });
    },
    // 二维码转化成图片
    qrToImg() {
      const urlStr = this.qrCodeUrl;
      // 小程序二维码图片
      const fsm = uni.getFileSystemManager();
      let showImgData = urlStr;
      showImgData = showImgData.replace(/\\+/g, ""); // 去掉空格方法
      showImgData = showImgData.replace(/[\r\n]/g, "");
      const buffer = wx.base64ToArrayBuffer(showImgData);
      const fileName = `${wx.env.USER_DATA_PATH}/share_img_${
        Math.random() * 1000000
      }.png`;
      fsm.writeFileSync(fileName, buffer, "binary");
      this.qrCodeUrl = fileName;
      this.shareFc();
    },
    // 获取视频彩铃详情
    getVideoDetail() {
      const data = {
        ringId: this.videoId,
      };
      return new Promise((resolve, reject) => {
        videoService.getSpclVideoDetail(data).then(res => {
          if (res.data.code === 200) {
            this.videoDetail = res.data.data;
            resolve(this.videoDetail);
          } else {
            reject();
          }
        });
      });
    },
    // 关闭去设置弹窗
    closeSetPop() {
      this.maskShow = false;
      this.maskTxtShow = false;
    },
    async shareFc() {
      let _this = this;
      try {
        const d = await getSharePoster({
          _this: _this, // 若在组件中使用 必传
          alpha: 0.92,
          posterCanvasId: this.canvasId, // canvasId
          // backgroundImage: `${this.globalData.staticImgs}/shxmp/init/share_bg.png`, // 接口返回的背景图
          delayTimeScale: 20, // 延时系数
          drawDelayTime: 500, // draw延时时间
          background: {
            height: 1031, //画布高度
            width: 580, //画布宽度
            backgroundColor: "#ffffff", //画布背景颜色
          },
          drawArray: ({ bgObj, type, bgScale, setBgObj }) =>
            this.setDrawSpArray({ bgObj, type, bgScale, setBgObj }),
          setCanvasWH: ({ bgObj }) => {
            // 为动态设置画布宽高的方法，
            this.poster = bgObj;
            // this.shareType === 1
            // ? this.setDrawSpArray({ bgObj, type, bgScale })
            // : this.setDrawYpArray({ bgObj, type, bgScale }),
          },
        });
        console.log(
          "海报生成成功, 时间:" +
            new Date() +
            "， 临时路径: " +
            d.poster.tempFilePath,
        );
        this.$set(this.poster, "finalPath", d.poster.tempFilePath);
        // 要删除本地文件
        uni.getFileSystemManager().unlink({
          filePath: this.qrCodeUrl,
          fail: err => {
            console.log("删除失败", err);
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
    // 设置音频海报的绘制元素
    setDrawYpArray({ bgObj }) {
      // const dx = bgObj.width * 0.3;
      // const fontSize = bgObj.width * 0.042;
      // const lineHeight = bgObj.height * 0.04;
      // 位置 ：背景宽*x=当前元素位置（高保上 比如距离顶部20rpx）,x = 20/背景宽
      // 宽度 ：背景宽*x=当前元素宽度（高保上 元素宽为100rpx）,x = 100/背景宽
      // 可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
      const coverUrl = Util.forwardingURL(
        this.videoDetail.coverUrl ||
          this.videoDetail.openVCoverUrl ||
          this.videoDetail.openHCoverUrl,
      );
      const shareUrl = `${this.globalData.staticImgs}/shxmp/init/share_icon.png`;
      return new Promise(resolve => {
        resolve([
          // 封面图
          this.handleCoverImg(
            coverUrl,
            bgObj.width * 0.05,
            bgObj.width * 0.05,
            bgObj.width * 0.9,
            bgObj.width * 1.32,
          ),
          // 头像
          this.handleHeadImg(bgObj),
          // 昵称
          this.handleText(
            this.userName,
            "32",
            "#333",
            bgObj.width * 0.063,
            bgObj.width * 1.465,
            "bold",
          ),
          // 描述
          this.handleText(
            "向您推荐了热门榜单-经典老歌",
            "22",
            "#666",
            bgObj.width * 0.063,
            bgObj.width * 1.541,
          ),
          // 二维码
          this.handleCoverImg(
            this.qrCodeUrl,
            bgObj.width * 0.74,
            bgObj.width * 1.525,
            bgObj.width * 0.206,
            bgObj.width * 0.206,
          ),
          // 铃机一动图片
          this.handleCoverImg(
            shareUrl,
            bgObj.width * 0.063,
            bgObj.width * 1.608,
            bgObj.width * 0.237,
            bgObj.width * 0.098,
          ),
          // 描述
          this.handleText(
            "赶紧扫码体验吧~",
            "22",
            "#666",
            bgObj.width * 0.063,
            bgObj.width * 1.739,
          ),
        ]);
      });
    },
    // 设置视频彩铃海报的绘制元素
    setDrawSpArray({ bgObj }) {
      let url =
        this.videoDetail.coverUrl ||
        this.videoDetail.openVCoverUrl ||
        this.videoDetail.openHCoverUrl;
      const coverUrl = Util.forwardingURL(url);
      const shareUrl = `${this.globalData.staticImgs}/shxmp/init/share_icon.png`;
      const playUrl = `${this.globalData.staticImgs}/shxmp/init/play.png`;
      return new Promise(resolve => {
        resolve([
          // 封面图
          this.handleCoverImg(
            coverUrl,
            0,
            0,
            bgObj.width * 1,
            bgObj.height * 1,
          ),
          // 底部白色透明钜形
          this.handleFillRect(
            "#fff",
            0.9,
            0,
            bgObj.height * 0.76,
            bgObj.width * 1,
            bgObj.width * 0.428,
          ),
          // 播放按钮
          this.handleCoverImg(
            playUrl,
            bgObj.width * 0.391,
            bgObj.height * 0.373,
            bgObj.width * 0.219,
            bgObj.width * 0.219,
          ),
          // 头像
          this.handleHeadImg(bgObj),
          // 昵称
          this.handleText(
            this.userName,
            "32",
            "#222",
            bgObj.width * 0.066,
            bgObj.height * 0.82,
          ),
          // 描述
          this.handleText(
            "向您推荐了一首视频彩铃",
            "26",
            "#666",
            bgObj.width * 0.066,
            bgObj.height * 0.86,
            "",
            0.8,
          ),
          // 二维码
          this.handleCoverImg(
            this.qrCodeUrl,
            bgObj.width * 0.726,
            bgObj.height * 0.825,
            bgObj.width * 0.19,
            bgObj.width * 0.19,
          ),
          // 铃机一动图片
          this.handleCoverImg(
            shareUrl,
            bgObj.width * 0.067,
            bgObj.height * 0.925,
            bgObj.width * 0.245,
            bgObj.width * 0.085,
          ),
          // 描述
          this.handleText(
            "赶紧扫码体验吧~",
            "22",
            "#222222",
            bgObj.width * 0.676,
            bgObj.height * 0.952,
          ),
        ]);
      });
    },
    // 处理封面图
    handleCoverImg(url, dx, dy, dWidth, dHeight) {
      return {
        type: "image",
        url,
        dx,
        dy,
        infoCallBack() {
          return {
            dWidth,
            dHeight,
          };
        },
      };
    },
    // 处理头像
    handleHeadImg(bgObj) {
      return {
        type: "image",
        url: this.avatarUrl,
        alpha: 1,
        dx: bgObj.width * 0.07,
        dy: bgObj.width * 1.282,
        infoCallBack(imageInfo) {
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
      };
    },
    // 处理文字
    handleText(text, size, color, dx, dy, fontWeight = "", alpha = 1) {
      return {
        type: "text", // 昵称
        text,
        size,
        color,
        alpha,
        textAlign: "middle",
        textBaseline: "middle",
        fontWeight,
        infoCallBack() {
          return {
            dx,
            dy,
          };
        },
        serialNum: 0,
      };
    },
    // 处理填充型钜形
    handleFillRect(backgroundColor, alpha, dx, dy, width, height) {
      return {
        type: "fillRect",
        backgroundColor,
        alpha,
        dx,
        dy,
        width,
        height,
      };
    },
    // 点击分享朋友圈，保存海报
    sharePyq() {
      this.$analysis.dispatch("spcl_share");
      const that = this;
      uni.getSetting({
        success(res) {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            uni.authorize({
              scope: "scope.writePhotosAlbum",
              success() {
                that.saveImage();
              },
              fail() {
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
    uploadData() {},
    // 保存图片
    saveImage() {
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
          this.$store
            .dispatch("spcl/handleSpclUserOperate", data)
            .then(() => this.$toast("海报已保存到本地相册"));
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
  margin-bottom: 120rpx;
  display: flex;
  flex-direction: column;
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
  .close-btn {
    width: 33rpx;
    height: 34rpx;
    margin-top: 78rpx;
    image {
      width: 100%;
      height: 100%;
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
</style>
