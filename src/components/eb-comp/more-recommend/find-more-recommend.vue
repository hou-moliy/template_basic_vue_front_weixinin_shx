<template>
  <!-- 更多推荐组件 -->
  <view
    class="more-wrap"
    :style="{marginTop}"
  >
    <view class="more-title">
      更多推荐
    </view>
    <template v-if="wfList.length">
      <view
        v-for="(item,index) in wfList"
        :key="index"
        class="more-item"
      >
        <view
          class="basic-wrap"
          @click.stop="navgateUrl(item.videoId)"
        >
          <view class="basic-con">
            <view class="basic-con-l">
              <image
                :src="item.coverUrl"
                mode=""
                class="basic-l-img"
              />
            </view>
            <view class="basic-con-r">
              <view>
                <view class="basic-r-title">
                  {{ item.name }}
                </view>
                <view class="basic-r-subtitle">
                  {{ item.info }}
                </view>
              </view>
              <view class="video-item-icons">
                <view
                  v-if="!item.moreInfo.like"
                  class="icon-item like-item"
                  :data-videoId="item.videoId"
                  @click.stop="giveLikes(item.videoId, index, 'dz',1,item)"
                >
                  <image
                    :src="`${staticImgs}/lnmp/dz-icon.png`"
                    class="like-icon icon"
                  />
                  <text>{{ formatCount(item.moreInfo.likeCount) }}</text>
                </view>
                <view
                  v-else
                  class="icon-item like-item"
                  :data-videoId="item.videoId"
                  @click.stop="giveLikes(item.videoId, index, 'dz',0,item)"
                >
                  <image
                    :src="`${staticImgs}/lnmp/dzed-icon.png`"
                    class="like-icon icon"
                  />
                  <text>{{ formatCount(item.moreInfo.likeCount) }}</text>
                </view>
                <button
                  class="icon-item share-item btn"
                  :data-videoId="item.videoId"
                  data-type="little-video-share"
                  :data-share-params="shareParams(item)"
                  :open-type="isLogin ?'share' :''"
                  @click.stop="shareEvent(item.videoId,'fx',item,index)"
                >
                  <image
                    :src="`${staticImgs}/lnmp/ln-find/find-share-square.png`"
                    class="share-icon icon"
                  />
                  <text>{{ item.moreInfo.shareCount ? formatCount(item.moreInfo.shareCount) :'分享' }}</text>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import miguService from "@/api/migu/migu.js";

import {
  formatCount,
} from "@/utils/tools.js";

