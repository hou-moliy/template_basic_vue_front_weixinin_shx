<template>
  <view v-if="videoHeight" class="full-page">
    <!-- 视频彩铃内容 -->
    <view class="video-box">
      <video
        v-if="videoDetail.ringFilePath"
        :id="`video_${videoDetail.ringFilePath}`"
        :ref="`video_${videoDetail.ringFilePath}`"
        :style="{ height: videoHeight, width: '100%' }"
        :autoplay="true"
        class="video"
        object-fit="cover"
        :src="videoDetail.ringFilePath"
        loop
        :show-fullscreen-btn="false"
        :show-play-btn="false"
        controls
        :poster="
          videoDetail.coverUrl ||
          videoDetail.openVCoverUrl ||
          videoDetail.openHCoverUrl
        "
      >
        <!-- 播放按钮 -->
        <view
          class="stop-play"
          :style="{ height: videoHeight }"
          @click="clickVideo"
        >
          <image
            v-show="!isPlayNow"
            :src="`${staticImgs}/shxmp/init/video-stop-play.png`"
          />
        </view>
        <view v-if="actions.set" class="view-left">
          <view class="left-view">
            <view class="left-text">
              {{
                videoDetail.ringRename
                  ? videoDetail.ringRename
                  : videoDetail.ringName
              }}
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
      </video>
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
    <!-- 视频彩铃订购相关弹窗 -->
    <popupTemplateOperition
      :popup-info="operitionInfo"
      :show="Boolean($store.state.window.operitionShow)"
      @buttonClick="operitionBtnClick"
      @closePopup="closePopup"
    />
  </view>
