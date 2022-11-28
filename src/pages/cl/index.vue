<template>
  <view class="swiper-tab">
    <view class="tab-container" :style="{ background: tabBackground }">
      <!-- 头部标题区域 -->
      <view class="title" style="margin-top: 100rpx">彩铃</view>
      <!-- 头部Tab区域 -->
      <view :class="['tab', `tab-${scrollNavStation}`]">
        <scroll-view
          class="scrollView"
          scroll-x
          show-scrollbar="false"
          :scroll-left="scrollLeft"
          scroll-with-animation
          :class="[
            'swiper-nav',
            tabList.length == 1 ? 'empty-nav' : '',
            `swiper-nav-${scrollNavStation}`,
          ]"
          @scroll="scrollNav"
        >
          <view
            class="tab-box"
            :style="{ 'justify-content': isOutWindow ? '' : 'flex-start' }"
          >
            <view
              v-for="(item, index) in tabList"
              :key="index"
              :class="['tab-item', pageName == item.pageName ? 'on' : '']"
              :data-current="index + 1"
              @click.stop="switchNavDebounce($event, item.pageUrl)"
            >
              <view>
                {{ item.name }}
                <hr
                  :style="{
                    background:
                      pageName == item.pageName
                        ? 'linear-gradient(0deg,#ff6f50 0%, #ff008c 100%);'
                        : '',
                  }"
                  class="tab-item-hr"
                />
              </view>
            </view>
          </view>
        </scroll-view>
        <view
          v-if="scrollNavStation != 'right'"
          class="tab-oper-btn"
          @click="toLastNav"
        >
          <view class="tab-item-xiangyou">
            <view class="tab-item-box" />
            <text class="iconfont icon-xiangyou" />
          </view>
        </view>
      </view>
    </view>
    <!-- 内容组件区域 -->
    <view>
      <swiper
        class="swiper"
        touchable="false"
        :current="swiperTab"
        duration="200"
        :style="{
          height: `${windowHeight}px`,
        }"
        @change="swiperChange"
      >
        <swiper-item v-for="swipeItem in tabList" :key="swipeItem.id">
          <scroll-view
            scroll-y="true"
            :style="{ height: `${windowHeight}px` }"
            @scrolltolower="scrollToLower"
            @scroll="swiperContainerScroll"
          >
            <!-- 配置化组件容器 -->
            <ebConfigContainerAsync
              key=""
              ref="EbConfig"
              :activity-id="swipeItem.activityId"
              :page-config-list="swipeItem.pageConfig"
            />
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 自定义TabBar -->
    <custom-tabbar :tab-bar="tabBar" :mid-button="true" />
    <!-- 提示性弹窗 -->
    <notifyPop ref="NotifyPop" />
    <!-- 下线通知 -->
    <offline-popup
      v-if="Boolean($store.state.offlinePopup.offlinePopupShow)"
      ref="offlinePopup"
    />
  </view>
</template>

<script>
import TemplateService from "@/api/template/index";
import Util from "@/utils/tools.js";
import ebConfigContainerAsync from "@/components/eb-comp/eb-config-container/eb-config-container-async.vue";

