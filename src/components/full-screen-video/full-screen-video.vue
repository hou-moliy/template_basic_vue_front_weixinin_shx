<template>
  <view v-if="videoHeight" class="full-page">
    <!-- 视频彩铃内容 -->
    <view class="video-box">
      <cl-video
        v-if="videoDetail.ringFilePath"
        ref="clVideo"
        class="video"
        :src="videoDetail.ringFilePath"
        :height="videoHeight"
        :width="videoWidth"
        :play="true"
        :g-duration="videoDetail.duration"
        :initial-time="videoDetail.initialTime"
        :video-id="videoDetail.ringId"
        :object-fit="videoDetail.objectFit"
      >
        <view v-if="actions.set" class="view-left">
          <view class="left-view">
            <view class="left-text">
              {{ videoDetail.ringName }}
            </view>
            <view v-if="videoDetail.isBuyVideo" class="setted-video">
              已设置
            </view>
            <view v-else class="set-box">
              <view class="inner-box" @click="setSpcl(videoDetail)">
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
        </view>
        <view class="view-right">
          <view v-if="actions.preview" class="right-icon">
            <image
              v-show="step !== 2"
              :src="`${staticImgs}/shxmp/init/video-preview.png`"
              class="preview-img img"
              @click="previewVideo(videoDetail.ringId)"
            />
            <view class="right-text">呼叫预览</view>
          </view>
          <!-- 取消点赞 -->
          <view
            v-if="actions.like && videoDetail.extraInfo.like"
            class="right-icon"
          >
            <image
              :src="`${staticImgs}/shxmp/init/video-dzed.png`"
              :data-videoId="videoDetail.ringId"
              class="other-img img"
              @click="changeLikeStatus(0)"
            />
            <view class="right-text">
              {{ formatCount(videoDetail.extraInfo.likeCount) }}
            </view>
          </view>
          <!-- 点赞 -->
          <view
            v-if="actions.like && !videoDetail.extraInfo.like"
            class="right-icon"
          >
            <image
              :src="`${staticImgs}/shxmp/init/video-dz.png`"
              class="other-img img"
              @click="changeLikeStatus(1)"
            />
            <view class="right-text">
              {{ formatCount(videoDetail.extraInfo.likeCount) }}
            </view>
          </view>
          <view v-if="actions.share" class="right-icon">
            <image
              :src="`${staticImgs}/shxmp/init/video-share.png`"
              class="other-img img"
              @click="shareEvent(videoDetail.ringId)"
            />
            <view class="right-text">
              {{ formatCount(videoDetail.extraInfo.shareCount) }}
            </view>
          </view>
        </view>
      </cl-video>
      <image
        v-else
        style="background: #000"
        :src="videoDetail.coverImageUrl"
        class="cover_image"
        mode="aspectFit"
      />
      <view v-if="isNewIphone" class="blank-space" />
    </view>
    <!-- 提示性弹窗 -->
    <notifyPop ref="NotifyPop" />
  </view>
