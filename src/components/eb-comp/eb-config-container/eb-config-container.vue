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
          @buryBannerId="buryBannerId"
          @openLoginPopup="openLoginPopup"
        />
      </view>
      <view
        v-if="pageConfig.moduleFlag === '0002'"
        :style="{ margin: '12rpx 20rpx 0 20rpx' }"
      >
        <eb-icon-list
          :page-config="pageConfig.configV2"
          @buryIconListId="buryIconListId"
          @openLoginPopup="openLoginPopup"
          @open="open"
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
      <!-- 热门推荐 -->
      <eb-default-head
        v-if="
          ageConfig.moduleFlag === '0004' && pageConfig.configV2.isShow == '1'
        "
        :margin="'50rpx 0 30rpx 0'"
        :page-config="pageConfig.configV2"
        @openLoginPopup="openLoginPopup"
      >
        <eb-ad-structure
          :page-config="pageConfig.configV2"
          @openLoginPopup="openLoginPopup"
        />
      </eb-default-head>
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
      <!-- 精选海报 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0005' && pageConfig.configV2.isShow == '1'
        "
        :margin="'50rpx 0 30rpx 0'"
        :page-config="pageConfig.configV2"
        @openLoginPopup="openLoginPopup"
      >
        <eb-image-block
          ref="findMiguPic3"
          :page-config="pageConfig.configV2"
          :is-login="isLogin"
          @openLoginPopup="openLoginPopup"
        />
      </eb-default-head>
      <!-- 辽宁特惠 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0006' && pageConfig.configV2.isShow == '1'
        "
        :margin="'50rpx 0 30rpx 0'"
        :page-config="pageConfig.configV2"
        @openLoginPopup="openLoginPopup"
      >
        <eb-ad-structure
          :page-config="pageConfig.configV2"
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

      <!-- 咪咕视频彩铃样式   左右滑动 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0023' && pageConfig.configV2.isShow == '1'
        "
        :margin="'50rpx 0 30rpx 0'"
        :page-config="pageConfig.configV2"
        @openLoginPopup="openLoginPopup"
      >
        <view class="scenery-out-wrap">
          <eb-migu-transverse
            :page-config="pageConfig.configV2"
            :is-login="loginFlag"
            @openLoginPopup="openLoginPopup"
          />
        </view>
      </eb-default-head>

      <!-- 音频专题 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0008' && pageConfig.configV2.isShow == '1'
        "
        :margin="'50rpx 0 30rpx 0'"
        :page-config="pageConfig.configV2"
        @openLoginPopup="openLoginPopup"
      >
        <eb-ad-structure
          :page-config="pageConfig.configV2"
          @openLoginPopup="openLoginPopup"
        />
      </eb-default-head>

      <!-- 你会使用5G助手么 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0009' && pageConfig.configV2.isShow == '1'
        "
        :margin="'50rpx 0 30rpx 0'"
        :page-config="pageConfig.configV2"
        @openLoginPopup="openLoginPopup"
      >
        <eb-ad-structure
          :page-config="pageConfig.configV2"
          @openLoginPopup="openLoginPopup"
        />
      </eb-default-head>
      <!-- 直播中的订阅按钮 -->
      <view
        v-if="
          pageConfig.moduleFlag === '0010' && pageConfig.configV2.isShow == '1'
        "
        :style="{ margin: '20rpx 0 0 0' }"
      >
        <eb-live-subscribe
          :page-config="pageConfig.configV2"
          @openLoginPopup="openLoginPopup"
        />
      </view>
      <view
        v-if="
          pageConfig.moduleFlag === '0011' && pageConfig.configV2.isShow == '1'
        "
        class="live-tab-wrap"
      >
        <eb-live-waterfalls
          ref="EbLiveWaterFalls"
          :page-config="pageConfig.configV2"
          @openLoginPopup="openLoginPopup"
        />
      </view>
      <!-- 咪咕视频 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0015' && pageConfig.configV2.isShow == '1'
        "
        margin="58rpx 0 30rpx 0"
        :page-config="pageConfig.configV2"
        @openLoginPopup="openLoginPopup"
      >
        <eb-migu-waterfalls
          ref="EbMiguWaterfalls"
          margin="40rpx"
          :is-login="loginFlag"
          :page-config="pageConfig.configV2"
          @openLoginPopup="openLoginPopup"
        />
      </eb-default-head>

      <!-- 咪咕图片-咪咕视频 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0016' && pageConfig.configV2.isShow == '1'
        "
        margin="50rpx 0 30rpx 0"
        :page-config="pageConfig.configV2"
        @openLoginPopup="openLoginPopup"
      >
        <eb-image-falls
          ref="findMiguPic"
          :page-config="pageConfig.configV2"
          :is-login="isLogin"
          @openLoginPopup="openLoginPopup"
        />
      </eb-default-head>
      <!-- 咪咕圈圈 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0017' && pageConfig.configV2.isShow == '1'
        "
        :page-config="pageConfig.configV2"
        margin="58rpx 0 30rpx 0"
        @openLoginPopup="openLoginPopup"
      >
        <image-falls
          ref="findMiguPic2"
          :page-config="pageConfig.configV2"
          :is-login="isLogin"
          @openLoginPopup="openLoginPopup"
        />
      </eb-default-head>
      <!-- 今日推荐 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0018' && pageConfig.configV2.isShow == '1'
        "
        :page-config="pageConfig.configV2"
        margin="58rpx 0 30rpx 0"
        @openLoginPopup="openLoginPopup"
      >
        <eb-ad-structure
          :page-config="pageConfig.configV2"
          @openLoginPopup="openLoginPopup"
        />
      </eb-default-head>

      <!-- 精选权益 -->
      <eb-default-head
        v-if="
          pageConfig.moduleFlag === '0019' && pageConfig.configV2.isShow == '1'
        "
        :page-config="pageConfig.configV2"
        margin="50rpx 0 30rpx 0"
        @openLoginPopup="openLoginPopup"
      >
        <eb-ad-structure
          :page-config="pageConfig.configV2"
          @openLoginPopup="openLoginPopup"
        />
      </eb-default-head>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    pageConfigList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    console.log("一样一样");
  },
  methods: {
    // 滚动到底部监听
    onScollBottom() {
      this.$nextTick(() => {
        console.log(this.$refs, "lll");
      });
      if (this.$refs.EbLiveWaterFalls) {
        this.$refs.EbLiveWaterFalls[0].onScollBottom();
      }
      if (this.$refs.EbMiguWaterfalls) {
        this.$refs.EbMiguWaterfalls[0].onScollBottom();
      }
    },
    // 子组件打开登录弹窗
    openLoginPopup() {
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
</style>
