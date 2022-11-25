<template>
  <view class="container">
    <view
      v-for="(pageConfig, pageConfigIndex) in pageConfigList"
      :key="pageConfigIndex"
    >
      <view
        v-if="
          pageConfig.moduleFlag === '0001' && pageConfig.configV2.isShow == '1'
        "
      >
        <eb-background-banner
          :page-config="pageConfig.configV2"
          :comp-top="compTop && pageConfigIndex == 0"
          @buryBannerId="buryBannerId"
          @openLoginPopup="openLoginPopup"
        />
      </view>
      <view
        v-if="
          pageConfig.moduleFlag === '0021' && pageConfig.configV2.isShow == '1'
        "
      >
        <eb-advertise
          :page-config="pageConfig.configV2"
          @openLoginPopup="openLoginPopup"
        />
      </view>

      <view v-if="pageConfig.moduleFlag === '0002'">
        <eb-icon-list
          :page-config="pageConfig.configV2"
          @buryIconListId="buryIconListId"
          @openLoginPopup="openLoginPopup"
          @open="open"
        />
      </view>

      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0031' && pageConfig.configV2.isShow == '1'
        "
        :padding="'50rpx 4% 30rpx 4%'"
        :page-config="pageConfig.configV2"
        :block-padding="0"
        @openLoginPopup="openLoginPopup"
      >
        <eb-ad-roll-transverse
          :page-config="pageConfig.configV2"
          :page-load-status="pageLoadStatus"
          style="width: 100%"
          @openLoginPopup="openLoginPopup"
        />
      </eb-default-head>

      <!-- 风景 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0007' && pageConfig.configV2.isShow == '1'
        "
        :margin="'50rpx 0 30rpx 0'"
        :page-config="pageConfig.configV2"
        @openLoginPopup="openLoginPopup"
      >
        <view class="scenery-out-wrap">
          <eb-spcl-transverse
            :page-config="pageConfig.configV2"
            :page-load-status="pageLoadStatus"
            @openLoginPopup="openLoginPopup"
          />
        </view>
      </eb-default-head>

      <!-- 视频彩铃瀑布流 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0007' && pageConfig.configV2.isShow == '1'
        "
        :margin="'50rpx 0 30rpx 0'"
        :page-config="pageConfig.configV2"
        @openLoginPopup="openLoginPopup"
      >
        <view class="spcl-out-wrap">
          <eb-spcl-waterfalls
            ref="EbSpclWaterFalls"
            :page-config="pageConfig.configV2"
            :page-load-status="pageLoadStatus"
            @openLoginPopup="openLoginPopup"
          />
        </view>
      </eb-default-head>
    </view>
    <eb-ad-float @click="flaotClick" />
  </view>
</template>

<script>
export default {
  props: {
    pageConfigList: {
      type: Array,
      default: () => [],
    },
    compTop: {
      type: Boolean,
      default: true,
    },
    compBottom: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {};
  },
  created () { },
  mounted () {
  },
  methods: {
    // 滚动到底部监听
    onScollBottom () {
      console.log(this.$refs, "lll");
      if (this.$refs.EbLiveWaterFalls) {
        this.$refs.EbLiveWaterFalls[0].onScollBottom();
      }
      if (this.$refs.EbMiguWaterfalls) {
        this.$refs.EbMiguWaterfalls[0].onScollBottom();
      }
      if (this.$refs.EbSpclWaterFalls) {
        this.$refs.EbSpclWaterFalls[0].onScollBottom();
      }
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
.container {
  width: 100%;
  height: 100%;
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
.spcl-out-wrap {
  width: 100vw;
}
</style>