</template>
<script>
import clVideo from "@/components/cl-video/cl-video.vue";
import { formatCount } from "@/utils/tools.js";
export default {
  components: {
    clVideo,
  },
  props: {
    item: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      userName: "您的好友",
      videoHeight: "", // 播放器高度
      videoWidth: "", // 播放器宽度
      navMarginHeight: 0, // 自定义导航栏外边距
      navHeight: 0, // 自定义导航栏高度
      actions: {
        set: true,
        like: true,
        share: true,
        preview: true,
      }, // 是否展示设置按钮，默认展示
      isNewIphone: false,
      videoDetail: null,
    };
  },
  created () {
    this.initStyle();
    this.videoDetail = this.item;
  },
  methods: {
    formatCount,
    // 初始化样式
    initStyle () {
      this.getSystemData().then((res) => {
        this.isNewIphone = res.safeArea.top === 44;
        // 播放器展示高度、宽度
        this.videoHeight = `${res.windowHeight}px`;
        this.videoWidth = `${res.windowWidth}px`;
      });
    },
    // 获取系统信息
    getSystemData () {
      return new Promise((resolve) => {
        uni.getSystemInfo({
          success: (res) => {
            resolve(res);
          },
        });
      });
    },
    // 预览
    previewVideo (ringId) {
      if (!uni.getStorageSync("Authorization")) {
        // 提示登录
        return this.$showLoginPop(this);
      }
      // 进入预览页面
      uni.navigateTo({
        url: `/pagesSpcl/clVideo/clVideoPreview?videoId=${ringId}`,
      });
    },
    // 设置视频彩铃
    setSpcl (items) {
      if (!uni.getStorageSync("Authorization")) {
        // 提示登录
        return this.$showLoginPop(this);
      }
      //  打开视频彩铃设置弹窗
    },
    // 点赞 OR 取消点赞
    changeLikeStatus (opType) {
      if (!uni.getStorageSync("Authorization")) {
        // 提示登录
        return this.$showLoginPop(this);
      }
      const data = {
        ringId: this.videoDetail.ringId,
        target: "dz",
        opType,
      };
      this.$store.dispatch("spcl/handleSpclUserOperate", data).then(res => {
        if (res.code === 200) {
          // opType === 1 ? this.$toast("点赞成功") : this.$toast("取消点赞成功");
          if (opType === 1) {
            this.$toast("点赞成功");
            // 更新我的喜欢列表
            uni.$emit("changeMyLikeList", {
              dz: true,
              videoMsg: this.videoDetail,
            });
            // 将当前数据改了
            this.videoDetail.extraInfo.like = true;
            this.videoDetail.extraInfo.likeCount += 1;
            // 更新仓库里的数据
            const index = this.$store.state.spcl.videoList.findIndex(i => i.ringId === this.videoDetail.ringId);
            const list = this.$store.state.spcl.videoList;
            list[index] = this.videoDetail;
            this.$store.commit("spcl/M_changeVideoList", list);
            // 更新更多精彩数据
            this.changeStoreLike(this.$store.state.spcl.moreVideoList, "spcl/getMoreVideoList");
            // 更新视彩分类视频列表
            this.changeStoreLike(this.$store.state.spcl.videoListFromCxVideoType, "spcl/getVideoListFromCxVideoType");
            // 更新搜索数据
            this.changeStoreLike(this.$store.state.spcl.searchList, "spcl/getSearchList");
          } else {
            this.$toast("取消点赞成功");
            // 修改当前数据 更新仓库
            this.videoDetail.extraInfo.like = false;
            this.videoDetail.extraInfo.likeCount -= 1;
            const videoIndex = this.$store.state.spcl.videoList.findIndex(i => i.ringId === this.videoDetail.ringId);
            const list = this.$store.state.spcl.videoList;
            list[videoIndex] = this.videoDetail;
            this.$store.commit("spcl/M_changeVideoList", list);
            // 更新我的喜欢列表
            const myLikeVideoListTemp = this.$store.state.spcl.myLikeVideoList;
            const myLikeIndex = myLikeVideoListTemp.indexOf(this.videoDetail.ringId);
            if (myLikeIndex >= 0) {
              myLikeVideoListTemp[myLikeIndex] = "";
              this.$store.commit("spcl/getMyLikeVideoList", myLikeVideoListTemp);
              uni.$emit("changeMyLikeList", {
                dz: false,
                videoid: this.videoDetail.ringId,
              });
            };
            // 更新更多精彩数据
            this.changeStoreLike(this.$store.state.spcl.moreVideoList, "spcl/getMoreVideoList");
            // 更新视彩分类视频列表
            this.changeStoreLike(this.$store.state.spcl.videoListFromCxVideoType, "spcl/getVideoListFromCxVideoType");
            // 更新搜索数据
            this.changeStoreLike(this.$store.state.spcl.searchList, "spcl/getSearchList");
          }
        } else {
          this.$toast(res.message);
        }
      });
    },
    // 更新vux关于like
    changeStoreLike (typeVideoList, storeMutations) {
      const currentVideoId = this.videoDetail.ringId;
      const videoList = typeVideoList;
      const currentIndex = videoList.findIndex(
        (item) => currentVideoId === item.ringId,
      );
      if (currentIndex > -1) {
        videoList[currentIndex].extraInfo.likeCount += 1;
        videoList[currentIndex].extraInfo.like = true;
        this.$store.commit(storeMutations, videoList);
      }
    },
    // 分享到微信或者朋友圈
    shareEvent (ringId) {
      if (!uni.getStorageSync("Authorization")) {
        // 提示登录
        return this.$showLoginPop(this);
      }
      const data = {
        ringId,
        target: "fx",
      };
      this.$store.dispatch("spcl/handleSpclUserOperate", data).then(() => {
        const url = `/pagesCommon/share/shareVideo?videoId=${ringId}&pageName=videoPlay&shareType=1`;
        uni.navigateTo({
          url,
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.full-page {
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
  margin-bottom: 20upx;
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
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
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
  width: 90rpx;
  height: 71rpx;
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
  font-family: PingFang SC, PingFang SC-Medium;
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
  border-radius: 50upx;
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
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
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
  background: linear-gradient(top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
}

.mask-bottom {
  position: absolute;
  width: 100%;
  height: 50%;
  bottom: 0rpx;
  left: 0rpx;
  background: linear-gradient(bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
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
  border: 4rpx solid #9e79ff;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  box-shadow: 0 0 0 6rpx #9e79ff; /* 阴影效果 */
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
  width: 107rpx;
  height: 107rpx;
  background: linear-gradient(-60deg, #ff45d5 0%, #485eff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
