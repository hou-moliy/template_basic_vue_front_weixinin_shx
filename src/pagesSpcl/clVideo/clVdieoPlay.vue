<template>
  <view
    class="page"
    :style="{ height: height }"
  >
    <swiper
      class="swiper"
      :vertical="true"
      :current="index"
      @change="changeCurrent"
      @animationfinish="animationFinish"
    >
      <template v-if="videoList.length">
        <swiper-item
          v-for="(item, idx) in videoList"
          :key="idx"
          class="swiper-item"
        >
          <full-screen-video :video-detail="item" />
        </swiper-item>
      </template>
    </swiper>
  </view>
</template>

<script>
import videoService from "@/api/cx/video.js";
import Util, { formatCount } from "@/utils/tools.js";
export default {
  name: "ClVideoPlay",
  data () {
    return {
      staticImgs: this.$staticImgs,
      height: "",
      index: 0,
      playCount: 2, // 剩余多少视频加载视频列表
      videoList: [],
      pageNum: 1,
      pageSize: 6,
      id: "",
      popTit: "温馨提示",
      loginCont: "您还没有登录，请先完成登录",
      panelShow: false,
      pagesFlag: true,
      currentList: "",
      autoLoadData: false,
      userClLibraryData: [],
      isFirstPlay: false,
      purchaseIndexIsShow: false,
      purchaseVideoMes: {},
      btnType: "",
      isClickLike: false,
      labelId: -1,
      totalNum: 0,
      onLoadId: -1,
      isFirst: false,
      isPlayFromIndex: false,
      isPause: false,
      isRequest: false,
      loadMoreVideoCount: 2,
      isNewIphone: false,
      actions: {
        set: true,
        like: true,
        share: true,
        preview: true,
      }, // 是否展示设置按钮，默认展示
      shareObj: {},
      shareFlag: false,
      shareId: "",
      navMarginHeight: 0, // 自定义导航栏外边距
      navHeight: 0, // 自定义导航栏高度
      shareStatus: false, // 是否由分享进入
      userLikeVideoList: [],
      playStatus: "", // 是否是组件 状态   0-非组件  1-组件
      moduleId: "", // page_config 的 moduleId
      notModulId: "", // 非组件 id
      orderParams: {}, // 传输到 订购组件
    };
  },

  watch: {
    index (newVal, oldVal) {
      const len = this.videoList.filter((item) => item.url).length;
      // 加载视频
      if (len - this.index - 1 < this.playCount) {
        // this.pushVideoList();
      }
      this.oldIndex = oldVal;
    },
  },

  onLoad ({
    id,
    autoLoadData,
    actions,
    share,
    playStatus,
    moduleId,
    notModulId,
  }) {
    this.videoList = this.$store.state.spcl.videoList;
    // console.log("moduleId---", moduleId);
    // this.shareStatus = share;
    // this.shareObj = {
    //   autoLoadData,
    //   actions,
    //   id,
    // };
    // this.orderParams = {
    //   playStatus,
    //   moduleId,
    //   notModulId,
    // };
    // console.log("share", share);
    // // 分享进入的，需要做vuex处理
    // if (share) {
    //   console.log(853);
    //   this.shareFlag = true;
    //   this.shareId = id;
    //   this.onLoadId = id;
    //   console.log("this.onLoadId", id, this.onLoadId);
    // } else {
    //   // autoLoadData 用来标记是否自动加载数据，如果需要自动加载数据则传autoLoadData，不需要自动加载则不传
    //   // this.videoList = this.$store.state.spcl.videoList;
    //   console.log("===", this.videoList);
    //   if (actions) {
    //     // this.actions = JSON.parse(actions);
    //   }
    //   this.onLoadId = id;
    //   this.index = this.videoList.findIndex((item) => item.ringId == id);
    //   uni.setStorageSync("videoPlayIndex", this.index);
    //   this.autoLoadData = autoLoadData;
    //   this.isFirst = true;
    // }
    // this.playStatus = playStatus;
    // if (moduleId) {
    //   this.moduleId = moduleId;
    // } else {
    //   this.notModulId = notModulId;
    // }
    // // 分享进入的等同第一次的缓存逻辑
    // if (uni.getStorageSync("userPlayVideo") || share) {
    //   this.isFirstPlay = false;
    // } else {
    //   this.step = 1;
    //   this.isFirstPlay = true;
    // }
    // // 根据胶囊外边距和高度计算自定义导航栏的外边距和高度
    // this.navMarginHeight = uni.getMenuButtonBoundingClientRect().top;
    // this.navHeight = uni.getMenuButtonBoundingClientRect().height;
  },

  async onShow () {
    const that = this;
    if (uni.getStorageSync("Authorization")) {
      await videoService
        .getUserLikesList({
          behaviorType: "dz",
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.userLikeVideoList = res.data.data;
          }
        });
    }

    if (this.shareFlag) {
      const flag = await this.getVideoDetail();
      that.shareFlag = false;
      if (flag) {
        that.init();
      }
    } else {
      // this.init();
    }
  },

  onShareAppMessage (res) {
    this.onLoadId = this.videoList[this.index].ringId;
    if (res.from === "button") {
      // 来自页面内分享按钮
    }
    return {
      title: `"${this.videoList[this.index].ringName}"太赞了！老铁看一下！`,
      path: `/pages/cxVideo/cxVideoPlay?share=true&id=${
        this.videoList[this.index].ringId
      }&autoLoadData=${this.shareObj.autoLoadData}&actions=${
        this.shareObj.actions
      }`,
      imageUrl: `${this.staticImgs}/lnmp/share_sp.png`,
    };
  },
  created () {
    console.log("created");
    uni.getSystemInfo({
      success: (res) => {
        if (res.safeArea.top === 44) {
          // that.globalData.needAdapt = true
          this.sysheight = res.windowHeight - 10;
          this.isNewIphone = true;
        } else {
          this.sysheight = res.windowHeight;
          this.isNewIphone = false;
        }
      },
    });
    // this.sysheight = uni.getSystemInfoSync().windowHeight;
    this.height = `${this.sysheight}px`;
    const width = uni.getSystemInfoSync().windowWidth;
    this.width = `${width}px`;
    this.videoList.length = 300;
    this.videoList.fill({
      src: "",
    });
  },
  onUnload () {
    console.log("onUnload");
    uni.removeStorageSync("isFromRecentPlay");
    uni.removeStorageSync("isFromMyLike");
  },
  methods: {
    formatCount,
    goBack () {
      uni.navigateBack();
    },
    goHome () {
      uni.switchTab({
        url: "/pages/liaoNingFind/views/index",
      });
    },

    getVideoDetail () {
      return videoService
        .getSpclVideoDetail({
          ringId: this.shareId,
        })
        .then((res) => {
          console.log(582);
          if (res.data.code === 200) {
            console.log("res", res.data.data);
            const newList = [];
            newList.push(res.data.data);
            this.$store.commit("spcl/getVideoList", newList);
            this.videoList = this.$store.state.videoList;
            if (
              this.shareObj.actions &&
              this.shareObj.actions !== "undefined"
            ) {
              // this.actions = JSON.parse(this.shareObj.actions);
            }
            this.onLoadId = this.shareObj.id;
            this.index = this.videoList.findIndex(
              (item) => item.ringId == this.shareObj.id,
            );
            uni.setStorageSync("videoPlayIndex", this.index);
            this.autoLoadData = this.shareObj.autoLoadData;
            // 分享进入的等同第一次的缓存逻辑
            if (uni.getStorageSync("userPlayVideo") || share) {
              this.isFirstPlay = false;
            } else {
              this.step = 1;
              this.isFirstPlay = true;
            }
            this.isFirst = true;
            return true;
          } else {
            uni.showToast({
              title: "出错啦~",
              icon: "none",
              duration: 2000,
            });
          }
        });
    },
    init () {
      console.log("onshow");
      // 获取数据
      this.isPlayFromIndex = uni.getStorageSync("isPlayFromIndex");
      this.$store.commit("spcl/getVideoList", this.$store.state.videoList);
      this.videoList = this.$store.state.videoList;
      this.index = this.videoList.findIndex(
        (item) => item.ringId == this.onLoadId,
      );
      this.videoList.forEach((item) => {
        if (this.userLikeVideoList.indexOf(item.ringId) > -1) {
          item.extraInfo.like = true;
        }
      });

      console.log("this.index", this.index);
      // 来自于可加载滑动
      const isFromRecentPlay = uni.getStorageSync("isFromRecentPlay");
      const isFromMyLike = uni.getStorageSync("isFromMyLike");
      if (isFromRecentPlay || isFromMyLike) {
        this.pageSize = 10;
      }
      this.pageNum = Math.ceil(this.videoList.length / this.pageSize) + 1;
      this.totalNum = this.$store.state.VedioListTalNum;
      this.labelId = this.$store.state.vedioLabelId;
      // 来自于最近播放页面
      console.log("this.index", this.index, "--8--", this.labelId);
      if (this.playStatus) {
        this.$analysis.dispatch("spcl_bf", this.moduleId ? this.playStatus + "_" + this.moduleId + "_" + this.videoList[this.index].ringId : this.playStatus + "_" + this.notModulId + "_" + this.videoList[this.index].ringId);
      } else {
        this.$analysis.dispatch("spcl_bf", this.videoList[this.index].ringId);
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
        videoService.getSpclUserBehavior(data).then((res) => {});
      }
    },
    animationFinish (e) {
      // #ifdef APP-PLUS
      this.changeCurrent(e);
      // #endif
    },
    getNewVedioList () {
      if (this.isRequest) {
        return;
      }
      this.isRequest = true;
      const data = {
        labelId: this.labelId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      videoService.getSpclLabelVideoList(data).then((res) => {
        this.isRequest = false;
        if (res.data.code === 200) {
          const tempList = Util.SplitArray(res.data.data.records, this.videoList);
          // 分享和喜欢数据格式化
          // for (let i = 0; i < tempList.length; i++) {
          // 	if (tempList[i].extraInfo) {
          // 		tempList[i].extraInfo.likeCount = Util.formatCount(tempList[i].extraInfo.likeCount);
          // 		tempList[i].extraInfo.shareCount = Util.formatCount(tempList[i].extraInfo.shareCount);
          // 	}
          // }
          if (
            uni.getStorageSync("Authorization") &&
            uni.getStorageSync("userData")[0] &&
            uni.getStorageSync("userData")[0].vrbtResponse
          ) {
            const isBuyList = uni.getStorageSync("userData")[0].vrbtResponse;
            for (let i = 0; i < tempList.length; i++) {
              const isBuy = isBuyList.filter(
                (item) => tempList[i].ringId === item.ringId,
              );
              if (isBuy[0]) {
                tempList[i].isBuyVideo = true;
              }
            }
          }
          this.pageNum++;
          this.videoList = tempList;
          this.$store.commit("", this.videoList);
        }
      });
    },
    getMoreMyLikeVideoPlayList () {
      if (this.isRequest) {
        return;
      }
      this.isRequest = true;
      const data = {
        behaviorType: "dz",
        start: this.pageNum,
        pageCount: this.pageSize,
      };

      videoService.getBehaviorList(data).then((res) => {
        this.isRequest = false;
        if (res.data.code === 200) {
          const tempList = Util.SplitArray(res.data.data.records, this.videoList);
          // for (let i = 0; i < tempList.length; i++) {
          // 	if (tempList[i].extraInfo) {
          // 		tempList[i].extraInfo.likeCount = Util.formatCount(tempList[i].extraInfo.likeCount);
          // 		tempList[i].extraInfo.shareCount = Util.formatCount(tempList[i].extraInfo.shareCount);
          // 	}
          // }
          if (
            uni.getStorageSync("Authorization") &&
            uni.getStorageSync("userData")[0] &&
            uni.getStorageSync("userData")[0].vrbtResponse
          ) {
            const isBuyList = uni.getStorageSync("userData")[0].vrbtResponse;
            for (let i = 0; i < tempList.length; i++) {
              const isBuy = isBuyList.filter(
                (item) => tempList[i].ringId === item.ringId,
              );
              if (isBuy[0]) {
                tempList[i].isBuyVideo = true;
              }
            }
          }
          this.videoList = tempList;
          this.pageNum++;
          this.$store.commit("spcl/getVideoList", this.videoList);
        }
      });
    },
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
      videoService.getBehaviorList(data).then((res) => {
        this.isRequest = false;
        if (res.data.code === 200) {
          const tempList = Util.SplitArray(res.data.data.records, this.videoList);
          // 分享和喜欢数据格式化
          // for (let i = 0; i < tempList.length; i++) {
          // 	if (tempList[i].extraInfo) {
          // 		tempList[i].extraInfo.likeCount = Util.formatCount(tempList[i].extraInfo.likeCount);
          // 		tempList[i].extraInfo.shareCount = Util.formatCount(tempList[i].extraInfo.shareCount);
          // 	}
          // }
          if (
            uni.getStorageSync("Authorization") &&
            uni.getStorageSync("userData")[0] &&
            uni.getStorageSync("userData")[0].vrbtResponse
          ) {
            const isBuyList = uni.getStorageSync("userData")[0].vrbtResponse;
            for (let i = 0; i < tempList.length; i++) {
              const isBuy = isBuyList.filter(
                (item) => tempList[i].ringId === item.ringId,
              );
              if (isBuy[0]) {
                tempList[i].isBuyVideo = true;
              }
            }
          }
          if (
            uni.getStorageSync("Authorization") &&
            uni.getStorageSync("userData")[0] &&
            uni.getStorageSync("userData")[0].vrbtResponse
          ) {
            const isBuyList = uni.getStorageSync("userData")[0].vrbtResponse;
            for (let i = 0; i < tempList.length; i++) {
              const isBuy = isBuyList.filter(
                (item) => tempList[i].ringId === item.ringId,
              );
              if (isBuy[0]) {
                tempList[i].isBuyVideo = true;
              }
            }
          }
          this.pageNum++;
          this.videoList = tempList;
          this.$store.commit("spcl/getVideoList", this.videoList);
        }
      });
    },
    changeCurrent (e) {
      // console.log('滑动', e.detail.current, this.videoList.length)
      this.index = e.detail.current;
      this.isPause = false;
      if (this.isFirstPlay) {
        this.isFirstPlay = false;
      }
      if (this.playStatus) {
        this.$analysis.dispatch("spcl_bf", this.moduleId ? this.playStatus + "_" + this.moduleId + "_" + this.videoList[this.index].ringId : this.playStatus + "_" + this.notModulId + "_" + this.videoList[this.index].ringId);
      } else {
        this.$analysis.dispatch("spcl_bf", this.videoList[this.index].ringId);
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
        videoService.getSpclUserBehavior(data).then((res) => {});
      }
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
          // console.log('加载新数据')
          this.getNewVedioList();
        }
      }
    },
    playEnd () {},
    // 设置视频彩铃
    szEvent (items) {
      // this.$analysis.dispatch("cl_sz", "全面屏");
      if (uni.getStorageSync("Authorization")) {
        this.purchaseVideoMes = items;
        this.btnType = "openAndPurchase";
        this.$refs.popup_open_status.open();
      } else {
        this.$refs.popup_login.open();
      }
    },
    popIsFinished (data) {
      if (data.videoId) {
        // 修改数据
        const tempList = this.videoList;
        for (let i = 0; i < tempList.length; i++) {
          const isBuy = tempList.filter(
            (item) => tempList[i].ringId === data.videoId,
          );
          if (isBuy[0]) {
            tempList[i].isBuyVideo = true;
          }
        }
        this.videoList = tempList;
      }
      this.purchaseVideoMes = {};
      this.btnType = "";
      this.$refs.popup_open_status.close();
    },
    navigateToPages (path) {
      uni.navigateTo({
        url: path,
      });
    },
    // 未开通签名弹窗关闭
    close (done) {
      done();
    },
    // 登录弹框确认
    login_confirm (done, value) {
      // this.$analysis.dispatch("cl_login", "全面屏");
      // 输入框的值
      uni.navigateTo({
        url: "/pagesD/my/login",
      });
      done();
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.swiper {
  flex: 1;
  background-color: #000;
  position: relative;
  .swiper-item {
    flex: 1;
  }
}

</style>
