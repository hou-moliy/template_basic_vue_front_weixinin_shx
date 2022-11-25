<template>
  <view class="container">
    <view
      v-for="(pageConfig, pageConfigIndex) in pageConfigList"
      :key="pageConfigIndex"
    >
      <template v-if="
          pageConfig.pageModule === 'eb-background-banner' && pageConfig.isShow == 1
        ">
        <eb-background-banner
          :page-config="pageConfig"
          :activity-id="activityId"
          :comp-top="compTop && pageConfigIndex == 0"
          @buryBannerId="buryBannerId"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <template v-if="
          pageConfig.moduleFlag === '0021' && pageConfig.isShow == 1
        ">
        <eb-advertise
          :page-config="pageConfig"
          @openLoginPopup="openLoginPopup"
        />
      </template>

      <template v-if="pageConfig.pageModule === 'eb-icon-list' && pageConfig.isShow == 1">
        <eb-icon-list
          :page-config="pageConfig"
          :activity-id="activityId"
          @buryIconListId="buryIconListId"
          @openLoginPopup="openLoginPopup"
          @open="open"
        />
      </template>
      <template v-if="
          pageConfig.pageModule === 'eb-ad-roll-transverse' && pageConfig.isShow == 1
        ">
        <eb-ad-roll-transverse
          :page-config="pageConfig"
          :activity-id="activityId"
          :page-load-status="pageLoadStatus"
          style="width: 100%"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <!-- 风景 -->
      <template>
        <view
          v-if="
            pageConfig.pageModule === 'eb-spcl-transverse' && pageConfig.isShow == 1
          "
          class="scenery-out-wrap"
        >
          <eb-spcl-transverse
            :page-config="pageConfig"
            :page-load-status="pageLoadStatus"
            :activity-id="activityId"
            @openLoginPopup="openLoginPopup"
          />
        </view>
      </template>

      <!-- 视频彩铃瀑布流 -->
      <template>
        <view
          v-if="
            pageConfig.pageModule === 'eb-spcl-waterfalls' && pageConfig.isShow == 1
          "
          class="spcl-out-wrap"
        >
          <eb-spcl-waterfalls
            ref="EbSpclWaterFalls"
            :page-config="pageConfig"
            :activity-id="activityId"
            :page-load-status="pageLoadStatus"
            :comp-bottom="compBottom && pageConfigIndex ==pageConfigList.length "
            @openLoginPopup="openLoginPopup"
          />
        </view>
      </template>

      <!-- 标题 -->
      <template>
        <eb-default-head
          v-if="pageConfig.pageModule === 'eb-default-head' && pageConfig.isShow == 1"
          :margin="'50rpx 0 30rpx 0'"
          :page-config="pageConfig"
          @openLoginPopup="openLoginPopup"
        />
      </template>

      <!-- 广告位 无背景 -->
      <template>
        <view v-if="pageConfig.pageModule === 'eb-feeds' && pageConfig.isShow == 1">
          <eb-feeds
            :page-config="pageConfig"
            :page-load-status="pageLoadStatus"
            @openLoginPopup="openLoginPopup"
          />
        </view>
      </template>

      <!-- 广告位 有背景 -->

      <template>
        <eb-feeds-bg
          v-if="
            pageConfig.pageModule === 'eb-feeds-bg' && pageConfig.isShow == 1
          "
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
        />
      </template>

      <!-- 运营位 -->
      <template v-if="
          pageConfig.pageModule === 'eb-business-list' && pageConfig.isShow === 1
        ">
        <eb-business-list
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <!--  覆盖性头图组件-->
      <template v-if="
          pageConfig.pageModule === 'eb-head-img-cover' && pageConfig.isShow === 1
        ">
        <eb-head-img-cover
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <!-- 普通头图组件 -->
      <template v-if="
          pageConfig.pageModule === 'eb-head-img' && pageConfig.isShow === 1
        ">
        <eb-head-img-cover
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <!-- AI换铃声 -->
      <template v-if="
          pageConfig.pageModule === 'eb-spcl-ai' && pageConfig.isShow === 1
        ">
        <eb-spcl-ai
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <!--  -->
      <template v-if="
          pageConfig.pageModule === 'eb-ad-img' && pageConfig.isShow === 1
        ">
        <eb-ad-img
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
        />
      </template>

      <template v-if="
          pageConfig.pageModule === 'eb-spcl-swiper' && pageConfig.isShow === 1
        ">
        <eb-spcl-swiper
          :page-config="pageConfig"
          :activity-id="activityId"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
        />
      </template>

      <template v-if="
          pageConfig.pageModule === 'eb-spcl-list' && pageConfig.isShow === 1
        ">
        <eb-spcl-list
          :page-config="pageConfig"
          :activity-id="activityId"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
        />
      </template>

      <template v-if="
          pageConfig.pageModule === 'eb-spcl-recommend' && pageConfig.isShow === 1
        ">
        <eb-spcl-recommend
          :page-config="pageConfig"
          :activity-id="activityId"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
        />
      </template>
    </view>
  </view>
</template>

<script>
import ebHeadImgCover from "../eb-head-img-cover/eb-head-img-cover.vue";
export default {
  components: { ebHeadImgCover },
  props: {
    pageConfigList: {
      type: Array,
      default: () => [],
    },
    activityId: {
      type: String,
      default: "",
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
