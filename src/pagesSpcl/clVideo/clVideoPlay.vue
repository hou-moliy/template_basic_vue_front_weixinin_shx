<template>
  <view class="page" :style="{ height: height }">
    <!-- 自定义导航栏 -->
    <view class="navBarBox">
      <view
        class="navBar"
        :style="{
          paddingTop: navMarginHeight + 'px',
          height: navHeight + 'px',
        }"
      >
        <view
          v-if="!Boolean($store.state.window.operitionShow)"
          class="icon"
          @click="goBack"
        >
          <image
            class="back"
            :src="`${staticImgs}/shxmp/init/custom_nav_back_btn.png`"
          />
        </view>
      </view>
    </view>
    <swiper
      class="swiper"
      :vertical="true"
      :current="index"
      :disable-touch="false"
      @change="changeCurrent"
    >
      <swiper-item
        v-for="(item, innerIndex) in videoList"
        :key="item.ringId"
        class="swiper-item"
      >
        <full-screen-video v-if="index === innerIndex" :item="item" />
      </swiper-item>
    </swiper>
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
import Util, { formatCount } from "@/utils/tools.js";
import { videoInfoUpdate } from "@/utils/video";
export default {

  data () {
    return {
      staticImgs: this.$staticImgs,
      height: "",
      index: 0, // 当前展示的video的index
      playCount: 2, // 剩余多少视频加载视频列表
      videoList: [], // 展示的video数组
      pageNum: 1,
      pageSize: 10,
      id: "",
      totalNum: 0,
      onLoadId: -1,
      labelId: -1,
      isFirst: false,
      isPlayFromIndex: false,
      isRequest: false,
      loadMoreVideoCount: 2,
      navMarginHeight: 0, // 自定义导航栏外边距
      navHeight: 0, // 自定义导航栏高度
      step: 0, // 新手引导步骤
      isFirstPlay: false, // 控制引导弹窗的展示
      userLikeVideoList: [],
      playStatus: "", // 是否是组件 状态   0-非组件  1-组件
      moduleId: "", // page_config 的 moduleId
      notModulId: "", // 非组件 id
    };
  },

  onLoad ({
    id,
    playStatus,
    moduleId,
    notModulId,
  }) {
    this.videoList = this.$store.state.spcl.videoList;
    console.log("===", this.videoList);
    this.onLoadId = id;
    this.index = this.videoList.findIndex((item) => item.ringId === id);
    uni.setStorageSync("videoPlayIndex", this.index);
    this.isFirst = true;
    this.playStatus = playStatus;
    if (moduleId) {
      this.moduleId = moduleId;
    } else {
      this.notModulId = notModulId;
    }
    // 判断是否是第一次播放
    if (uni.getStorageSync("userPlayVideo")) {
      this.isFirstPlay = false;
    } else {
      this.step = 1;
      this.isFirstPlay = true;
    }
    // 根据胶囊外边距和高度计算自定义导航栏的外边距和高度
    this.navMarginHeight = uni.getMenuButtonBoundingClientRect().top;
    this.navHeight = uni.getMenuButtonBoundingClientRect().height;
  },

  async onShow () {
    // 获取点赞列表，更新点赞
    if (uni.getStorageSync("Authorization")) {
      const res = await SpclService.getBehaviorIdList({ behaviorType: "dz" });
      if (res.data.code === 200) {
        this.userLikeVideoList = res.data.data;
      }
    }
    this.init();
  },
  onShareAppMessage (res) {
    this.onLoadId = this.videoList[this.index].ringId;
    if (res.from === "button") {
      // 来自页面内分享按钮
    }
    return {
      title: `"${this.videoList[this.index].ringRename ? this.videoList[this.index].ringRename : this.videoList[this.index].ringName}"太赞了！老铁看一下！`,
      path: `/pagesCommon/share/openShare?videoId=${this.onLoadId}`,
      imageUrl: `${this.staticImgs}/shxmp/init/share_main.png`,
    };
  },
  created () {
    console.log("created");
    uni.getSystemInfo({
      success: (res) => {
        if (res.safeArea.top === 44) {
          // that.globalData.needAdapt = true
          this.sysheight = res.windowHeight - 10;
        } else {
          this.sysheight = res.windowHeight;
        }
      },
    });
    this.sysheight = uni.getSystemInfoSync().windowHeight;
    this.height = `${this.sysheight}px`;
    const width = uni.getSystemInfoSync().windowWidth;
    this.width = `${width}px`;
  },
  onUnload () {
    console.log("onUnload");
    uni.removeStorageSync("isFromRecentPlay");
    uni.removeStorageSync("isFromMyLike");
  },
  methods: {
    formatCount,
    // 新手引导下一步
    nextStep () {
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
      this.step = 3;
      this.isFirstPlay = true;
    },
    goBack () {
      uni.navigateBack();
    },
    init () {
      console.log("重新获取数据----");
      // 获取数据
      this.isPlayFromIndex = uni.getStorageSync("isPlayFromIndex");
      this.$store.commit("spcl/M_changeVideoList", this.$store.state.spcl.videoList);
      this.videoList = this.$store.state.spcl.videoList;
      this.labelId = this.$store.state.spcl.vedioLabelId;
      this.index = this.videoList.findIndex(
        (item) => item.ringId === this.onLoadId,
      );
      // 更新list中的点赞
      this.videoList.forEach((item) => {
        if (this.userLikeVideoList.indexOf(item.ringId) > -1) {
          item.extraInfo.like = true;
        }
      });
      // 来自于可加载滑动
      const isFromRecentPlay = uni.getStorageSync("isFromRecentPlay");
      const isFromMyLike = uni.getStorageSync("isFromMyLike");
      if (isFromRecentPlay || isFromMyLike) {
        this.pageSize = 10;
      }
      this.pageNum = Math.ceil(this.videoList.length / this.pageSize) + 1;
      this.totalNum = this.$store.state.spcl.VedioListTalNum;
      this.activityId = uni.getStorageSync("activityId");
      this.level = uni.getStorageSync("level");
      if (uni.getStorageSync("Authorization")) {
        // 播放记录
        const data = {
          ringId: this.videoList[this.index].ringId,
          target: "bf",
          opType: 1,
          mainId: this.moduleId ? this.moduleId : this.notModulId,
          pageName: this.playStatus,
        };
        SpclService.getSpclUserBehavior(data).then((res) => { });
      }
    },
    // 瀑布流获取下一页
    getNewVedioList () {
      if (this.isRequest) {
        return;
      }
      this.isRequest = true;
      const isFromclVideoType = uni.getStorageSync("isFromclVideoType");
      if (isFromclVideoType) {
        this.clVideoTypeGetVedioList();
      } else {
        this.configWaterfallgetVedioList();
      }
    },
    // 视频分类页瀑布流获取下一页
    clVideoTypeGetVedioList () {
      const data = {
        labelId: this.labelId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      SpclService.getSpclLabelVideoList(data).then((res) => {
        this.isRequest = false;
        if (res.data.code === 200) {
          const tempList = Util.SplitArray(res.data.data.records, this.videoList);
          this.pageNum++;
          this.videoList = videoInfoUpdate(tempList);
          console.log(this.videoList, "videoList");
          this.$store.commit("spcl/M_changeVideoList", this.videoList);
        }
      });
    },
    // 配置化瀑布流组件获取下一页
    configWaterfallgetVedioList () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ac: this.activityId,
        level: this.level,
      };
      SpclService.getVideoByActivityIdPage(data)
        .then((res) => {
          this.isRequest = false;
          if (res.data.code === 200) {
            const tempList = Util.SplitArray(res.data.data.list, this.videoList);
            this.pageNum++;
            this.videoList = videoInfoUpdate(tempList);
            this.$store.commit("spcl/M_changeVideoList", this.videoList);
          }
        });
    },
    // 我的喜欢获取下一页
    getMoreMyLikeVideoPlayList () {
      if (this.isRequest) {
        return;
      }
      this.isRequest = true;
      const data = {
        behaviorType: "dz",
        pageNum: this.pageNum,
        pageCount: this.pageSize,
      };

      SpclService.getBehaviorList(data).then((res) => {
        this.isRequest = false;
        if (res.data.code === 200) {
          const tempList = Util.SplitArray(res.data.data.records, this.videoList);
          this.videoList = videoInfoUpdate(tempList);
          this.pageNum++;
          this.$store.commit("spcl/M_changeVideoList", this.videoList);
        }
      });
    },
    // 最近播放获取下一页
    getMoreRecentVideoPlayList () {
      if (this.isRequest) {
        return;
      }
      this.isRequest = true;
      const data = {
        behaviorType: "bf",
        start: this.pageNum,
        pageCount: this.pageSize,
      };
      SpclService.getBehaviorList(data).then((res) => {
        this.isRequest = false;
        if (res.data.code === 200) {
          const tempList = Util.SplitArray(res.data.data.records, this.videoList);
          this.pageNum++;
          this.videoList = videoInfoUpdate(tempList);
          this.$store.commit("spcl/M_changeVideoList", this.videoList);
        }
      });
    },
    changeCurrent (e) {
      console.log(e.detail.current, "e.detail.current");
      this.index = e.detail.current;
      this.onLoadId = this.videoList[this.index].ringId;
      uni.setStorageSync("videoPlayIndex", this.index);
      if (this.isFirstPlay) {
        this.isFirstPlay = false;
      }
      if (uni.getStorageSync("Authorization")) {
        // 记录
        const data = {
          ringId: this.videoList[this.index].ringId,
          target: "bf",
          opType: 1,
          mainId: this.moduleId ? this.moduleId : this.notModulId,
          pageName: this.playStatus,
        };
        SpclService.getSpclUserBehavior(data).then((res) => { });
      }
      // 加载更多数据
      this.getMore();
    },
    getMore () {
      const isPlayFromIndex = uni.getStorageSync("isPlayFromIndex");
      const isFromRecentPlay = uni.getStorageSync("isFromRecentPlay");
      const isFromMyLike = uni.getStorageSync("isFromMyLike");
      if (isFromRecentPlay) {
        if (
          this.videoList.length - this.index <= this.loadMoreVideoCount &&
          this.videoList.length < this.totalNum
        ) {
          this.getMoreRecentVideoPlayList();
        }
      } else if (isFromMyLike) {
        if (
          this.videoList.length - this.index <= this.loadMoreVideoCount &&
          this.videoList.length < this.totalNum
        ) {
          this.getMoreMyLikeVideoPlayList();
        }
      } else if (!isPlayFromIndex) {
        if (
          this.videoList.length - this.index <= this.loadMoreVideoCount &&
          this.videoList.length < this.totalNum
        ) {
          this.getNewVedioList();
        }
      }
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

      .home {
        width: 35rpx;
        height: 32rpx;
      }
    }
  }
}

.swiper {
  flex: 1;
  background-color: #000;
  position: relative;
  .swiper-item {
    flex: 1;
  }
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

.page {
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  flex: 1;
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
