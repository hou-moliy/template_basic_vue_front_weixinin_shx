<template>
  <view :class="['image-item', !lastFlag ? 'margin-style' : '']">
    <view class="video-box-new more-new-item-column">
      <!-- 封面 -->
      <view :data-topic="'moreVideo'" @click.stop="goToPlayVideo(item, $event)">
        <!-- 封面 -->
        <view class="img-box-more">
          <view class="poster-box">
            <image
              class="poster-btn"
              :src="`${staticImgs}/shxmp/init/video-play-icon.png`"
            />
            <!-- 只展示观看人数，样式2 -->
            <view v-if="spclStyle === 2" class="icon-box-two">
              <image
                :src="`${staticImgs}/shxmp/init/favor-icon.png`"
                class="favor-img"
              />
              <text class="favor-text">
                {{ formatCount(item.extraInfo.playCount) }}
              </text>
            </view>
            <!-- 展示转发和点赞，样式3 -->
            <view v-if="spclStyle === 3" class="icon-box-three">
              <view class="icon-item share-item" @click.stop="shareVideo()">
                <image
                  :src="`${staticImgs}/shxmp/init/share-icon-white.png`"
                  class="share-icon icon"
                />
                <text>{{ formatCount(item.extraInfo.shareCount) }}</text>
              </view>

              <!-- 已点赞 -->
              <view
                v-if="item.extraInfo.like"
                class="icon-item like-item"
                @click.stop="giveLikes(item, true)"
              >
                <image
                  :src="`${staticImgs}/shxmp/init/dzed-icon.png`"
                  class="like-icon icon"
                />
                <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
              </view>

              <!-- 点赞 -->
              <view
                v-else
                class="icon-item like-item"
                @click.stop="giveLikes(item, false)"
              >
                <image
                  :src="`${staticImgs}/shxmp/init/dz-icon-white.png`"
                  class="like-icon icon"
                />
                <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
              </view>
            </view>
            <!-- 封面图片 -->
            <image
              class="new-img"
              :src="item.coverUrl || item.openVCoverUrl || item.openHCoverUrl"
              mode="aspectFill"
            />
            <!-- 蒙层 -->
            <view class="mask" />
          </view>
        </view>
        <!-- 标题 -->
        <view class="more-new-title">
          <view class="title-inner">
            {{ item.ringRename ? item.ringRename : item.ringName }}
          </view>
        </view>
        <view class="white-block" />
        <!-- 操作栏样式1 -->
        <view v-if="spclStyle === 1" class="icon-box">
          <view class="icon-box-in">
            <!-- 分享 -->
            <view class="icon-item share-item" @click.stop="shareVideo()">
              <image
                :src="`${staticImgs}/shxmp/init/share-icon.png`"
                class="share-icon icon"
              />
              <text>{{ formatCount(item.extraInfo.shareCount) }}</text>
            </view>
            <!-- 已点赞 -->
            <view
              v-if="item.extraInfo.like"
              class="icon-item like-item"
              @click.stop="giveLikes(item, true)"
            >
              <image
                :src="`${staticImgs}/shxmp/init/dzed-icon.png`"
                class="like-icon icon"
              />
              <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
            </view>
            <!-- 点赞 -->
            <view
              v-else
              class="icon-item like-item"
              @click.stop="giveLikes(item, false)"
            >
              <image
                :src="`${staticImgs}/shxmp/init/dz-icon.png`"
                class="like-icon icon"
              />
              <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
            </view>
          </view>
          <!-- 设置 -->
          <view v-if="item.isBuyVideo" class="setting-btn-isBuy">已设置</view>
          <!-- 已设置 -->
          <view
            v-else
            class="setting-btn"
            :style="{ background: innerColor }"
            @click.stop="$emit('purchaseVideo', item)"
          >
            设置
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  formatCount,
} from "@/utils/tools.js";
export default {
  name: "SpclItem",
  props: {
    item: {
      type: Object,
      default: () => { },
    },
    lastFlag: {
      type: Boolean,
      default: false,
    },
    innerColor: {
      type: String,
      default: "#9E79FF",
    },
    spclStyle: {
      type: Number,
      default: 1,
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      textOverFlag: false, // 文字是否超出两行显示
      textHeight: 0, // 文字的高度
    };
  },
  computed: {

  },
  watch: {
    lastFlag: {
      handler () {

      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    formatCount,
    // 去分享
    shareVideo () {
      if (uni.getStorageSync("Authorization")) {
        this.$emit("shareVideo", this.item);
      } else {
        this.$emit("openLoginPopup");
      }
    },
    // 点赞或取消点赞
    giveLikes (ringItem, flag) {
      if (uni.getStorageSync("Authorization")) {
        ringItem.like = !flag;
        this.$emit("giveLikes", { ringItem, flag });
      } else {
        this.$emit("openLoginPopup");
      }
    },
    // 跳转视频彩铃播放页面
    goToPlayVideo (item, e) {
      this.$emit("goToPlayVideo", item, e.currentTarget.dataset.topic);
    },
  },
};
</script>

<style lang="scss" scoped>
.video-box {
  height: 100vh;
  background: #ffffff;
}
// 白色边距
.white-block {
  width: 100%;
  height: 27rpx;
  background: #fff;
  border-radius: 0rpx 0rpx 10rpx 10rpx;
}
// 竖屏
.more-new-item-column {
  width: 334rpx;
  -webkit-column-break-inside: avoid;
  background: #ffffff;
  margin-bottom: 18rpx;
  border-radius: 20rpx;

  .img-box-more {
    width: 334rpx;
    height: 593rpx;
    position: relative;

    .new-img {
      width: 334rpx;
      height: 593rpx;
      border-radius: 20rpx 20rpx 0px 0px;
      vertical-align: middle;
    }

    .poster-box {
      position: absolute;
      width: 334rpx;
      height: 593rpx;
      top: 0;
      bottom: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .poster-btn {
        height: 77rpx;
        width: 77rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%);
        z-index: 2;
      }
    }
  }
}
.more-new-title {
  height: 77rpx;
  padding: 15rpx 12rpx 0rpx 15rpx;
  .title-inner {
    font-size: 28rpx;
    font-family: PingFang SC, PingFang SC-Medium, sans-serif;
    font-weight: 700;
    text-align: left;
    color: #333333;
    overflow: hidden;
    white-space: normal;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    display: -webkit-box;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    word-break: break-all;
  }
}

.unfoldText {
  overflow: hidden;
  display: block;
}
.unfoldText:after {
  z-index: 3;
  content: "...";
  position: absolute;
  bottom: 0px;
  right: 80px;
  width: 48px;
  padding-left: 30px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1), #fff 45%);
}
.icon-box {
  display: flex;
  align-items: center;
  padding: 0 12rpx 15rpx 12rpx;

  .icon-box-in {
    display: flex;
    align-items: center;
    width: 200rpx;
  }

  .setting-btn {
    width: 114rpx;
    height: 48rpx;
    background: linear-gradient(to right, #ff6f50 0%, #ff008c 100%);
    border-radius: 24rpx;
    font-size: 24rpx;
    font-family: PingFang SC Medium, PingFang SC Medium-Medium, sans-serif;
    font-weight: 500;
    color: #ffffff;
    line-height: 48rpx;
    text-align: center;
    margin-right: 11rpx;
  }

  .setting-btn-isBuy {
    width: 114rpx;
    height: 48rpx;
    background: #c6c5c8;
    border-radius: 24rpx;
    font-size: 22rpx;
    font-family: PingFang SC Medium, PingFang SC Medium-Medium, sans-serif;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    line-height: 48rpx;
  }
}

.icon-item {
  display: flex;
  align-items: center;
  font-size: 22rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium, sans-serif;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 30rpx;
  text-shadow: 0px 2rpx 4rpx 0px rgba(0, 0, 0, 0.1);
  width: 80rpx;

  .icon {
    flex-shrink: 0;
    width: 30rpx;
    height: 30rpx;
    margin-right: 8rpx;
    vertical-align: middle;
  }
}

.share-item {
  margin-right: 15rpx;
}

// 封面蒙层
.mask {
  position: absolute;
  bottom: 0rpx;
  width: 334rpx;
  height: 167rpx;
  opacity: 0.5;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}
// 样式2
.icon-box-two {
  position: absolute;
  bottom: 20rpx;
  right: 15rpx;
  z-index: 3;
  .favor-img {
    width: 29rpx;
    height: 23rpx;
    margin-right: 10rpx;
    vertical-align: middle;
  }
  .favor-text {
    font-size: 24rpx;
    font-family: Alibaba PuHuiTi, Alibaba PuHuiTi-Regular, sans-serif;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
  }
}
// 样式3
.icon-box-three {
  width: 100%;
  position: absolute;
  bottom: 21rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rpx 13rpx;
  box-sizing: border-box;
  z-index: 3;
  .icon-item {
    font-size: 24rpx;
    font-family: Alibaba PuHuiTi, Alibaba PuHuiTi-Regular, sans-serif;
    font-weight: 400;
    color: #ffffff;
    .icon {
      margin-right: 8rpx;
    }
  }
}
</style>
