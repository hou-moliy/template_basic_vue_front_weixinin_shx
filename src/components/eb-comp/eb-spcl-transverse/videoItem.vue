<template>
  <!-- 视频彩铃组件 -->
  <view
    class="video-item-wrap"
    :data-topic="'moreVideo'"
    @click="goToPlayVideo(item)"
  >
    <view class="video-item-info" :style="{ 'border-radius': `${radius}rpx` }">
      <image
        class="video-item-poster"
        :style="{ 'border-radius': `${radius}rpx` }"
        :src="item.coverUrl || item.openVCoverUrl || item.openHCoverUrl"
        mode=""
      />
      <!-- 播放按钮 -->
      <image
        class="poster-btn"
        :src="`${staticImgs}/shxmp/init/video-play-icon.png`"
      />
      <!-- 操作按钮 -->
      <slot name="actionIcon">
        <view
          v-if="iconList.length"
          class="video-item-icons"
          :class="iconsClass"
          :style="{ 'border-radius': `0rpx 0rpx ${radius}rpx ${radius}rpx` }"
        >
          <block v-if="iconList.includes('share')">
            <view
              class="icon-item share-item"
              :data-videoId="item.ringId"
              @click.stop="shareVideo(item.ringId, 'fx')"
            >
              <image
                :src="`${staticImgs}/shxmp/init/share-icon.png`"
                class="share-icon icon"
              />
              <text>{{ formatCount(item.extraInfo.shareCount) }}</text>
            </view>
          </block>
          <block v-if="iconList.includes('like')">
            <view
              v-if="!item.extraInfo.like"
              class="icon-item like-item"
              :data-videoId="item.ringId"
              @click.stop="giveLikes(item.ringId, 'dz', 1)"
            >
              <image
                :src="`${staticImgs}/shxmp/init/dz-icon.png`"
                class="like-icon icon"
              />
              <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
            </view>
            <view
              v-else
              class="icon-item like-item"
              :data-videoId="item.ringId"
              @click.stop="giveLikes(item.ringId, 'dz', 0)"
            >
              <image
                :src="`${staticImgs}/shxmp/init/dzed-icon.png`"
                class="like-icon icon"
              />
              <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
            </view>
          </block>
        </view>
      </slot>
    </view>
    <view class="video-item-title">
      {{ item.ringRename ? item.ringRename : item.ringName }}
    </view>
  </view>
</template>

<script>
import { formatCount } from "@/utils/tools.js";

export default {
  name: "VideoItem",
  props: {
    item: {
      type: Object,
      default: () => { },
    },
    videoList: {
      type: Array,
      default: () => [],
    },
    iconList: {
      type: Array,
      default: () => ["like", "share"],
    },
    radius: {
      type: Number,
      default: 18,
    },
    iconsClass: {
      type: Array,
      default: () => ["dark"],
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
    };
  },
  computed: {
    infoStyle () {
      return {
        borderRadius: `${this.radius}rpx`,
      };
    },
  },
  methods: {
    formatCount,
    // 分享
    shareVideo (ringId, target) {
      this.$emit("shareVideo", { ringId, target });
    },
    // 点赞
    giveLikes (ringId, target, opType) {
      this.$emit("giveLikes", { ringId, target, opType });
    },
    // 详情页播放视频
    goToPlayVideo (item) {
      this.$emit("goToPlayVideo", item);
    },
  },
};
</script>

<style lang="scss">
.video-item {
  &-info {
    width: 100%;
    height: 480rpx;
    position: relative;

    .poster-btn {
      width: 77rpx;
      height: 77rpx;
      position: absolute;
      top: 48%;
      left: 50%;
      transform: translate(-50%, -48%);
      z-index: 2;
    }
  }

  &-poster {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  &-icons {
    width: 100%;
    height: 173rpx;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0rpx 20rpx 16rpx;
    box-sizing: border-box;
  }
}

.dark {
  background: linear-gradient(to bottom, #00000000, #000000b0);
}

.light {
  background: linear-gradient(to bottom, #00000000, #000000b0);
}

.video-item-title {
  width: 100%;
  margin-top: 18rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 30rpx;
  font-family: PingFang SC, PingFang SC-Medium, sans-serif;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 40rpx;
}

.icon-item {
  font-size: 22rpx;
  font-family: PingFang SC, PingFang SC-Medium, sans-serif;
  font-weight: 500;
  text-align: left;
  color: #ffffff;
  text-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;

  .icon {
    margin-right: 10rpx;
    vertical-align: middle;
  }

  .share-icon {
    width: 29rpx;
    height: 29rpx;
  }

  .like-icon {
    width: 30rpx;
    height: 30rpx;
  }
}
</style>
