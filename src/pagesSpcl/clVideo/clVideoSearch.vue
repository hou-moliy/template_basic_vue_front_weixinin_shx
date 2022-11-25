<template>
  <view :style="{background:`url(${staticImgs}/shxmp/init/search-bg.png)  no-repeat`,height:'100%'}">
    <view
      class="custom-tab"
      :style="{ paddingTop: pointobj.top + 'px',lineHeight: pointobj.height+'px'}"
    >
      <image
        :src="`${staticImgs}/shxmp/init/leftIcon.png`"
        style="width:34rpx;height:44rpx"
        @click="getback"
      />
      <view class="custom-tab-title">
        视频彩铃搜索
      </view>
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
      />
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
    };
  },
  onLoad () {
    this.pageStatusLoad = "onLoad";
    this.hotKeyGoToPlayKey = false;
    this.pageStatusLoadForSelect = "onLoad";
  },
  onShow () {
    if (this.pageStatusLoad == "onHide") {
      this.pageStatusLoadForSelect = "onShow";
    }
    if (this.pageStatusLoad == "onHide" && !this.hotKeyGoToPlayKey) {
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
  },

};
</script>

<style lang="scss">
.custom-tab{
  display: flex;
  align-items: center;
  padding: 44rpx 4% 0 4%;
  .custom-tab-title{
    flex: 1;
    text-align: center;
  }
}
</style>