export default {
  name: "ClIndex",
  components: { ebConfigContainerAsync },
  data () {
    return {
      tabBar: this.$store.getters.tabbarList, // 底部导航栏
      tabList: [], // 头部Tab
      tabBackground: "transparent",
      scrollNavStation: "left", // 导航栏滑动的位置，left左端 right右端 center中间
      switchNavInfo: {}, // 当前的Tab对象
      pageName: "", // 当前的Tab栏name
      swiperTab: 0, // swiper滑动的Tab
      currentTab: 0, //
      isOutWindow: false,
      windowsWidth: 0, // 可使用窗口宽度
      windowHeight: 0, // 可使用窗口高度
      navHeight: 0, // 手机状态栏的高度
      // 埋点key
      buryKey: {
        recommend_page: {
          page: "fx_tj_pv",
          banner: "fxtj_banner_id",
          iconList: "fxtj_icon_id",
        }, // 发现推荐埋点
        stream_page: {
          page: "fx_zb_pv",
          banner: "fxzb_banner_id",
          iconList: "fxzb_icon_id",
        }, // 发现_直播_埋点
        ln_spcl_index: {
          page: "sp_pv",
          banner: "spcl_banner_id",
          iconList: "spcl_icon_id",
        }, // 发现_视频_埋点
        ln_cl_index: {
          page: "yp_pv",
          banner: "ypcl_banner_id",
          iconList: "ypcl_icon_id",
        }, // 发现_音频_埋点
        mgvideo_page: {
          page: "fx_mgsp_pv",
          banner: "fxmgsp_banner_id",
          iconList: "fxmgsp_icon_id",
        }, // 发现_咪咕视频_埋点
        mgimg_page: {
          page: "fx_mgtp_pv",
          banner: "fxmgtp_banner_id",
          iconList: "fxmgtp_icon_id",
        }, // 发现_咪咕图片_埋点
        short_video_page: {
          page: "fx_xsp_pv",
          banner: "fxxsp_banner_id",
          iconList: "fxxsp_icon_id",
        }, // 小视频
        mgame_page: {
          page: "fx_mgame_pv",
          banner: "fxmgame_banner_id",
          iconList: "fxmgame_icon_id",
        }, // 咪咕快游
        web_page: {
          page: "fx_web_pv",
          banner: "fxweb_banner_id",
          iconList: "fxweb_icon_id",
        }, // web
      },
    };
  },
  created () {
    this.getPageWidthHeight();
  },
  onLoad () {
    this.dispatchPageEvent();
  },
  onShow () {
    this.getTabList();
    this.handleFresh();
  },
  onShareAppMessage (res) {
    if (res.from === "button") {
      console.log("发现分享", res);
      // 来自页面内分享按钮
      const { type, shareParams } = res.target.dataset;
      console.log("type", type);
      if (type === "image-share") {
        return {
          imageUrl: shareParams.shareUrl,
          title: "您的好友分享给您一张海报，赶快点击看看吧～",
          path: `/pagesC/liaoNingFind/views/imageShare/image-open-shared?imgUrl=${shareParams.imgUrl}&&shareImg=${shareParams.shareUrl}&&imgId=${shareParams.imgId}&&imgTitle=${shareParams.imgTitle}&pageName=${this.pageName}&currentTab=${this.currentTab}&share=1`,
        };
      } else if (type === "migu-share") {
        return {
          imageUrl: shareParams.shareUrl,
          title: `您的好友邀请您观看${shareParams.title}视频，赶快点击看看吧～`,
          path: `/pagesC/liaoNingFind/views/littleVideo/littleVideo?videoId=${shareParams.videoId}&type=${shareParams.type}&share=1&pageName=${this.pageName}&currentTab=${this.currentTab}`,
        };
      }
    } else {
      // 主页分享
      return {
        title:
          "您的好友邀您使用辽宁移动5G助手小程序，好听、好看、好玩快来体验吧～",
        path: `/pages/liaoNingFind/views/index?currentTab=${this.currentTab}&pageName=${this.pageName}&share=1`,
      };
    }
  },
  methods: {
    handleFresh () {
      if (this.$refs.EbConfig) {
        this.$refs.EbConfig[this.swiperTab].handleFresh();
      }
    },
    // 跨页面通信监听
    dispatchPageEvent () {
      uni.$on("changeTabByMore", data => {
        this.changeTabByMore(data);
      });
      uni.$on("changeTabByMore", data => {
        this.changeTabByMore(data);
      });
      uni.$on("openLoginPopup", data => {
        console.log(data);
        this.$showLoginPop(this);
      });
    },
    // 初始化页面样式宽高等
    getPageWidthHeight () {
      uni.getSystemInfo({
        success: res => {
          console.log("bar", res);
          if (res.safeAreaInsets.bottom === 0) {
            this.windowHeight = res.windowHeight;
            // this.navHeight = res.safeArea.top;
          } else {
            this.windowHeight = res.safeArea.height;
            // this.navHeight = res.safeArea.top / 2;
          }
          this.navHeight = res.safeArea.top;
          this.windowsWidth = res.windowWidth;
        },
      });
    },
    switchNavDebounce (e) {
      this.switchNavInfo = e;
      Util.debounce(this.switchNav, 200, true)();
    },
    switchNav () {
      const { current } = this.switchNavInfo.currentTarget.dataset;
      this.swiperTab = current - 1;
      this.currentTab = current;
    },
    swiperContainerScroll (e) {
      if (e.detail.scrollTop > 30) {
        this.tabBackground = "#DDDDFF";
      } else {
        if (this.tabBackground === "#DDDDFF") {
          this.tabBackground = "transparent";
        }
      }
    },
    // 获取tabList
    async getTabList () {
      await TemplateService.getTabAndPageConfig({ tabTarget: "main" }).then(res => {
        if (res.data.code === 200) {
          this.tabList = res.data.data;
        }
        this.tabList.forEach(e => {
          e.activityId = e.pageName.split("_")[1];
        });
        if (!this.pageName) {
          this.pageName = this.tabList[0].pageName;
          this.currentTab = this.tabList.filter(
            item => item.pageName === this.pageName,
          )[0].sort;
        } else {
          this.currentTab = this.tabList.filter(
            item => item.pageName === this.pageName,
          )[0].sort;
        }
        this.swiperTab = this.currentTab ? this.currentTab - 1 : 0;
        this.checkTabOverFlow();
      });
    },
    // 判断tab是否超出屏幕
    checkTabOverFlow () {
      this.$nextTick(() => {
        // 判断tab是否超出屏幕
        uni
          .createSelectorQuery()
          .in(this)
          .selectAll(".tab-item")
          .boundingClientRect()
          .exec(data => {
            if (data[0][this.tabList.length - 1].right > this.windowsWidth) {
              this.isOutWindow = true;
            }
          });
      });
    },
    scrollNav (event) {
      Util.debounce(this.scrollNavFun, 10, true)(event);
    },
    scrollNavFun (event) {
      this.scrollInfo = event.detail;
      if (event.detail.scrollLeft <= 10) {
        // 滑动到了最左端
        this.scrollNavStation = "left";
      } else if (
        event.detail.scrollWidth <=
        event.detail.scrollLeft + this.rpxTopx(730)
      ) {
        this.scrollNavStation = "right";
      } else {
        this.scrollNavStation = "center";
      }
    },
    rpxTopx (num) {
      const retNum = (uni.getSystemInfoSync().screenWidth / 750) * num;
      return retNum;
    },
    swiperChange (e) {
      this.swiperChangeInfo = e;
      Util.debounce(this.swiperNavDebounce, 200, true)();
    },
    swiperNavDebounce () {
      const e = this.swiperChangeInfo;
      const { current } = e.detail;
      this.swiperTab = current;
      this.currentTab = current + 1;
      this.pageName = this.tabList[current].pageName;
      this.changeTab(current);
      if (current !== 4) {
        uni.$emit("stopMusic");
      }
    },
    // 点击查看更多按钮事件
    changeTabByMore (pageName) {
      const current = this.tabList.filter(e => {
        return pageName === e.pageName;
      })[0].sort;
      this.swiperTab = current - 1;
      this.currentTab = current;
      this.pageName = this.tabList[current - 1].pageName;
    },
    // 改变头部导航
    changeTab (current) {
      uni
        .createSelectorQuery()
        .in(this)
        .selectAll(".tab-item")
        .boundingClientRect()
        .exec(data => {
          const width = data[0][current].width;
          const margin = 80;
          let newLeft = 0;
          // tab超出屏幕
          if (this.isOutWindow) {
            // 防止移动后距离缩短问题
            for (let i = 0; i < current; i++) {
              newLeft += data[0][i].width;
            }
            // 是否需要居中
            if (this.windowsWidth / 2 < newLeft + width) {
              this.scrollLeft =
                width / 2 - (this.windowsWidth / 2 - newLeft) + margin;
            } else {
              this.scrollLeft = 0;
            }
          }
        });
    },
    // 滚动到底部监听
    scrollToLower () {
      console.log(this.swiperTab, "ccc");
      this.$nextTick(() => {
        if (this.$refs.EbConfig) {
          console.log(this.$refs.EbConfig[this.swiperTab], "kkkk");
          this.$refs.EbConfig[this.swiperTab].onScrollBottom();
        }
      });
    },
    // 子组件打开登录弹窗
    openLoginPopup () {
      console.log("登录弹窗");
      // this.$refs.popup_login.open();
    },
  },
};
</script>
<style lang="scss" scoped>
page {
  width: 100%;
  min-height: 100%;
  // display: flex;
}
.swiper-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  .swiper {
    flex: 1;
  }
}

