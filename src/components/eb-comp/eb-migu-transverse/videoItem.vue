<template>
  <!-- 咪咕视频 彩铃组件 -->
  <view
    class="video-item-wrap"
    @click="goToPlayVideo($event, item)"
    :data-url="
      '/pagesC/liaoNingFind/views/littleVideo/littleVideo?videoId=' +
      item.videoId
    "
    :data-topic="'moreVideo'"
  >
    <view class="video-item-info" :style="{ 'border-radius': `${radius}rpx` }">
      <image
        mode=""
        class="play-btn"
        :src="`${staticImgs}/lnmp/ln-find/find-play-btn.png`"
      ></image>
      <image
        class="video-item-poster"
        :style="{ 'border-radius': `${radius}rpx` }"
        :src="item.coverUrl || item.openVCoverUrl || item.openHCoverUrl"
      >
      </image>
      <!-- 操作按钮 -->
      <slot name="actionIcon">
        <view
          class="video-item-icons"
          :class="iconsClass"
          v-if="iconList.length"
          :style="{ 'border-radius': `0rpx 0rpx ${radius}rpx ${radius}rpx` }"
        >
          <block v-if="iconShow('share')">
            <button
              class="icon-item share-item btn"
              @click.stop="shareVideo(item.videoId, 'fx', item)"
              :data-share-params="shareParams(item)"
              data-type="migu-share"
              :open-type="isLogin ? 'share' : ''"
            >
              <image
                :src="`${staticImgs}/lnmp/ln-find/find-share.png`"
                class="share-icon icon"
              ></image>
              <text>{{ formatCount(item.moreInfo.shareCount) }}</text>
            </button>
          </block>
          <block v-if="iconShow('like')">
            <view
              class="icon-item like-item"
              v-if="!item.moreInfo.like"
              @click.stop="giveLikes(item.videoId, 'dz', 1, item)"
              :data-videoId="item.videoId"
            >
              <image
                :src="`${staticImgs}/lnmp/ln-find/find-like.png`"
                class="like-icon icon"
              ></image>
              <text>{{ formatCount(item.moreInfo.likeCount) }}</text>
            </view>
            <view
              v-else
              class="icon-item like-item"
              @click.stop="giveLikes(item.videoId, 'dz', 0, item)"
              :data-videoId="item.videoId"
            >
              <image
                :src="`${staticImgs}/lnmp/ln-find/find-liked.png`"
                class="like-icon icon"
              ></image>
              <text>{{ formatCount(item.moreInfo.likeCount) }}</text>
            </view>
          </block>
        </view>
      </slot>
    </view>
    <view class="video-item-title">
      {{ item.name }}
    </view>
  </view>
</template>

<script>
import { formatCount } from '@/utils/tools.js'

export default {
  name: 'videoItem',
  props: {
    isLogin: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {},
    },
    videoList: {
      type: Array,
      default: () => [],
    },
    iconList: {
      type: Array,
      default: () => ['like', 'share'],
    },
    radius: {
      type: Number,
      default: 18,
    },
    iconsClass: {
      type: Array,
      default: () => ['dark'],
    },
  },
  data() {
    return {
      staticImgs: this.$staticImgs,
    }
  },
  computed: {
    infoStyle() {
      return {
        borderRadius: `${this.radius}rpx`,
      }
    },
  },
  methods: {
    formatCount,

    // 设置分享需要的参数
    shareParams(item) {
      return {
        shareUrl: item.shareUrl,
        title: item.title,
        videoId: item.videoId,
        type: 2, //表示来源于咪咕视频
      }
    },
    // 是否展示icon
    iconShow(icon) {
      return this.iconList.includes(icon)
    },
    // 分享
    shareVideo(videoId, target, item) {
      this.$emit('shareVideo', {
        videoId,
        target,
        item,
      })
    },
    // 点赞
    giveLikes(videoId, target, optype, item) {
      this.$emit('giveLikes', {
        videoId,
        target,
        optype,
        item,
      })
    },
    // 去详情页
    goToPlayVideo(e, item) {
      console.log('===>', e, item)
      console.log('this.isLogin', this.isLogin)
      // if(!this.isLogin) {
      // 	this.$emit("openLoginPopup");
      // 	return
      // }
      // this.$store.dispatch('getCustomorderList','a')
      // if(Boolean(this.$store.state.offlinePopup.offlineFlag)){
      // 	return
      // }
      // 跳转的url页面
      let { url } = e.currentTarget.dataset
      url = `${url}&type=2` // type2表示是咪咕视频来源
      this.$analysis.dispatch('fxmgsp_spid', item.videoId)
      // 测试分享的
      // url = `${url}&share=1`
      uni.navigateTo({
        url,
      })
    },
    // // 分享
    // shareVideo(ringId,target) {
    // 	this.$emit('shareVideo',{ringId,target})
    // },
    // // 点赞
    // giveLikes(ringId, target, opType) {
    // 	// this.$store.dispatch('getCustomorderList','a')
    // 			// if(Boolean(this.$store.state.offlinePopup.offlineFlag)){
    // 	// 	return
    // 	// }
    // 	this.$emit('giveLikes',{ringId,target,opType})
    // },
    // // 详情页播放视频
    // goToPlayVideo(e, videoList, item) {
    // 	// this.$store.dispatch('getCustomorderList','a')
    // 			// if(Boolean(this.$store.state.offlinePopup.offlineFlag)){
    // 	// 	return
    // 	// }
    // 	this.$store.commit('getVideoList', videoList)
    // 	if (e.currentTarget.dataset.topic == 'moreVideo') {
    // 		uni.setStorageSync('isPlayFromIndex', false);
    // 		this.$store.commit('getVedioListTalNum', uni.getStorageSync('vedioListTalNum'))
    // 		this.$store.commit('getVideoLabelId', uni.getStorageSync('moreLableId'))
    // 	} else {
    // 		uni.setStorageSync('isPlayFromIndex', true);
    // 	}
    // 	// 跳转的url页面
    // 	let {url} = e.currentTarget.dataset
    // 	// 控制操作按钮的展示
    // 	let actions = {set:false,like:true,share:true,preview:false}
    // 	// 控制是否是否展示某些操作按钮
    // 	// url = `${url}&actions=${JSON.stringify(actions)}`
    // 	uni.navigateTo({
    // 		url: url
    // 	});
    // },
  },
}
</script>

<style lang="scss">
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
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
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
.btn {
  background: transparent;
  padding: 0;
  line-height: 0;
  margin: 0;
}
.dark {
  // background: rgba(0,0,0,0.7);
  background: linear-gradient(to bottom, #00000000, #000000b0);
}

.light {
  background: linear-gradient(to bottom, #00000000, #000000b0);

  // background: linear-gradient(0deg, rgba(0, 0, 0, 0.45), rgba(0,0,0,0.5));
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
</style>
