<template>
  <view
    class="search-box"
    :style="{
      background: changeBbcolorFlag ? '#F5F7F9' : '',
    }"
  >
    <scroll-view
      scroll-y="true"
      :style="{ height: `${windowHeight}px` }"
      @scroll="scroll"
    >
      <view class="head-img-box">
        <image :src="staticImgs + `/shxmp/init/search-bg.png`" />
      </view>
      <view class="main-box">
        <view
          class="custom-tab"
          :style="{
            paddingTop: pointobj.top + 'px',
            lineHeight: pointobj.height + 'px',
            background: navBackground,
          }"
        >
          <image
            :src="`${staticImgs}/shxmp/init/leftIcon.png`"
            style="width: 34rpx; height: 44rpx"
            @click="getback"
          />
          <view class="custom-tab-title">视频彩铃搜索</view>
        </view>
        <view :style="{ marginTop: `${mainBoxMarginTop}px` }">
          <cxSelect
            default-page-name="video"
            :page-status-load="pageStatusLoadForSelect"
            :hot-list-type="'video'"
            @hotKeyGoToPlay="hotKeyGoToPlay"
          />
        </view>
        <view class="searchlist-box">
          <cxVideoSearchList
            :page-status-load="pageStatusLoad"
            @hotKeyGoToPlay="hotKeyGoToPlay"
            @getSearchList="getSearchList"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import cxVideoSearchList from "@/components/search/cx-video-search-list.vue";
import cxSelect from "@/components/search/cx_select.vue";
export default {
  name: "SearchPage",
  components: {
    cxVideoSearchList,
    cxSelect,
  },
  data () {
    return {
      pageStatusLoad: "",
      hotKeyGoToPlayKey: false,
      pageStatusLoadForSelect: "",
      staticImgs: this.$staticImgs,
      pointobj: {},
      changeBbcolorFlag: false, // 是否更改背景颜色
      windowHeight: 0, // 可视高度
      navBackground: "transparent", // 导航栏背景
      mainBoxMarginTop: 0, // 主盒子外边距
    };
  },
  onLoad () {
    this.getPageWidthHeight();
    this.pageStatusLoad = "onLoad";
    this.hotKeyGoToPlayKey = false;
    this.pageStatusLoadForSelect = "onLoad";
    this.$analysis.dispatch("video_search_pv");// 进入视频搜索的埋点，有音频搜索后需修改
    this.pointobj = uni.getMenuButtonBoundingClientRect();
    this.mainBoxMarginTop = this.pointobj.top + this.pointobj.height + 10;
    console.log(this.pointobj);
  },
  onShow () {
    if (this.pageStatusLoad === "onHide") {
      this.pageStatusLoadForSelect = "onShow";
    }
    if (this.pageStatusLoad === "onHide" && !this.hotKeyGoToPlayKey) {
      this.pageStatusLoad = "onShow";
    }
    this.pointobj = uni.getMenuButtonBoundingClientRect();
    console.log(this.pointobj);
  },
  onHide () {
    console.log("onHide-------");
    this.pageStatusLoadForSelect = "onHide";
    this.pageStatusLoad = "onHide";
  },
  onUnload () {
    console.log("onUnload---------");
    this.pageStatusLoadForSelect = "onUnload";
    this.pageStatusLoad = "onUnload";
  },
  methods: {

    getPageWidthHeight () {
      uni.getSystemInfo({
        success: res => {
          console.log(res.windowHeight, "res.windowHeight");
          this.windowHeight = res.windowHeight;
        },
      });
    },
    scroll (e) {
      if (e.detail.scrollTop > 30) {
        this.navBackground = "#DDDDFF";
      } else {
        this.navBackground = "transparent";
      }
      console.log(e.detail.scrollTop, "e.detail.scrollTop");
    },
    hotKeyGoToPlay (item) {
      console.log("播放了");
      this.hotKeyGoToPlayKey = item;
    },
    getback () {
      console.log("点击发生");
      uni.switchTab({
        url: "/pages/cl/index",
      });
    },
    // 搜索结果列表onload
    getSearchList (data) {
      this.changeBbcolorFlag = data;
    },
  },

};
</script>

<style>
page {
  display: flex;
  height: 100%;
  background-color: #fff;
}
</style>

<style lang="scss">
.search-box {
  flex: 1;
  flex-direction: column;
  overflow: scroll;
  height: 100%;
  background-color: #fff;
}
.head-img-box {
  width: 100%;
  position: absolute;
  top: 0;
  image {
    width: 100%;
  }
}
.main-box {
  position: relative;
}
.custom-tab {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 44rpx 4% 20rpx 4%;
  .custom-tab-title {
    flex: 1;
    text-align: center;
  }
}
.searchlist-box {
  margin-top: 49rpx;
}
</style>