.tab-container {
  z-index: 1;
  margin-bottom: -250rpx;
  position: relative;
  top: 0;

  .title {
    text-align: center;
    font-size: 36rpx;
    font-weight: 700;
    text-align: center;
    color: #ffffff;
    line-height: 36rpx;
    margin-top: 100rpx;
  }
}

.spcl_banner_bg_image {
  width: 100%;
  height: 463rpx;
  display: flex;
  position: relative;
  margin-bottom: -120px;
  z-index: -1;
}
.tab {
  padding: 0 30rpx;
  position: relative;
  display: flex;
  align-items: center;
}
.tab-left,
.tab-center {
  padding-right: 80rpx;
}
.swiper-nav {
  margin-top: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
}
.swiper-nav-left {
  mask: linear-gradient(
    to right,
    transparent,
    #ffffff 0%,
    #ffffff 10%,
    #ffffff 90%,
    rgba(255, 255, 255, 0) 100%
  );
}
.swiper-nav-center {
  mask: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0) 0%,
    #ffffff 10%,
    #ffffff 90%,
    rgba(255, 255, 255, 0) 100%
  );
}
.swiper-nav-right {
  mask: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0) 0%,
    #ffffff 10%,
    #ffffff 90%,
    #ffffff 100%
  );
}
.tab-box {
  display: flex;
  align-items: center;
  position: relative;
}

.empty-nav {
  height: 0rpx;
}
.tab-oper-btn {
  height: 76rpx;
  position: fixed;
  right: 30rpx;
  display: flex;
  justify-content: flex-end;
  .tab-item-xiangyou {
    height: 80rpx;
    line-height: 80rpx;

    text {
      font-size: 34rpx;
      color: #fff;
      font-weight: bold;
    }
  }
}
.tab-item {
  margin-left: 30rpx;
  font-size: 32rpx;
  font-weight: 500;
  // color: #fff;
  color: #333;
  &:first-child {
    margin-left: 0;
  }
}

.tab-item-hr {
  width: 48rpx;
  height: 12rpx;
  border-radius: 24rpx;
  text-align: center;
  border: 0px;
  margin: 15rpx auto 0rpx auto;
}
.on {
  font-size: 36rpx;
  color: #fff;
}
.loadingicon {
  margin-bottom: 20rpx;
}
.live-tab-wrap {
  width: 100%;
  padding-top: 49rpx;
}
.scenery-out-wrap {
  width: 100%;
  background-color: #fff;
}
</style>
