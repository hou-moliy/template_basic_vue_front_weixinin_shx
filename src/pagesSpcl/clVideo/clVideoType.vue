<template>
  <view class="video-type-page">
    <scroll-view
      v-show="pageName === 'more'"
      scroll-x="ture"
      class="video-type-scroll"
      show-scrollbar="false"
      scroll-left="15px"
      scroll-right="15px"
    >
      <view class="video-type-scroll-box">
        <text
          v-for="(item, index) in lableList"
          :key="item.labelId"
          :class="[
            'video-type-item',
            currentTab == item.labelId ? 'video-type-item-selected' : '',
          ]"
          :data-current="item.labelId"
          @click="swichNav($event, item, index)"
        >
          {{ item.labelName }}
        </text>
      </view>
    </scroll-view>
    <!-- 竖屏 -->
    <view
      v-if="showDirection === 'V'"
      class="more-news-column"
      :class="{ 'news-style': pageName !== 'more' }"
    >
      <waterfall :column-count="3" :column-width="auto" class="waterfall-box">
        <view
          v-if="specialNews != ''"
          class="waterfall-column waterfall-column-left"
        >
          <view v-for="(item, index) in specialNews" :key="index">
            <template v-if="index % 2 === 0">
              <!-- 广告 -->
              <view
                v-if="item.labelType === 1"
                class="ad-box"
                @click="goToByEventType(item)"
              >
                <image
                  :src="
                    item.coverUrl
                      ? item.coverUrl
                      : item.openVCoverUrl
                      ? item.openVCoverUrl
                      : item.openHCoverUrl
                  "
                  class="ad-img"
                />
              </view>
              <!-- 元素 -->
              <view v-else class="video-box-new more-new-item-column">
                <view
                  :data-url="
                    '/pagesSpcl/clVideo/clVideoPlay?id=' +
                    item.ringId +
                    `&playStatus=${playStatus}` +
                    '&moduleId=' +
                    currentTab
                  "
                  @click="goToPlayVideo($event, specialNews)"
                >
                  <view class="img-box-more">
                    <view class="poster-box">
                      <image
                        class="poster-btn"
                        :src="`${staticImgs}/shxmp/init/video-play-icon.png`"
                      />
                    </view>
                    <image
                      class="new-img"
                      mode="aspectFill"
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
                        :src="`${staticImgs}/shxmp/init/share-icon.png`"
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
                        :src="`${staticImgs}/shxmp/init/dzed-icon.png`"
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
                        :src="`${staticImgs}/shxmp/init/dz-icon.png`"
                        class="like-icon icon"
                      />
                      <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
                    </view>
                  </view>
                  <view v-if="item.isBuyVideo" class="setting-btn-isBuy">
                    已设置
                  </view>
                  <view v-else class="setting-btn" @click="purchaseVideo(item)">
                    设置
                  </view>
                </view>
              </view>
            </template>
          </view>
        </view>
        <view class="waterfall-column">
          <view v-for="(item, index) in specialNews" :key="index">
            <template v-if="index % 2 !== 0">
              <!-- 广告 -->
              <view
                v-if="item.labelType === 1"
                class="ad-box"
                @click="goToByEventType(item)"
              >
                <image
                  :src="
                    item.coverUrl
                      ? item.coverUrl
                      : item.openVCoverUrl
                      ? item.openVCoverUrl
                      : item.openHCoverUrl
                  "
                  class="ad-img"
                />
              </view>
              <view v-else class="video-box-new more-new-item-column">
                <view
                  :data-url="
                    '/pagesSpcl/clVideo/clVideoPlay?id=' +
                    item.ringId +
                    `&playStatus=${playStatus}` +
                    '&moduleId=' +
                    currentTab
                  "
                  @click="goToPlayVideo($event, specialNews)"
                >
                  <view class="img-box-more">
                    <view class="poster-box">
                      <image
                        class="poster-btn"
                        :src="`${staticImgs}/shxmp/init/video-play-icon.png`"
                      />
                    </view>
                    <image
                      class="new-img"
                      mode="aspectFill"
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
                        :src="`${staticImgs}/shxmp/init/dzed-icon.png`"
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
                        :src="`${staticImgs}/shxmp/init/dz-icon.png`"
                        class="like-icon icon"
                      />
                      <text>{{ formatCount(item.extraInfo.likeCount) }}</text>
                    </view>
                  </view>
                  <view v-if="item.isBuyVideo" class="setting-btn-isBuy">
                    已设置
                  </view>
                  <view v-else class="setting-btn" @click="purchaseVideo(item)">
                    设置
                  </view>
                </view>
              </view>
            </template>
          </view>
        </view>
      </waterfall>
    </view>
    <!-- 横屏 -->
    <view
      v-else
      class="more-news-row"
      :class="{ 'news-style': pageName !== 'more' }"
    >
      <view
        v-for="(item, index) in specialNews"
        :key="index"
        class="more-new-item-row"
      >
        <view
          :data-url="
            '/pagesSpcl/clVideo/clVideoPlay?id=' +
            item.ringId +
            `&playStatus=${playStatus}` +
            '&moduleId=' +
            currentTab
          "
          @click="goToPlayVideo($event, specialNews)"
        >
          <view class="img-box-more">
            <view class="poster-box">
              <image
                class="poster-btn"
                :src="`${staticImgs}/shxmp/init/video-play-icon.png`"
              />
            </view>
            <image
              class="new-img"
              mode="aspectFill"
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
                :src="`${staticImgs}/shxmp/init/share-icon.png`"
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
          <view v-if="item.isBuyVideo" class="setting-btn-isBuy">已设置</view>
          <view v-else class="setting-btn" @click="purchaseVideo(item)">
            设为视频彩铃
          </view>
        </view>
      </view>
    </view>
    <uni-load-more
      class="loadingicon"
      icon-size="20"
      icon-type="circle"
      :status="isLoadStatus"
      :content-text="contentText"
    />
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
import videoService from "@/api/cx/video.js";
import Util, { formatCount } from "@/utils/tools.js";
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
import { handlePurchaseVideo, videoInfoUpdate } from "@/utils/video.js";

