<template>
  <view
    class="video-item-wrap"
    :data-url="
      '/pagesC/liaoNingFind/views/littleVideo/littleVideo?videoId=' +
        item.videoId
    "
    :data-topic="'moreVideo'"
    @click="goToPlayVideo($event, item)"
  >
    <view
      class="video-item-info"
      :style="{ 'border-radius': `${radius}rpx` }"
    >
      <image
        class="play-btn"
        :src="`${staticImgs}/lnmp/ln-find/find-play-btn.png`"
      />
      <image
        class="video-item-poster"
        :style="{ 'border-radius': `${radius}rpx` }"
        :src="item.coverUrl || item.vcoverUrl || item.hcoverUrl"
      />
      <!-- 操作按钮 -->
      <slot name="actionIcon">
        <view
          v-if="iconList.length"
          class="video-item-icons mask"
          :style="{ 'border-radius': `0rpx 0rpx ${radius}rpx ${radius}rpx` }"
        >
          <block v-if="iconShow('share')">
            <button
              class="icon-item share-item btn"
              data-type="migu-share"
              :data-share-params="shareParams(item)"
              :open-type="isLogin ? 'share' : ''"
              @click.stop="shareVideo(item.videoId, 'fx', item)"
            >
              <image
                :src="`${staticImgs}/lnmp/ln-find/find-share.png`"
                class="share-icon icon"
              />
              <text>{{ formatCount(item.moreInfo.shareCount) }}</text>
            </button>
          </block>
          <block v-if="iconShow('like')">
            <view
              v-if="!item.moreInfo.like"
              class="icon-item like-item"
              :data-videoId="item.videoId"
              @click.stop="giveLikes(item.videoId, 'dz', 1, item)"
            >
              <image
                :src="`${staticImgs}/lnmp/ln-find/find-like.png`"
                class="like-icon icon"
              />
              <text>{{ formatCount(item.moreInfo.likeCount) }}</text>
            </view>
            <view
              v-else
              class="icon-item like-item"
              :data-videoId="item.videoId"
              @click.stop="giveLikes(item.videoId, 'dz', 0, item)"
            >
              <image
                :src="`${staticImgs}/lnmp/ln-find/find-liked.png`"
                class="like-icon icon"
              />
              <text>{{ formatCount(item.moreInfo.likeCount) }}</text>
            </view>
          </block>
        </view>
      </slot>
    </view>
    <view class="video-item-title">
      {{ item.title }}
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
    iconList: {
      type: Array,
      default: () => ["like", "share"],
    },
    radius: {
      type: Number,
      default: 20,
    },
    isLogin: {
      type: Boolean,
      default: true,
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
    // isLogin() {
    // 	console.log('11111')
    // 	if (!uni.getStorageSync("Authorization")) {
    // 		return false
    // 	}
    // 	return true
    // }
  },
  methods: {
    formatCount,
    // 设置分享需要的参数
    shareParams (item) {
      return {
        shareUrl: item.shareUrl,
        title: item.title,
        videoId: item.videoId,
        type: 2, // 表示来源于咪咕视频
      };
    },
    // 是否展示icon
    iconShow (icon) {
      return this.iconList.includes(icon);
    },
    // 分享
    shareVideo (videoId, target, item) {
      if (!this.isLogin) {
        this.$emit("openLoginPopup");
        return;
      }

      this.$emit("shareVideo", {
        videoId,
        target,
        item,
      });
    },
    // 点赞
    giveLikes (videoId, target, optype, item) {
      this.$emit("giveLikes", {
        videoId,
        target,
        optype,
        item,
      });
    },
    // 去详情页
    goToPlayVideo (e, item) {
      console.log("===>", e, item);
      console.log("this.isLogin", this.isLogin);
      // if(!this.isLogin) {
      // 	this.$emit("openLoginPopup");
      // 	return
      // }
      // this.$store.dispatch('getCustomorderList','a')
      // if(Boolean(this.$store.state.offlinePopup.offlineFlag)){
      // 	return
      // }
      // 跳转的url页面
      let { url } = e.currentTarget.dataset;
      url = `${url}&type=2`; // type2表示是咪咕视频来源
      this.$analysis.dispatch("fxmgsp_spid", item.videoId);
      // 测试分享的
      // url = `${url}&share=1`
      uni.navigateTo({
        url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.video-item {
  &-wrap {
  }

  &-info {
    width: 100%;
    height: 390rpx;
    position: relative;

    .play-btn {
      width: 77rpx;
      height: 77rpx;
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -40%);
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

.mask {
  background: linear-gradient(to bottom, #00000000, #000000b0);
}

.video-item-title {
  width: 100%;
  margin-top: 18rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 30rpx;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 40rpx;
}

.icon-item {
  font-size: 22rpx;
  font-family: PingFang SC, PingFang SC-Medium;
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

.btn {
  background: transparent;
  padding: 0;
  line-height: 0;
  margin: 0;
}
</style>
<style>
button::after {
  border: none;
}
</style>
