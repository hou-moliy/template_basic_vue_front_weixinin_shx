<template>
  <view>
    <!-- 竖屏 -->
    <view class="more-news-column">
      <waterfall
        :column-count="3"
        :column-width="auto"
        class="waterfall-box"
      >
        <view class="waterfall-column waterfall-column-left">
          <view
            v-for="(item, index) in selectList"
            v-if="index % 2 === 0"
            :key="index"
          >
            <!-- 元素 -->
            <view class="video-box-new more-new-item-column">
              <view
                :data-url="'/pages/cxVideo/cxVideoPlay?id=' + item.ringId"
                @click="goToPlayVideo($event, selectList)"
              >
                <view class="img-box-more">
                  <!-- <view class="poster-box">
                    <image
                      class="poster-btn"
                      :src="`${staticImgs}/lnmp/play.png`"
                    ></image>
                  </view> -->
                  <image
                    mode="aspectFill"
                    class="new-img"
                    :src="
                      item.coverUrl
                        ? item.coverUrl
                        : item.openVCoverUrl
                          ? item.openVCoverUrl
                          : item.openHCoverUrl
                    "
                  />
                </view>

                <view class="morel-new-title">
                  {{ item.ringName }}
                </view>
              </view>

              <view class="icon-box">
                <view class="icon-box-in">
                  <view
                    class="icon-item share-item"
                    :data-videoId="item.ringId"
                    @click="shareVideo($event)"
                  >
                    <image
                      :src="`${staticImgs}/lnmp/share-icon.png`"
                      class="share-icon icon"
                    />
                    <text>{{ formatCount(item.extraInfo.shareCount) }}</text>
                  </view>
                  <view
                    v-if="item.extraInfo.like"
                    class="icon-item like-item"
                    :data-videoId="item.ringId"
                    @click="likeVideo($event, index, true)"
                  >
                    <image
                      :src="`${staticImgs}/lnmp/dzed-icon.png`"
                      class="like-icon icon"
                    />
                    <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
                  </view>
                  <view
                    v-else
                    class="icon-item like-item"
                    :data-videoId="item.ringId"
                    @click="likeVideo($event, index, false)"
                  >
                    <image
                      :src="`${staticImgs}/lnmp/dz-icon.png`"
                      class="like-icon icon"
                    />
                    <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
                  </view>
                </view>
                <view
                  v-if="item.isBuyVideo"
                  class="setting-btn-isBuy"
                >
                  已设置
                </view>
                <view
                  v-else
                  class="setting-btn"
                  @click="purchaseVideo(item)"
                >
                  设置
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="waterfall-column">
          <view
            v-for="(item, index) in selectList"
            v-if="index % 2 !== 0"
            :key="index"
          >
            <view class="video-box-new more-new-item-column">
              <view
                :data-url="'/pages/cxVideo/cxVideoPlay?id=' + item.ringId"
                @click="goToPlayVideo($event, selectList)"
              >
                <view class="img-box-more">
                  <!-- <view class="poster-box">
                    <image
                      class="poster-btn"
                      :src="`${staticImgs}/lnmp/play.png`"
                    ></image>
                  </view> -->
                  <image
                    mode="aspectFill"
                    class="new-img"
                    :src="
                      item.coverUrl
                        ? item.coverUrl
                        : item.openVCoverUrl
                          ? item.openVCoverUrl
                          : item.openHCoverUrl
                    "
                  />
                </view>

                <view class="morel-new-title">
                  {{ item.ringName }}
                </view>
              </view>

              <view class="icon-box">
                <view class="icon-box-in">
                  <view
                    class="icon-item share-item"
                    :data-videoId="item.ringId"
                    @click="shareVideo($event)"
                  >
                    <image
                      :src="`${staticImgs}/lnmp/share-icon.png`"
                      class="share-icon icon"
                    />
                    <text>{{ formatCount(item.extraInfo.shareCount) }}</text>
                  </view>
                  <view
                    v-if="item.extraInfo.like"
                    class="icon-item like-item"
                    :data-videoId="item.ringId"
                    @click="likeVideo($event, index, true)"
                  >
                    <image
                      :src="`${staticImgs}/lnmp/dzed-icon.png`"
                      class="like-icon icon"
                    />
                    <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
                  </view>
                  <view
                    v-else
                    class="icon-item like-item"
                    :data-videoId="item.ringId"
                    @click="likeVideo($event, index, false)"
                  >
                    <image
                      :src="`${staticImgs}/lnmp/dz-icon.png`"
                      class="like-icon icon"
                    />
                    <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
                  </view>
                </view>
                <view
                  v-if="item.isBuyVideo"
                  class="setting-btn-isBuy"
                >
                  已设置
                </view>
                <view
                  v-else
                  class="setting-btn"
                  @click="purchaseVideo(item)"
                >
                  设置
                </view>
              </view>
            </view>
          </view>
        </view>
      </waterfall>
    </view>

    <!-- 登录 -->
    <!-- <view>
      <uni-popup
        ref="popup_login"
        type="dialog"
      >
        <uni-popup-dialog
          type="info"
          mode="base"
          :title="popTit"
          :content="loginCont"
          before-close="true"
          @close="close"
          @confirm="login_confirm"
        />
      </uni-popup>
    </view> -->
    <!-- 购买状态 -->
    <!-- <view>
      <uni-popup
        ref="popup_open_status"
        type="dialog"
      >
        <purchaseIndex
          :btn-type="btnType"
          :video-mes="purchaseVideoMes"
          @isFinished="popIsFinished"
        />
      </uni-popup>
    </view> -->
  </view>
