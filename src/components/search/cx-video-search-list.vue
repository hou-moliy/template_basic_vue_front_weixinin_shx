<template>
  <view>
    <!-- 竖屏 -->
    <view class="more-news-column">
      <waterfall :column-count="3" :column-width="auto" class="waterfall-box">
        <view class="waterfall-column waterfall-column-left">
          <view v-for="(item, index) in selectList" :key="index">
            <view v-if="index % 2 === 0" class="more-new-item-column">
              <!-- 元素 -->
              <view class="video-box-new">
                <spclItem
                  :item="item"
                  inner-color="#9E79FF"
                  :spcl-style="3"
                  :data-url="'/pagesSpcl/clVideo/clVideoPlay?id=' + item.ringId"
                  @click.native="programaAnalysis(params, item.imgId)"
                  @shareVideo="shareCountChange"
                  @giveLikes="likeCountChange"
                  @openLoginPopup="openLoginPopup"
                  @goToPlayVideo="goToPlayVideo"
                />
              </view>
            </view>
          </view>
        </view>
        <view class="waterfall-column">
          <view v-for="(item, index) in selectList" :key="index">
            <view v-if="index % 2 !== 0" class="more-new-item-column">
              <view class="video-box-new">
                <spclItem
                  :item="item"
                  inner-color="#9E79FF"
                  :spcl-style="3"
                  :data-url="'/pagesSpcl/clVideo/clVideoPlay?id=' + item.ringId"
                  @click.native="programaAnalysis(params, item.imgId)"
                  @shareVideo="shareCountChange"
                  @giveLikes="likeCountChange"
                  @openLoginPopup="openLoginPopup"
                  @goToPlayVideo="goToPlayVideo"
                />
              </view>
            </view>
          </view>
        </view>
      </waterfall>
    </view>
  </view>
</template>

