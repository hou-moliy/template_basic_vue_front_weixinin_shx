<template>
  <view v-if="src" class="video-play-page">
    <video
      :id="`video_${src}`"
      :ref="`video_${src}`"
      :src="trueSrc"
      :style="{ height: height }"
      :loop="true"
      :enable-progress-gesture="true"
      object-fit="cover"
      :autoplay="play"
      :show-fullscreen-btn="false"
      :show-play-btn="false"
      class="video"
      :controls="controls"
      :poster="poster"
      @timeupdate="timeupdate"
      @ended="playEnd"
    >
      <slot />
      <view class="stop-play" :style="{ height: height }" @click="clickVideo">
        <image
          v-show="!isPlayNow"
          :src="`${staticImgs}/shxmp/init/video-stop-play.png`"
        />
      </view>
    </video>
  </view>
</template>

<script>
import SpclService from "@/api/spcl/index.js";
export default {
  props: {
    controls: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      default: "",
    },
    play: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "",
    },
    initialTime: {
      type: Number,
      default: 0,
    },
    gDuration: {
      type: Number,
      default: 999,
    }, // 大概时长使进度条更准确
    objectFit: {
      type: String,
      default: "cover",
    },
    poster: {
      // 视频封面的图片
      type: String,
      default: "",
    },
    videoId: {
      // 视频Id
      type: String,
      default: "",
    },
  },
  data () {
    return {
      time: 0,
      duration: 0,
      playFirst: true,
      isPlayNow: true, // 是否正在播放
      videoCtx: "",
      staticImgs: this.$staticImgs,
      isTimeupdate: false, // 视频是否加载完成
      autoPlayFlag: false,
      trueSrc: "",

    };
  },
  computed: {
    startTime () {
      return this.initialTime;
    },
  },
  watch: {
    src (val, nval) {
      this.isPlayNow = true;
      this.$analysis.dispatch("spcl_bf", this.videoId);
      if (uni.getStorageSync("Authorization")) {
        // 记录
        const data = {
          ringId: this.videoId,
          target: "bf",
          opType: 1,
        };
        SpclService.getSpclUserBehavior(data).then((res) => { });
      }
    },
    startTime: {
      immediate: true,
      handler (newVal, oldVal) {
        this.time = newVal;
      },
    },
    gDuration: {
      immediate: true,
      handler (newVal, oldVal) {
        this.duration = newVal;
      },
    },
  },
  created () {
  },
  mounted () {
    // 获取对应的videoDOM
    this.videoCtx = uni.createVideoContext(`video_${this.src}`, this);
    this.autoPlayFlag = true;
    this.trueSrc = this.src;
    if (this.videoCtx.paused || this.videoCtx.ended) {
      setTimeout(() => {
        this.videoCtx.play();
      }, 200);
    } else {
      this.videoCtx.pause();
    }

    if (!uni.getStorageSync("userPlayVideo")) {
      uni.setStorageSync("userPlayVideo", true);
    }
  },
  methods: {
    playEnd () {
      this.$emit("playEnd");
    },
    clickVideo () {
      if (!this.isTimeupdate) {
        return;
      }
      // 暂停播放
      this.isPlayNow ? this.videoCtx.pause() : this.videoCtx.play();
      this.isPlayNow = !this.isPlayNow;
    },
    timeupdate (event) {
      this.duration = event.detail.duration;
      if (!this.isTimeupdate && this.duration > 0) {
        this.isTimeupdate = true;
      }
      if (!this.isPlayNow) {
        if (this.videoCtx) {
          this.videoCtx.pause();
          this.isPlayNow = false;
        }
      }
      if (this.time >= event.detail.duration) this.time = 0;
      this.time = event.detail.currentTime;
      this.$emit("timeupdate", this.time);
    },
    videoPlay () {
      if (this.play) {
        this.videoCtx.play();
        this.isPlayNow = true;
        if (this.playFirst) {
          this.videoCtx.seek(this.startTime);
          this.playFirst = false;
        }
      } else {
        if (this.videoCtx) {
          this.videoCtx.pause();
          this.isPlayNow = false;
        }
      }
    },
    waiting () { },
  },
};
</script>

<style lang="scss">
.video {
  width: 750rpx;
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

.img {
  position: absolute;

  width: 750rpx;
}

.icon-view {
  position: absolute;
}

.top {
  position: absolute;
  top: 0;
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.7)
  );
  width: 750rpx;
  height: 300rpx;
}

.icon {
  opacity: 0.6;
  font-size: 42px;
  color: #fff;
  font-family: texticons, sans-serif;
}

.bottom {
  position: absolute;
  bottom: 0;
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0)
  );
  width: 750rpx;
  height: 300rpx;
}

.slider-view {
  position: absolute;
  left: 0;
  bottom: 30px;
  width: 750rpx;
}

.progressBar {
  border-radius: 2upx;
  height: 4upx;
  background-color: #ffffff;
  z-index: 999999;
  position: absolute;
  left: 0;
  bottom: 30px;
  //#ifndef APP-PLUS-NVUE
  animation: flicker 4s linear infinite;
  animation-direction: alternate;
  //#endif
}

//#ifndef APP-PLUS-NVUE
@keyframes flicker {
  0% {
    box-shadow: 0 0 0 #ffffff;
  }

  /** 暂停效果 */
  10% {
    box-shadow: 0 0 2upx #ffffff;
  }

  50% {
    box-shadow: 0 0 10upx #ffffff;
  }

  60% {
    box-shadow: 0 0 12upx #ffffff;
  }

  90% {
    box-shadow: 0 0 18upx #ffffff;
  }

  100% {
    box-shadow: 0 0 20upx #ffffff;
  }
}

//#endif
.danmu-view {
  position: absolute;
  top: 0;
  height: 160px;
}
</style>