</template>
<script>
import { formatCount } from "@/utils/tools.js";
import { handlePurchaseVideo } from "@/utils/video.js";
export default {
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
      videoDetail: null, // 当前展示的video对象
      operitionInfo: {}, // 订购弹窗的内容
      operitionBtnClick: (e) => { }, // 订购弹窗按钮回调
      videoCtx: "", // video播放器
      isPlayNow: true, // 是否正在播放
    };
  },
  watch: {
    item: {
      handler (newVal) {
        this.videoDetail = newVal;
      },
      deep: true,
      immediate: true,
    },
  },
  created () {
    this.videoDetail = this.item;
    this.initStyle();
  },
  mounted () {
    this.dispatchPageEvent();
    // 判断用户是否首次播放
    if (!uni.getStorageSync("userPlayVideo")) {
      uni.setStorageSync("userPlayVideo", true);
    }
  },
  beforeDestroy () {
    this.offMonitor();
  },
  methods: {
    formatCount,
    // 跨页面通信监听
    dispatchPageEvent () {
      console.log("开启监听");
      // 关闭设置弹窗
      this.$store.commit("window/SET_OPERITION_SHOW", false);
      // 展示订购、设置类弹窗，按钮点击回调
      uni.$on("operitionShow", ({ popupInfo, btnClickCallBack = () => { } }) => {
        this.operitionInfo = popupInfo;
        this.$store.commit("window/SET_OPERITION_SHOW", true);
        this.operitionBtnClick = (e) => btnClickCallBack(e);
      });
    },
    // 移除监听
    offMonitor () {
      console.log("移除监听");
      uni.$off("operitionShow");
      this.closePopup();
    },
    closePopup () {
      this.operitionInfo = {};
      this.$store.commit("window/SET_OPERITION_SHOW", false);
    },
    // 点击视频
    clickVideo () {
      this.$analysis.dispatch("video_play_count");
      // 获取对应的videoDOM
      this.videoCtx = uni.createVideoContext(`video_${this.videoDetail.ringFilePath}`, this);
      // 暂停播放
      this.isPlayNow ? this.videoCtx.pause() : this.videoCtx.play();
      this.isPlayNow = !this.isPlayNow;
    },
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
      // 进入预览页面
      uni.navigateTo({
        url: `/pagesSpcl/clVideo/clVideoPreview?videoId=${ringId}`,
      });
    },
    // 设置视频彩铃
    setSpcl (item) {
      if (!uni.getStorageSync("Authorization")) {
        // 提示登录
        return this.$showLoginPop(this);
      }
      //  打开视频彩铃设置弹窗
      handlePurchaseVideo(item, this.setSpclFresh);
    },
    setSpclFresh () {
      this.videoDetail.isBuyVideo = true;
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
          if (opType === 1) {
            this.$toast("点赞成功");
            this.$analysis.dispatch("video_fabulous_count");
            // 将当前数据改了
            this.videoDetail.extraInfo.like = true;
            this.videoDetail.extraInfo.likeCount += 1;
            // 更新仓库里的数据
            this.updateData();
          } else {
            this.$toast("成功取消点赞");
            this.$analysis.dispatch("video_quxiao_fabulous_count");
            // 修改当前数据 更新仓库
            this.videoDetail.extraInfo.like = false;
            this.videoDetail.extraInfo.likeCount -= 1;
            this.updateData(0);
          }
        } else {
          this.$toast(res.message);
        }
      });
    },
    // 数据更新
    updateData (flag = 1) { // 1 点赞 0 取消点赞
      const index = this.$store.state.spcl.videoList.findIndex(i => i.ringId === this.videoDetail.ringId);
      const list = this.$store.state.spcl.videoList;
      list[index] = this.videoDetail;
      this.$store.commit("spcl/M_changeVideoList", list);
      // 更新我的喜欢数据
      this.$store.commit("spcl/UPDATE_MY_LIKE_IDS", this.videoDetail);
      // 更新更多精彩数据
      this.changeStoreLike(this.$store.state.spcl.moreVideoList, "spcl/getMoreVideoList", flag);
      // 更新视彩分类视频列表
      this.changeStoreLike(this.$store.state.spcl.videoListFromCxVideoType, "spcl/getVideoListFromCxVideoType", flag);
      // 更新搜索数据
      this.changeStoreLike(this.$store.state.spcl.searchList, "spcl/getSearchList", flag);
    },
    // 更新vux关于like
    changeStoreLike (typeVideoList, storeMutations, flag) {
      const currentVideoId = this.videoDetail.ringId;
      const videoList = typeVideoList;
      const currentIndex = videoList.findIndex(
        (item) => currentVideoId === item.ringId,
      );
      if (currentIndex > -1) {
        if (flag) {
          videoList[currentIndex].extraInfo.likeCount += 1;
          videoList[currentIndex].extraInfo.like = true;
        } else {
          videoList[currentIndex].extraInfo.likeCount -= 1;
          videoList[currentIndex].extraInfo.like = false;
        }
        this.$store.commit(storeMutations, videoList);
      }
    },
    // 分享到微信或者朋友圈
    shareEvent (ringId) {
      if (!uni.getStorageSync("Authorization")) {
        // 提示登录
        return this.$showLoginPop(this);
      }
      const url = `/pagesCommon/share/shareVideo?videoId=${ringId}&pageName=videoPlay&shareType=1`;
      const data = {
        ringId,
        target: "fx",
      };
      this.$store.dispatch("spcl/handleSpclUserOperate", data).then((res) => {
        if (res.code === 200) {
          this.$analysis.dispatch("video_share_count");
          this.videoDetail.extraInfo.shareCount = this.videoDetail.extraInfo.shareCount + 1;
          // 更新视彩分类数据+ 搜索结果仓库分享数据
          this.updateShareCountData(this.$store.state.spcl.videoListFromCxVideoType, ringId);
          this.updateShareCountData(this.$store.state.spcl.searchList, ringId);
        }
      }).finally(() => {
        uni.navigateTo({
          url,
        });
      });
    },
    updateShareCountData (list, ringId) {
      const clTypeList = list;
      const currentIndex = clTypeList.findIndex(clTypeListItem => clTypeListItem.ringId === ringId);
      if (currentIndex > -1) {
        clTypeList[currentIndex].extraInfo.shareCount += 1;
      }
      console.log(clTypeList[currentIndex], "currentIndex");
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
// 播放按钮
.video {
  position: relative;
}
.stop-play {
  width: 100%;
  display: flex;
  z-index: -1;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;

  image {
    width: 79rpx;
    height: 94rpx;
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