<script>
import { formatCount } from "@/utils/tools.js";
import {
  programaAnalysis,
} from "@/utils/common.js";
import spclItem from "@/components/eb-comp/eb-spcl-waterfalls/spclItem.vue";
const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.loop = true;
export default {
  name: "CxVideoSearchList",
  components: {
    spclItem,
  },
  props: {
    pageStatusLoad: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      playStatus: "play",
      selectList: [],
      purchaseIndexIsShow: false,
      purchaseVideoMes: {},
      btnType: "",
      popTit: "温馨提示",
      loginCont: "您还没有登录，请先完成登录",
      isClickLike: false,
      specialNewsLists: [], // 当前操作对象
    };
  },
  watch: {
    pageStatusLoad (value) {
      if (value === "onShow") {
        if (this.$store.state.spcl.searchList.length > 0) {
          this.$store.commit("spcl/getSearchList", this.$store.state.spcl.searchList);
          this.selectList = this.$store.state.spcl.searchList;
        }
      }
    },
  },
  created () {
    uni.$on("setSearchList", (selectList) => {
      this.selectList = selectList;
      this.$store.commit("spcl/getSearchList", this.selectList);
    });
  },
  onLoad () {
    uni.$on("changeSearchShareCount", () => {
      // console.log('come')
      if (this.$store.state.spcl.searchList.length > 0) {
        this.selectList = this.$store.state.spcl.searchList;
      }
    });
  },
  onShow () {
    this.dispatchPageEvent();
  },
  methods: {
    formatCount,
    programaAnalysis,
    // 跨页面通信监听
    dispatchPageEvent () {
      uni.$on("openLoginPopup", data => {
        this.$showLoginPop(this);
      });
    },
    // 暂停铃音
    stopMusic () {
      innerAudioContext.pause();
      innerAudioContext.onPause(() => {
        this.playStatus = "play";
      });
      innerAudioContext.onError((_res) => {
      });
    },
    // 播放
    goToPlayVideo (item) {
      this.$analysis.dispatch("video_play_count");
      this.$store.commit("spcl/M_changeVideoList", this.selectList);
      this.$emit("hotKeyGoToPlay", false);
      uni.navigateTo({
        url: `/pagesSpcl/clVideo/clVideoPlay?id=${item.ringId}`,
      });
    },
    // 分享
    shareCountChange (item) {
      this.$analysis.dispatch("video_share_count");
      const ringId = item.ringId;
      if (!uni.getStorageSync("Authorization")) {
        // 提示登录
        return this.$showLoginPop(this);
      } else {
        const data = {
          ringId,
          target: "fx",
        };
        this.$store.dispatch("spcl/handleSpclUserOperate", data).then(() => {
          // 更新搜索列表仓库数据
          const searchList = this.$store.state.spcl.searchList;
          const currentIndex = searchList.findIndex(searchListItem => searchListItem.ringId === ringId);
          searchList[currentIndex].extraInfo.shareCount += 1;
          const url = `/pagesCommon/share/shareVideo?videoId=${ringId}&pageName=videoPlay&shareType=1`;
          uni.navigateTo({
            url,
          });
        });
      }
    },
    // 点赞
    likeCountChange ({ ringItem, flag }) { // false 新增点赞 ，true 取消点赞
      const { ringId } = ringItem;
      const data = {
        ringId,
        target: "dz",
        opType: flag ? 0 : 1,
      };
      this.specialNewsLists = this.selectList.filter(
        (item) => ringId === item.ringId,
      );
      console.log(this.specialNewsLists, "点赞数组");
      this.$store.dispatch("spcl/handleSpclUserOperate", data).then(res => {
        if (res.code === 200) {
          if (!flag) {
            this.$toast("点赞成功");
            this.$analysis.dispatch("video_fabulous_count");
            // 将当前数据改了
            this.specialNewsLists[0].extraInfo.like = true;
            this.specialNewsLists[0].extraInfo.likeCount += 1;
            // 更新仓库里的数据
            this.updateData();
          } else {
            this.$toast("成功取消点赞");
            // 修改当前数据 更新仓库
            this.specialNewsLists[0].extraInfo.like = false;
            this.specialNewsLists[0].extraInfo.likeCount -= 1;
            this.updateData(0);
          }
        } else {
          this.$toast(res.message);
        }
      });
    },
    // 数据更新
    updateData (flag = 1) { // 1 点赞 0 取消点赞
      const index = this.$store.state.spcl.videoList.findIndex(i => i.ringId === this.specialNewsLists[0].ringId);
      const list = this.$store.state.spcl.videoList;
      list[index] = this.specialNewsLists[0];
      this.$store.commit("spcl/M_changeVideoList", list);
      // 更新我的喜欢数据
      this.$store.commit("spcl/UPDATE_MY_LIKE_IDS", this.specialNewsLists[0].ringId);
      // 更新更多精彩数据
      this.changeStoreLike(this.$store.state.spcl.moreVideoList, "spcl/getMoreVideoList", flag);
      // 更新视彩分类视频列表
      this.changeStoreLike(this.$store.state.spcl.videoListFromCxVideoType, "spcl/getVideoListFromCxVideoType", flag);
    },
    // 更新vux关于like
    changeStoreLike (typeVideoList, storeMutations, flag) {
      const currentVideoId = this.specialNewsLists[0].ringId;
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
  },
};
</script>