export default {
  components: {
    uniLoadMore,
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      playStatus: undefined,
      specialNews: [],
      currentTab: "",
      lableList: [],
      pageNum: 1,
      pageSize: 6,
      isLoad: "loading",
      isLoadStatus: "loading",
      showDirection: "V",
      pageName: "",
      purchaseIndexIsShow: false,
      purchaseVideoMes: {},
      btnType: "",
      popTit: "温馨提示",
      loginCont: "您还没有登录，请先完成登录",
      totalNum: 0,
      index: 0,
      isClickLike: false,
      init: true,
      shareObj: {},
      isIop: false,
      orderParams: {}, // 传输到 订购组件
      windowAllList: [], // 弹窗列表
      popupInfo: {}, // 弹窗内容
      choosePopupShow: false, // 是否展示底部弹窗
      selectLabel: [], // 已选择标签
      iopLabel: [], // iop 标签选择
      contentText: {
        contentdown: "查看更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多了",
      },
      operitionInfo: {}, // 订购弹窗的内容
      operitionBtnClick: (e) => { }, // 订购弹窗按钮回调
    };
  },
  onLoad (option) {
    console.log("option852", option);

    this.playStatus = option.moduleId ? "1" : "0";
    this.orderParams = {
      playStatus: this.playStatus,
      moduleId: option.moduleId,
      notModulId: option.typeId,
    };
    if (option.typeId) {
      this.currentTab = option.typeId;
      uni.setStorageSync("recomendLabel", option.typeId);
    }
    if (option.moduleId && option.moduleId !== "null") {
      this.currentTab = option.moduleId;
      uni.setStorageSync("recomendLabel", option.moduleId);
    }
    if (option.pageName && option.pageName !== "undefined") {
      this.pageName = option.pageName;
      this.showDirection = option.showDirection;
      console.log("this.showDirection", this.showDirection);
      uni.setStorageSync("isRecomend", this.pageName);
      uni.setNavigationBarTitle({
        title: this.pageName,
      });
    } else {
      this.pageName = "more";
      uni.setStorageSync("isRecomend", "more");
    }
    this.shareObj = option;
  },
  onShow () {
    this.dispatchPageEvent();
    this.isLoadStatus = "loading";
    this.selectLabel = [];
    this.$store.commit(
      "spcl/getVideoListFromCxVideoType",
      this.$store.state.spcl.videoListFromCxVideoType,
    );

    // 获取分类
    if (uni.getStorageSync("isRecomend") === "more") {
      console.log("没有标识---");
      this.pageNum = 1;
      this.getSpclLabelList();
    } else {
      // console.log('特定专题')
      this.pageNum = 1;
      if (this.$store.state.spcl.videoListFromCxVideoType.length > 0 && !this.init) {
        this.pageNum =
          Math.ceil(
            this.$store.state.spcl.videoListFromCxVideoType.length / this.pageSize,
          ) + 1;
        this.isLoadStatus =
          this.$store.state.spcl.videoListFromCxVideoType.length < this.totalNum
            ? "more"
            : "noMore";
        this.specialNews = this.$store.state.spcl.videoListFromCxVideoType;
      }
      if (this.isLoadStatus !== "noMore") {
        this.init = false;
        this.getSpclVideoList();
      }
      this.currentTab = uni.getStorageSync("recomendLabel");
    }
  },
  onHide () {
    this.offMonitor();
    uni.setStorageSync("videoTypeIndex", this.index);
  },
  // 下拉到底部
  onReachBottom () {
    // 请求列表
    console.log("下拉到底部");
    if (this.isLoad === "loading") {
      return;
    }
    if (this.totalNum <= this.specialNews.length) {
      return;
    }
    if (this.isLoadStatus === "noMore") {
      return;
    }
    this.getSpclVideoList();
  },
  methods: {
    formatCount,
    // 跨页面通信监听
    dispatchPageEvent () {
      uni.$on("openLoginPopup", data => {
        this.$showLoginPop(this);
      });
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
      uni.$off("openLoginPopup");
      uni.$off("operitionShow");
    },
    closePopup () {
      this.operitionInfo = {};
      this.$store.commit("window/SET_OPERITION_SHOW", false);
    },
    // 设置视彩
    purchaseVideo (item) {
      if (!uni.getStorageSync("Authorization")) {
        // 提示登录
        this.$showLoginPop(this);
      } else {
        // 处理视频彩铃设置
        handlePurchaseVideo(item, this.ispurchaseVideo(item));
      }
    },
    // 设置成功
    ispurchaseVideo (item) {
      // 修改按钮为已设置
      const isSet = this.specialNews.filter((i) => {
        return i.ringId === item.ringId;
      });
      isSet[0].isBuyVideo = true;
    },
    // 分享
    shareVideo (e) {
      if (!uni.getStorageSync("Authorization")) {
        // 提示登录
        this.$showLoginPop(this);
      } else {
        const params = {
          ringId: e.currentTarget.dataset.videoid,
          target: "fx",
          mainId: this.orderParams.moduleId
            ? this.orderParams.moduleId
            : this.orderParams.notModulId,
          pageName: this.orderParams.playStatus,
        };
        videoService.getSpclUserBehavior(params).then((res) => { });
        // 生成海报
        uni.navigateTo({
          url:
            "/pagesCommon/share/shareVideo?videoId=" +
            e.currentTarget.dataset.videoid,
        });
      }
    },
    // 播放
    goToPlayVideo (e, videoList) {
      console.log("去看视频");
      this.$store.commit("spcl/M_changeVideoList", videoList);
      this.$store.commit("spcl/getVideoLabelId", this.currentTab);
      this.$store.commit("spcl/getVedioListTalNum", this.totalNum);
      uni.navigateTo({
        url: e.currentTarget.dataset.url,
      });
    },
    // 点赞
    likeVideo (e, index, flag) {
      if (!uni.getStorageSync("Authorization")) {
        // 提示登录
        this.$showLoginPop(this);
      } else {
        if (this.isClickLike) return;
        this.isClickLike = true;
        this.handlelikeVideo(e, index, flag);
      }
    },
    handlelikeVideo (e, index, flag) {
      const ringId = e.currentTarget.dataset.videoid;
      const data = {
        ringId,
        target: "dz",
        opType: flag ? 0 : 1,
        mainId: this.orderParams.moduleId
          ? this.orderParams.moduleId
          : this.orderParams.notModulId,
        pageName: this.orderParams.playStatus,
      };
      this.$store.dispatch("spcl/handleSpclUserOperate", data).then(res => {
        this.isClickLike = false;
        if (res.code === 200) {
          // 取消点赞
          if (flag) {
            this.$toast("取消点赞成功");
            const tempList = this.specialNews.filter(
              (item) => ringId === item.ringId,
            );
            tempList[0].extraInfo.like = false;
            tempList[0].extraInfo.likeCount -= 1;
            this.$set(this.specialNews, index, tempList[0]);
            // 更新数据
            this.updateData(index);
          } else {
            this.$toast("点赞成功");
            const tempList = this.specialNews.filter(
              (item) => ringId === item.ringId,
            );
            tempList[0].extraInfo.like = true;
            tempList[0].extraInfo.likeCount += 1;
            this.$set(this.specialNews, index, tempList[0]);
            // 更新数据
            this.updateData(index);
          }
        } else {
          this.$toast(res.message);
        }
      });
    },
    // 数据更新
    updateData (index) {
      // 更新我的喜欢数据
      this.$store.commit("spcl/UPDATE_MY_LIKE_IDS", this.specialNews[index]);
      // 更新更多精彩数据
      this.changeStoreLike(this.$store.state.spcl.moreVideoList, "spcl/getMoreVideoList", index);
      // 更新视彩分类视频列表
      this.changeStoreLike(this.$store.state.spcl.videoListFromCxVideoType, "spcl/getVideoListFromCxVideoType", index);
      // 更新搜索数据
      this.changeStoreLike(this.$store.state.spcl.searchList, "spcl/getSearchList", index);
    },
    // 更新vux关于like
    changeStoreLike (typeVideoList, storeMutations, index) {
      const currentVideoId = this.specialNews[index].ringId;
      const videoList = typeVideoList;
      const currentIndex = videoList.findIndex(
        (item) => currentVideoId === item.ringId,
      );
      if (currentIndex > -1) {
        videoList[currentIndex].extraInfo.likeCount += 1;
        videoList[currentIndex].extraInfo.like = true;
        this.$store.commit(storeMutations, videoList);
      }
    },
    // 运营位
    goToByEventType (item) {
      Util.navigateToAny(item);
    },
    // 获取专题分类
    getSpclLabelList () {
      const data = {
        isShow: 1,
      };
      const vedioTypeIndex = uni.getStorageSync("videoTypeIndex");
      videoService.getSpclLabel(data).then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          this.lableList = res.data.data;
          this.currentTab = res.data.data[this.index].labelId;
          if (vedioTypeIndex) {
            this.showDirection = res.data.data[vedioTypeIndex].showDirection;
          } else {
            this.showDirection = res.data.data[0].showDirection;
          }
          if (
            this.$store.state.spcl.videoListFromCxVideoType.length > 0 &&
            !this.init
          ) {
            this.pageNum =
              Math.ceil(
                this.$store.state.spcl.videoListFromCxVideoType.length /
                this.pageSize,
              ) + 1;
            this.isLoadStatus =
              this.$store.state.spcl.videoListFromCxVideoType.length < this.totalNum
                ? "more"
                : "noMore";
            this.specialNews = this.$store.state.spcl.videoListFromCxVideoType;
          }
          // 获取列表
          if (this.isLoadStatus !== "noMore") {
            this.init = false;
            this.getSpclVideoList();
          }
        }
      });
    },
    swichNav (e, item, index) {
      this.index = index;
      if (this.isLoad === "loading") {
        return;
      }
      if (this.currentTab === e.currentTarget.dataset.current) {
        return false;
      } else {
        this.currentTab = e.currentTarget.dataset.current;
        this.showDirection = item.showDirection;
        this.specialNews = [];
        this.totalNum = 0;
        this.pageNum = 1;
        this.getSpclVideoList();
      }
    },
    getSpclVideoList () {
      console.log("this.currentTab", this.currentTab);
      this.orderParams.notModulId = this.currentTab;
      const data = {
        labelId: this.currentTab,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.isLoad = "loading";
      this.isLoadStatus = "loading";
      videoService.getSpclLabelVideoList(data).then((res) => {
        this.isLoad = "loaded";
        if (res.data.code === 200) {
          this.totalNum = res.data.data.total;
          let tempList = Util.SplitArray(
            res.data.data.records,
            this.specialNews,
          );
          tempList = videoInfoUpdate(tempList);
          tempList = JSON.parse(JSON.stringify(tempList));
          this.specialNews = tempList;
          this.$store.commit("spcl/getVideoListFromCxVideoType", tempList);
          this.isLoadStatus =
            this.specialNews.length < this.totalNum ? "more" : "noMore";
          this.pageNum++;
        } else {
          this.isLoad = "over";
        }
      });
    },
  },
};
</script>

