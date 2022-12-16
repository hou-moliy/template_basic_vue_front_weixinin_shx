<template>
  <view
    class="search-box"
    :style="{
      background: changeBbcolorFlag ? '#F5F7F9' : '',
    }"
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
        }"
      >
        <image
          :src="`${staticImgs}/shxmp/init/leftIcon.png`"
          style="width: 34rpx; height: 44rpx"
          @click="getback"
        />
        <view class="custom-tab-title">视频彩铃搜索</view>
      </view>
      <view>
        <cxSelect
          default-page-name="video"
          :page-status-load="pageStatusLoadForSelect"
          :hot-list-type="'video'"
          @hotKeyGoToPlay="hotKeyGoToPlay"
        />
      </view>
      <view>
        <cxVideoSearchList
          :page-status-load="pageStatusLoad"
          @hotKeyGoToPlay="hotKeyGoToPlay"
          @getSearchList="getSearchList"
        />
      </view>
    </view>
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
    };
  },
  onLoad () {
    this.pageStatusLoad = "onLoad";
    this.hotKeyGoToPlayKey = false;
    this.pageStatusLoadForSelect = "onLoad";
    this.$analysis.dispatch("video_search_pv");// 进入视频搜索的埋点，有音频搜索后需修改
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
  // 监听页面滚动
  onPageScroll (e) {
    console.log(e.scrollTop, "e.scrollTop;");
  },
  methods: {
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
  display: flex;
  align-items: center;
  padding: 44rpx 4% 0 4%;
  .custom-tab-title {
    flex: 1;
    text-align: center;
  }
}
</style>