<style lang="scss" scoped>
.video-list {
  padding: 0 4%;

  .video-item {
    display: flex;
    align-items: center;
    padding-bottom: 24rpx;
    margin-bottom: 24rpx;
    border-bottom: 1rpx solid #e5e5e5;

    .video-img {
      width: 280rpx;
      height: 158rpx;
      background: #ff6f50;
      border-radius: 10rpx;
      margin-right: 27rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .video-des {
      height: 158rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-top: 20rpx;

      .video-title {
        width: 357rpx;
        font-size: 30rpx;
        font-family: PingFang SC Bold, PingFang SC Bold-Bold;
        font-weight: 700;
        text-align: left;
        color: #333333;
        line-height: 36rpx;
        overflow: hidden;
        white-space: normal;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }

      .icon-box {
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-box-in {
          display: flex;
          align-items: center;
          // justify-content: space-between;
          width: 210rpx;

          .icon-item {
            display: flex;
            align-items: center;
            width: 90rpx;
            font-size: 22rpx;
            font-family: PingFang SC Medium, PingFang SC Medium-Medium;
            font-weight: 500;
            text-align: left;
            color: #999999;
            line-height: 30rpx;
            text-shadow: 0px 2rpx 4rpx 0px rgba(0, 0, 0, 0.1);

            .icon {
              width: 30rpx;
              height: 30rpx;
              margin-right: 6rpx;
            }
          }

          .share-item {
            margin-right: 10rpx;
          }
        }

        .setting-btn {
          width: 168rpx;
          height: 54rpx;
          background: linear-gradient(to right, #ff6f50 0%, #ff008c 100%);
          border-radius: 27rpx;
          color: #ffffff;
          line-height: 54rpx;
          text-align: center;
          font-size: 22rpx;
          font-family: PingFang SC Medium, PingFang SC Medium-Medium;
          font-weight: 500;
          color: #ffffff;
        }

        .setting-btn-isBuy {
          width: 168rpx;
          height: 54rpx;
          background: #c6c5c8;
          border-radius: 27rpx;
          color: #ffffff;
          line-height: 54rpx;
          text-align: center;
          font-size: 22rpx;
          font-family: PingFang SC Medium, PingFang SC Medium-Medium;
          font-weight: 500;
          color: #ffffff;
        }
      }
    }
  }
}

.no-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 277rpx;

  image {
    width: 410rpx;
    height: 184rpx;
  }

  .no-info-title {
    font-size: 36rpx;
    font-family: PingFang SC Medium, PingFang SC Medium-Medium;
    font-weight: 500;
    text-align: center;
    color: #666666;
    margin-top: 89rpx;
  }

  .no-info-title-small {
    font-size: 28rpx;
    font-family: PingFang SC Regular, PingFang SC Regular-Regular;
    font-weight: 400;
    text-align: center;
    color: #999999;
    margin-top: 20rpx;
  }
}

.more-news-column {
  .waterfall-box {
    display: flex;

    padding: 0rpx 33rpx 0 32rpx;

    .waterfall-column-left {
      margin-right: 18rpx;
    }

    .waterfall-column {
      .ad-box {
        box-sizing: border-box;
        width: 334rpx;
        height: 160rpx;
        background: #f2f2f2;
        border-radius: 10rpx;

        -webkit-column-break-inside: avoid;
        margin-bottom: 25rpx;

        .ad-img {
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }
      }

      // 竖屏
      .more-new-item-column:nth-child(1) {
        margin-top: 18rpx;
      }
      .more-new-item-column {
        width: 334rpx;
        -webkit-column-break-inside: avoid;

        background: #ffffff;
        border-radius: 20rpx;
        margin-bottom: 18rpx;

        .img-box-more {
          position: relative;
          width: 334rpx;
          height: 593rpx;

          .new-img {
            width: 334rpx;
            height: 593rpx;
            background: #abcf6d;
            border-radius: 20rpx 20rpx 0px 0px;
          }

          .poster-box {
            position: absolute;
            width: 334rpx;
            height: 593rpx;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;

            .poster-btn {
              height: 77rpx;
              width: 77rpx;
              z-index: 2;
            }
          }
        }

        .icon-box {
          // width: 334rpx;
          display: flex;
          align-items: center;
          // justify-content: center;
          padding: 0 12rpx 15rpx 10rpx;

          .icon-box-in {
            display: flex;
            align-items: center;
            // justify-content: space-between;
            width: 200rpx;

            .icon-item {
              display: flex;
              align-items: center;
              font-size: 22rpx;
              font-family: PingFang SC Medium, PingFang SC Medium-Medium;
              font-weight: 500;
              text-align: left;
              color: #333333;
              line-height: 30rpx;
              text-shadow: 0px 2rpx 4rpx 0px rgba(0, 0, 0, 0.1);
              width: 90rpx;

              .icon {
                width: 30rpx;
                height: 30rpx;
                margin-right: 3rpx;
                flex-shrink: 0;
              }
            }

            .share-item {
              margin-right: 15rpx;
            }
          }

          .setting-btn {
            width: 114rpx;
            height: 48rpx;
            background: #9e79ff;
            border-radius: 24rpx;
            font-size: 24rpx;
            font-family: PingFang SC Medium, PingFang SC Medium-Medium;
            font-weight: 500;
            text-align: left;
            color: #ffffff;
            line-height: 48rpx;
            text-align: center;
          }

          .setting-btn-isBuy {
            width: 114rpx;
            height: 48rpx;
            background: #c6c5c8;
            border-radius: 24rpx;
            font-size: 24rpx;
            font-family: PingFang SC Medium, PingFang SC Medium-Medium;
            font-weight: 500;
            text-align: left;
            color: #ffffff;
            line-height: 48rpx;
            text-align: center;
            margin-right: 11rpx;
          }
        }

        .morel-new-title {
          height: 76rpx;
          font-size: 28rpx;
          font-family: PingFang SC Bold, PingFang SC Bold-Bold;
          font-weight: 700;
          text-align: left;
          color: #333333;
          line-height: 36rpx;

          overflow: hidden;
          white-space: normal;
          -webkit-line-clamp: 2;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          padding: 15rpx 12rpx 0 15rpx;
        }
      }
    }
  }
}
</style>