export default {
  name: "FindMoreRecommend",
  props: {
    videoId: {
      required: true,
    },
    marginTop: {
      type: String,
      default: "0rpx",
    },
    type: {
      required: true,
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      wfList: [],
      wfParams: {
        num: 3,
        type: 1,
      },
      isClickLike: false, // 防止快速点击
    };
  },
  computed: {
    isLogin () {
      if (!uni.getStorageSync("Authorization")) {
        return false;
      }
      return true;
    },
  },
  created () {
    this.getWfList();
  },
  methods: {
    formatCount,
    shareParams (item) {
      return {
        shareUrl: item?.shareUrl,
        title: item?.name,
        type: this.type,
      };
    },
    async getWfList (flag = true) { // flag，true表示刷新或首次加载,false表示加载更多
      const wfParams = {
        ...this.wfParams,
        currentVideoId: this.videoId,
      };
      await miguService.moreRecommend(wfParams).then(({
        data: res,
      }) => {
        if (res.code === 200) {
          this.wfList = [...res.data];
        }
      });
    },
    // 点赞 OR 取消点赞
    giveLikes (videoId, index, target, optype, item) {
      if (!this.isLogin) {
        this.$emit("openLoginPopup");
        return;
      }
      if (this.isClickLike) {
        return;
      }
      this.isClickLike = true;
      this.handleLikeStatus({
        videoId,
        target,
        optype,
      }, item, index);
    },
    // 分享到微信或者朋友圈
    shareEvent (videoId, target, item, index) {
      if (!this.isLogin) {
        this.$emit("openLoginPopup");
        return;
      }
      // this.$store.dispatch("getCustomorderList", "a");
      // if (this.$store.state.offlinePopup.offlineFlag) {
      //   return;
      // }
      this.onLoadId = videoId;
      this.handleLikeStatus({
        videoId,
        target,
      }, item, index);
    },
    // 处理点赞和分享的接口请求
    handleLikeStatus (params, item, index) {
      miguService
        .countVideoOperation(params)
        .then(({
          data: res,
        }) => {
          this.isClickLike = false;
          if (res.code === 200) {
            if (params.optype === 0) {
              this.$tips("取消点赞成功");
            } else if (params.optype === 1) {
              this.$tips("点赞成功");
            }
            // 处理页面更新
            this.handleUpdateView(params, item, index);
          } else {
            this.$tips(res.message);
          }
        });
    },
    // 处理页面更新
    handleUpdateView ({
      videoId,
      target,
      optype,
    }, item, index) {
      if (target === "fx") {
        item.moreInfo.shareCount++;
      } else if (target === "dz") {
        optype === 0 ? item.moreInfo.likeCount-- : item.moreInfo.likeCount++;
        item.moreInfo.like = optype !== 0;
      }
      this.$set(this.wfList, index, item);
    },
    // 处理跳转
    navgateUrl (videoId) {
      this.$analysis.dispatch("spxq_gdtj_id", videoId);
      uni.redirectTo({
        url: `/pagesC/liaoNingFind/views/littleVideo/littleVideo?videoId=${videoId}&type=${this.type}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.more-wrap {
  width: 100%;
  padding: 0rpx 0rpx 146rpx 0rpx;
  box-sizing: border-box;
}

.more-title {
  margin-top: 36rpx;
  font-size: 36rpx;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  text-align: left;
  color: #333333;
  line-height: 59rpx;
  margin-left: 33rpx;
}

.more-item + .more-item {
  border-top: 1px solid #f7f7f7;
}

.subtitle-wrap {
  width: fit-content;
  height: 34rpx;
  background: #f7f6f9;
  border-radius: 17rpx;
  font-size: 22rpx;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  color: #999999;
  padding-right: 18rpx;
  box-sizing: border-box;
  margin-top: 12rpx;
  display: flex;

  .avatar {
    width: 30rpx;
    height: 30rpx;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 10rpx;
  }

  .subtitle-text {
    width: 222rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.video-item-icons {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  align-items: center;
}

.icon-item {
  display: flex;
  align-items: center;

  .icon {
    margin-right: 10rpx;
    vertical-align: middle;
  }

  text {
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    color: #999999;
  }

  .share-icon {
    width: 31rpx;
    height: 27rpx;
  }

  .like-icon {
    width: 33rpx;
    height: 33rpx;
  }
}

.icon-item + .icon-item {
  margin-left: 65rpx;
}

.basic-wrap {
  display: flex;
  flex-direction: column;
}

.basic-con {
  display: flex;
  padding: 18rpx 0rpx;
  box-sizing: border-box;
  margin-left: 33rpx;
}

.basic-con-l {
  width: 162rpx;
  height: 190rpx;
  // border-radius: 10rpx;
  margin-right: 29rpx;

  .basic-l-img {
    width: inherit;
    height: inherit;
    display: inline-block;
    border-radius: 10rpx;
    vertical-align: top;
  }
}

.basic-con-r {
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .basic-r-title {
    width: 380rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 30rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: left;
    color: #333333;
    margin-bottom: 15rpx;
    line-height: 40rpx;
  }

  .basic-r-subtitle {
    width: 494rpx;
    font-size: 24rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: left;
    color: #999999;
    line-height: 33rpx;
    margin: 5rpx 0rpx 25rpx;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
    // white-space:nowrap
  }

  .basic-r-actions {
    display: flex;
  }
}

.basic-r-btn {
  width: 178rpx;
  height: 50rpx;
  text-align: center;
  background: linear-gradient(105deg, #ff6f50 0%, #ff008c 100%);
  border-radius: 10rpx;
  font-size: 24rpx;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  color: #ffffff;
  line-height: 50rpx;
}

.basic-r-btn + .basic-r-btn {
  margin-left: 27rpx;
}

.btn {
  background-color: none !important;
  background: transparent !important;
  border: none !important;
  padding: 0;
  line-height: 0;
  margin: 0;
}
</style>