<style>
page {
  background-color: #f5f7f9;
}
</style>

<style lang="scss" scoped>
.video-type-page scroll-view ::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
  margin-top: 32rpx;
}

.video-type-page {
  height: 100%;
  background: #f7f8fb;
  .top-batch {
    // padding: 30rpx 32rpx 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 80rpx;
    width: 100%;
    z-index: 2;
    background-color: #f7f8fb;
    .top-batch-box {
      // width: 125rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      image {
        width: 30rpx;
        height: 30rpx;
        margin-right: 17rpx;
      }
      span {
        font-size: 26rpx;
        color: #ff6f50;
        margin-right: 32rpx;
      }
    }
  }
  .video-type-scroll-box {
    height: 100rpx;
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    padding-left: 32rpx;

    .video-type-item {
      font-family: PingFang SC, PingFang SC-Medium;
      font-size: 30rpx;
      font-weight: 500;
      text-align: center;
      color: #999999;
      padding: 10rpx 15rpx;
      word-break: keep-all;
    }

    .video-type-item-selected {
      font-size: 28rpx;
      font-weight: 700;
      background: linear-gradient(to right, #9e79ff 0%, #e180e5 65%);
      color: #fff;
      border-radius: 25rpx;
    }
  }

  .more-news-column {
    // padding-bottom: 50rpx;
    // column-count: 2;
    background: #f7f8fb;

    .waterfall-box {
      display: flex;
      // padding: 15rpx;
      padding: 0 33rpx 0 32rpx;

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
            padding: 21rpx 12rpx 15rpx 10rpx;

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
              background-color: #9e79ff;
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
            height: 69rpx;
            font-size: 28rpx;
            font-family: PingFang SC, PingFang SC-Medium;
            font-weight: 700;
            text-align: left;
            color: #333333;
            line-height: 36rpx;

            overflow: hidden;
            white-space: normal;

            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            display: -webkit-box;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            word-break: break-all;
            padding: 15rpx 12rpx 0 15rpx;
          }
        }
      }
    }
  }

  .more-news-row {
    padding: 10rpx 4% 10rpx 4%;
    background: #f7f8fb;

    // 横屏
    .more-new-item-row {
      -webkit-column-break-inside: avoid;
      background: #ffffff;
      border-radius: 10px;
      margin-bottom: 30rpx;
      width: 686rpx;
      // height: 512rpx;
      background: #ffffff;
      border-radius: 10px;

      .img-box-more {
        position: relative;
        width: 686rpx;
        height: 386rpx;

        .new-img {
          width: 686rpx;
          height: 386rpx;
          background: #ff6f50;
          border-radius: 20rpx 20rpx 0rpx 0rpx;
        }

        .poster-box {
          position: absolute;
          width: 686rpx;
          height: 386rpx;
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
        width: 686rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20rpx 20rpx 20rpx;
        box-sizing: border-box;

        .icon-box-in {
          display: flex;
          align-items: center;
          // justify-content: space-between;
          width: 280rpx;

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
            width: 110rpx;

            .icon {
              width: 30rpx;
              height: 30rpx;
              margin-right: 3rpx;
            }
          }

          .share-item {
            margin-right: 50rpx;
          }
        }

        .setting-btn {
          width: 168rpx;
          height: 54rpx;
          background: linear-gradient(to right, #ff6f50 0%, #ff008c 100%);
          border-radius: 27rpx;

          font-size: 22rpx;
          font-family: PingFang SC Medium, PingFang SC Medium-Medium;
          font-weight: 500;

          color: #ffffff;
          line-height: 54rpx;
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
        box-sizing: border-box;
        width: 686rpx;
        font-size: 30rpx;
        font-family: PingFang SC Bold, PingFang SC Bold-Bold;
        font-weight: 700;
        text-align: left;
        color: #333333;
        line-height: 36rpx;
        padding: 20rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .news-style {
    padding-top: 43rpx;
  }

  .loadingicon {
    margin-bottom: 20rpx;
  }
}
::v-deep .uni-load-more {
  background-color: #f5f7f9;
}
.btn-batch {
  padding-bottom: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .btn-batch-box1 {
    margin: 34rpx 32rpx 0;
    background-color: #f7f6f9;
    border-radius: 10rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn-batch-box {
      width: 126rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 18rpx 0;
      image {
        width: 30rpx;
        height: 30rpx;
      }
      span {
        font-size: 26rpx;
        color: #ff6f50;
      }
    }
  }
}
</style>