</template>

<script>
// import uniPopup from "@/components/uni-popup/uni-popup.vue";
// import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
// import purchaseIndex from "@/components/purchase-popup/index.vue";
import videoService from "@/api/cx/video.js";
import { formatCount } from "@/utils/tools.js";
const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.loop = true;
export default {
  name: "CxVideoSearchList",
  // components: {
  //   uniPopup,
  //   purchaseIndex,
  //   uniPopupDialog,
  // },
  props: {
    pageStatusLoad: false,
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
    };
  },
  watch: {
    pageStatusLoad (value) {
      // console.log(value, "搜索列表页面");
      if (value === "onShow") {
        if (this.$store.state.spcl.searchList.length > 0) {
          this.$store.commit("spcl/getSearchList", this.$store.state.searchList);
          this.selectList = this.$store.state.spcl.searchList;
          // console.log("仓库搜索列表", this.selectList);
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
  methods: {
    formatCount,
    // 弹窗点击-取消登录
    close (done) {
      done();
    },
    // 登录弹框确认
    login_confirm (done, _value) {
      // 输入框的值
      uni.navigateTo({
        url: "/pagesD/my/login",
      });
      done();
    },
    navigateToSelector () {
      uni.navigateTo({
        url: "/pagesD/my/login",
      });
    },
    stopMusic () {
      innerAudioContext.pause();
      innerAudioContext.onPause(() => {
        // console.log("暂停播放");
        this.playStatus = "play";
      });
      innerAudioContext.onError((_res) => {
        // console.log(res.errMsg);
        // console.log(res.errCode);
      });
    },
    set () {
      // console.log("设置");
    },
    purchaseVideo (videoMes) {
      if (!uni.getStorageSync("Authorization")) {
        this.$refs.popup_login.open();
      } else {
        this.purchaseVideoMes = videoMes;
        this.btnType = "openAndPurchase";
        this.$refs.popup_open_status.open();
      }
    },
    // 订购完成
    popIsFinished (data) {
      // 订购成功
      if (data.videoId) {
        // 修改数据
        const tempList = this.selectList;
        for (let i = 0; i < tempList.length; i++) {
          const isBuy = tempList.filter(
            (_item) => tempList[i].ringId === data.videoId,
          );
          if (isBuy[0]) {
            tempList[i].isBuyVideo = true;
          }
        }
        this.selectList = tempList;
      }
      this.purchaseVideoMes = {};
      this.btnType = "";
      this.$refs.popup_open_status.close();
    },
    goToPlayVideo (e, videoList) {
      // uni.setStorageSync("videoList", videoList);
      this.$store.commit("getVideoList", videoList);
      this.$emit("hotKeyGoToPlay", false);
      uni.navigateTo({
        url: e.currentTarget.dataset.url,
      });
    },
    shareVideo (e) {
      if (!uni.getStorageSync("Authorization")) {
        this.$refs.popup_login.open();
      } else {
        // 生成海报
        // console.log(1111111111);
        uni.navigateTo({
          url:
            "/pagesCommon/share/shareVideo?videoId=" +
            e.currentTarget.dataset.videoid,
        });
      }
    },
    // 更多精彩点赞
    likeVideo (e, index, flag) {
      const ringId = e.currentTarget.dataset.videoid;
      if (!uni.getStorageSync("Authorization")) {
        this.$refs.popup_login.open();
      } else {
        // console.log(this.isClickLike, '点击了')
        if (this.isClickLike) {
          // console.log('疯狂点击')
          return;
        }
        this.isClickLike = true;
        let data = {
          ringId,
          target: "dz",
          opType: 1,
        };
        if (flag) {
          data = {
            ringId,
            target: "dz",
            opType: 0,
          };
        }
        videoService
          .getSpclUserBehavior(data)
          .then((res) => {
            this.isClickLike = false;
            if (res.data.code === 200) {
              if (res.data.data) {
                // 取消点赞
                if (flag) {
                  uni.showToast({
                    title: "取消点赞成功",
                    icon: "none",
                    duration: 2000,
                  });

                  const specialNewsLists = this.selectList.filter(
                    (item) => ringId === item.ringId,
                  );
                  specialNewsLists[0].extraInfo.like = false;
                  specialNewsLists[0].extraInfo.likeCount -= 1;
                  this.$set(this.selectList, index, specialNewsLists[0]);
                  // 更新更多精彩数据
                  const tempMoreVideoList = this.$store.state.moreVideoList;
                  const currentIndex = tempMoreVideoList.findIndex(
                    (item) => ringId === item.ringId,
                  );
                  if (currentIndex > -1) {
                    tempMoreVideoList[currentIndex].extraInfo.likeCount -= 1;
                    tempMoreVideoList[currentIndex].extraInfo.like = false;
                    this.$store.commit("getMoreVideoList", tempMoreVideoList);
                  }
                } else {
                  uni.showToast({
                    title: "点赞成功",
                    icon: "none",
                    duration: 2000,
                  });
                  const specialNewsLists = this.selectList.filter(
                    (item) => ringId === item.ringId,
                  );
                  specialNewsLists[0].extraInfo.like = true;
                  specialNewsLists[0].extraInfo.likeCount += 1;
                  this.$set(this.selectList, index, specialNewsLists[0]);
                  // 更新更多精彩数据
                  const tempMoreVideoList = this.$store.state.moreVideoList;
                  const currentIndex = tempMoreVideoList.findIndex(
                    (item) => ringId === item.ringId,
                  );
                  if (currentIndex > -1) {
                    tempMoreVideoList[currentIndex].extraInfo.likeCount += 1;
                    tempMoreVideoList[currentIndex].extraInfo.like = true;
                    this.$store.commit("getMoreVideoList", tempMoreVideoList);
                  }
                }
              } else {
                uni.showToast({
                  title: "您已点赞",
                  icon: "none",
                  duration: 2000,
                });
              }
            } else {
              uni.showToast({
                title: res.data.message,
                icon: "none",
                duration: 2000,
              });
            }
          })
          .catch((_err) => {
            this.isClickLike = false;
            this.$toast("请求失败");
          });
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
  // padding-bottom: 50rpx;
  // column-count: 2;
  background: #f7f8fb;

  .waterfall-box {
    display: flex;
    // padding: 15rpx;
    padding: 0rpx 33rpx 0 32rpx;

    .waterfall-column-left {
      margin-right: 18rpx;
    }

    .waterfall-column {
      // display: flex;
      // flex: 1;
      // flex-direction: column;

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
        // margin-bottom: 20rpx;
        width: 334rpx;
        -webkit-column-break-inside: avoid;
        // padding-bottom: 20rpx;
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
            background: linear-gradient(to right, #ff6f50 0%, #ff008c 100%);
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
