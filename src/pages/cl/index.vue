<template>
  <view class="swiper-tab">
    <view class="tab-container" :style="{ background: tabBackground }">
      <!-- 头部标题区域 -->
      <view class="title" style="margin: 100rpx auto 20rpx">彩铃</view>
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
              <view class="tab-item-img">
                <view>{{ item.name }}</view>
                <image
                  v-show="pageName == item.pageName"
                  :src="item.selectedIconUrl"
                  alt=""
                />
              </view>
            </view>
          </view>
        </scroll-view>
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
            v-if="swipeItem.pageConfig"
            scroll-y="true"
            :style="{ height: `${windowHeight}px` }"
            :scroll-top="scrollTop"
            @scrolltolower="scrollToLower"
            @scroll="swiperContainerScroll"
          >
            <!-- 配置化组件容器 -->
            <ebConfigContainerAsync
              key=""
              ref="EbConfig"
              :activity-id="swipeItem.pageName"
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
      tabBackground: "transparent", // 头部导航背景色
      scrollNavStation: "left", // 导航栏滑动的位置，left左端 right右端 center中间
      switchNavInfo: {}, // 当前的Tab对象
      pageName: "", // 当前的Tab栏name
      swiperTab: 0, // swiper滑动的Tab
      currentTab: 1, //
      isOutWindow: false,
      windowsWidth: 0, // 可使用窗口宽度
      windowHeight: 0, // 可使用窗口高度
      navHeight: 0, // 手机状态栏的高度
      operitionInfo: {}, // 订购弹窗的内容
      operitionBtnClick: (e) => { }, // 订购弹窗按钮回调
      scrollTop: 0, // 距离顶部高度，新的
      oldScrollTop: 0, // 距离顶部高度，旧的
    };
  },
  onLoad (options) {
    uni.hideTabBar();
    this.getPageWidthHeight();
    this.getTabList();
    if (options.tab && options.tab === 1) {
      this.swiperTab = 1;
    } else if (options.tab && options.tab === 0) {
      this.swiperTab = 0;
    }
    this.pageName = options.pageName;
  },
  onShow () {
    this.handleFresh();
    if (uni.getStorageSync("homePageName")) {
      this.pageName = uni.getStorageSync("homePageName");
      uni.removeStorageSync("homePageName");
    }
    this.dispatchPageEvent();
  },
  onHide () {
    this.offMonitor();
  },
  onShareAppMessage (res) {
    // 主页分享
    return {
      title:
        "您的好友邀您使用陕西小程序，好听、好看、好玩快来体验吧～",
      path: `/pages/cl/index?currentTab=${this.currentTab}&pageName=${this.pageName}&share=1`,
      imageUrl: `${this.$staticImgs}/shxmp/init/share_main.png`,
    };
  },
  methods: {
    // 刷新页面信息
    handleFresh () {
      if (this.$refs.EbConfig) {
        this.$refs.EbConfig[this.swiperTab].handleFresh();
      }
      this.$store.dispatch("user/getUserSpclStatus");
      this.$store.dispatch("user/getUserAiStatus");
      this.$store.dispatch("spcl/getMyLikeVideoIdList");
      this.$store.dispatch("spcl/getUserAllVideoList");
    },
    // 跨页面通信监听
    dispatchPageEvent () {
      // 关闭设置弹窗
      this.$store.commit("window/SET_OPERITION_SHOW", false);
      uni.$on("changeTabByMore", data => {
        this.changeTabByMore(data);
      });
      uni.$on("openLoginPopup", data => {
        this.$showLoginPop(this);
      });
      // 展示订购、设置类弹窗，按钮点击回调
      uni.$on("operitionShow", ({ popupInfo, btnClickCallBack = () => { } }) => {
        this.operitionInfo = popupInfo;
        this.$store.commit("window/SET_OPERITION_SHOW", true);
        this.operitionBtnClick = (e) => btnClickCallBack(e);
      });
      // 展示AI换铃弹窗
      uni.$on("changeAi", ({ notifyInfo, confirmCallback }) => {
        console.log("点击了AI换铃的状态");
        this.$showNotifyPop(this, notifyInfo, confirmCallback);
      });
    },
    // 移除监听
    offMonitor () {
      console.log("移除监听");
      uni.$off("openLoginPopup");
      uni.$off("operitionShow");
      uni.$off("changeAi");
    },
    // 订购弹窗关闭
    closePopup () {
      this.operitionInfo = {};
      this.$store.commit("window/SET_OPERITION_SHOW", false);
    },
    // 初始化页面样式宽高等
    getPageWidthHeight () {
      uni.getSystemInfo({
        success: res => {
          if (res.safeAreaInsets.bottom === 0) {
            this.windowHeight = res.windowHeight;
          } else {
            this.windowHeight = res.safeArea.height;
          }
          this.navHeight = res.safeArea.top;
          this.windowsWidth = res.windowWidth;
        },
      });
    },
    // switch点击防抖
    switchNavDebounce (e) {
      this.switchNavInfo = e;
      Util.debounce(() => this.switchNav(e), 200, true)();
    },
    // Tab点击
    switchNav () {
      const { current } = this.switchNavInfo.currentTarget.dataset;
      this.swiperTab = current - 1;
      this.currentTab = current;
      this.pageName = this.tabList[this.swiperTab].pageName;
      this.getPageConfig(this.pageName);
      this.goTop();
    },
    // scroll-view滚动监听
    swiperContainerScroll (e) {
      // 记录scroll  位置
      this.oldScrollTop = e.detail.scrollTop;
      if (e.detail.scrollTop > 30) {
        this.tabBackground = "#DDDDFF";
      } else {
        if (this.tabBackground === "#DDDDFF") {
          this.tabBackground = "transparent";
        }
      }
    },
    goTop () {
      // 视图会发生重新渲染
      this.scrollTop = this.oldScrollTop;
      // 当视图渲染结束 重新设置为0
      this.$nextTick(() => {
        this.scrollTop = 0;
      });
    },
    // 获取tabList信息
    getTabList () {
      TemplateService.getTabList({ tabTarget: "main" }).then(res => {
        if (res.data.code === 200) {
          this.tabList = res.data.data;
          this.swiperTab = this.currentTab ? this.currentTab - 1 : 0;
          this.tabList.forEach((e, index) => {
            e.pageConfig = "";
            if (index === 0 && e.pageName) {
              this.pageName = e.pageName;
              this.getPageConfig(e.pageName);
            }
          });
          this.checkTabOverFlow();
        }
      });
    },
    // 获取页面配置信息
    getPageConfig (pageName) {
      this.$analysis.dispatch(`${pageName}_pv`);
      if (this.tabList[this.swiperTab].pageConfig) return;
      TemplateService.getPageConfigByPageName({ pageName }).then(res => {
        if (res.data.code === 200) {
          this.tabList[this.swiperTab].pageConfig = [...res.data.data];
          this.$forceUpdate();
        }
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
      Util.debounce(() => this.scrollNavFun, 10, true)(event);
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
      Util.debounce(() => this.swiperNavDebounce(), 200, true)();
    },
    // swiper切换防抖
    swiperNavDebounce () {
      const e = this.swiperChangeInfo;
      const { current } = e.detail;
      this.swiperTab = current;
      this.currentTab = current + 1;
      this.pageName = this.tabList[current].pageName;
      this.getPageConfig(this.pageName);
      this.changeTab(current);
    },
    // 点击查看更多按钮事件
    changeTabByMore (pageName) {
      const currentList = this.tabList.filter(e => {
        return pageName === e.pageName;
      });
      const current = currentList.length ? currentList[0].sort : 1;
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
      this.$nextTick(() => {
        if (this.$refs.EbConfig) {
          this.$refs.EbConfig[0].onScrollBottom();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
page {
  width: 100%;
  min-height: 100%;
}
.scrollView {
  height: 100%;
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
    font-size: 36rpx;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    text-align: center;
    color: #252a3e;
    line-height: 36rpx;
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
  height: 90rpx;
  box-sizing: border-box;
  margin-left: 10rpx;
}
.tab-left,
.tab-center {
  padding-right: 80rpx;
}
.swiper-nav {
  display: flex;
  align-items: center;
  justify-content: center;
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
  height: 100%;
  align-items: center;
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
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: left;
  color: #767b93;
  line-height: 36rpx;

  &:first-child {
    margin-left: 0;
  }
}

.tab-item-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  image {
    width: 37rpx;
    height: 14rpx;
    margin-top: 10rpx;
  }
}
.on {
  font-size: 40rpx;
  font-family: PingFang SC, PingFang SC-Heavy;
  font-weight: 800;
  text-align: left;
  color: #303549;
  line-height: 36rpx;
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
