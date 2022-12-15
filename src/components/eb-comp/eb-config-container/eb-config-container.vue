<template>
  <view class="container">
    <view
      v-for="(pageConfig, pageConfigIndex) in pageConfigList"
      :key="pageConfigIndex"
    >
      <template
        v-if="
          pageConfig.pageModule === 'eb-background-banner' &&
          pageConfig.isShow == 1
        "
      >
        <eb-background-banner
          :page-config="pageConfig"
          :activity-id="activityId"
          :comp-top="compTop && pageConfigIndex == 0"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <template
        v-if="
          pageConfig.pageModule === 'eb-icon-list' && pageConfig.isShow == 1
        "
      >
        <eb-icon-list
          :page-config="pageConfig"
          :activity-id="activityId"
          @openLoginPopup="openLoginPopup"
          @open="open"
        />
      </template>
      <template
        v-if="
          pageConfig.pageModule === 'eb-ad-roll-transverse' &&
          pageConfig.isShow == 1
        "
      >
        <eb-ad-roll-transverse
          :page-config="pageConfig"
          :activity-id="activityId"
          :page-load-status="pageLoadStatus"
          style="width: 100%"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <!-- 横向滑动视频彩铃组件 -->
      <template
        v-if="
          pageConfig.pageModule === 'eb-spcl-transverse' &&
          pageConfig.isShow == 1
        "
      >
        <view class="scenery-out-wrap">
          <eb-spcl-transverse
            ref="EbSpclTransverse"
            :page-config="pageConfig"
            :page-load-status="pageLoadStatus"
            :activity-id="activityId"
            @openLoginPopup="openLoginPopup"
            @goToPlayVideo="goToPlayVideo"
            @buryDz="buryDz"
            @buryShare="buryShare"
          />
        </view>
      </template>

      <!-- 视频彩铃瀑布流 -->
      <template
        v-if="
          pageConfig.pageModule === 'eb-spcl-waterfalls' &&
          pageConfig.isShow == 1
        "
      >
        <view class="spcl-out-wrap">
          <eb-spcl-waterfalls
            ref="EbSpclWaterFalls"
            :page-config="pageConfig"
            :activity-id="activityId"
            :page-load-status="pageLoadStatus"
            :comp-bottom="
              compBottom && pageConfigIndex + 1 == pageConfigList.length
            "
            @openLoginPopup="openLoginPopup"
            @purchaseVideo="purchaseVideo"
            @goToPlayVideo="goToPlayVideo"
            @buryDz="buryDz"
            @buryShare="buryShare"
          />
        </view>
      </template>

      <!-- 标题 -->
      <template
        v-if="
          pageConfig.pageModule === 'eb-default-head' && pageConfig.isShow == 1
        "
      >
        <eb-default-head
          :page-config="pageConfig"
          :activity-id="activityId"
          @openLoginPopup="openLoginPopup"
        />
      </template>

      <!-- 广告位 无背景 -->
      <template
        v-if="pageConfig.pageModule === 'eb-feeds' && pageConfig.isShow == 1"
      >
        <eb-feeds
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          :activity-id="activityId"
          @openLoginPopup="openLoginPopup"
        />
      </template>

      <!-- 广告位 有背景 -->

      <template
        v-if="pageConfig.pageModule === 'eb-feeds-bg' && pageConfig.isShow == 1"
      >
        <eb-feeds-bg
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          :activity-id="activityId"
          @openLoginPopup="openLoginPopup"
        />
      </template>

      <!-- 运营位 -->
      <template
        v-if="
          pageConfig.pageModule === 'eb-business-list' &&
          pageConfig.isShow === 1
        "
      >
        <eb-business-list
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          :activity-id="activityId"
          :comp-bottom="
            compBottom && pageConfigIndex + 1 == pageConfigList.length
          "
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <!--  覆盖性头图组件-->
      <template
        v-if="
          pageConfig.pageModule === 'eb-head-img-cover' &&
          pageConfig.isShow === 1
        "
      >
        <eb-head-img-cover
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          :activity-id="activityId"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <!-- 普通头图组件 -->
      <template
        v-if="
          pageConfig.pageModule === 'eb-head-img' && pageConfig.isShow === 1
        "
      >
        <eb-head-img-cover
          :page-config="pageConfig"
          :activity-id="activityId"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <!-- AI换铃声 -->
      <template
        v-if="pageConfig.pageModule === 'eb-spcl-ai' && pageConfig.isShow === 1"
      >
        <eb-spcl-ai
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          :activity-id="activityId"
          @openLoginPopup="openLoginPopup"
          @changeAi="changeAi"
        />
      </template>
      <!--广告位图片  -->
      <template
        v-if="pageConfig.pageModule === 'eb-ad-img' && pageConfig.isShow === 1"
      >
        <eb-ad-img
          :page-config="pageConfig"
          :page-load-status="pageLoadStatus"
          :activity-id="activityId"
          @openLoginPopup="openLoginPopup"
        />
      </template>
      <!-- 视频横向滑动列表 -->
      <template
        v-if="
          pageConfig.pageModule === 'eb-spcl-swiper' && pageConfig.isShow === 1
        "
      >
        <eb-spcl-swiper
          ref="EbSpclSwiper"
          :page-config="pageConfig"
          :activity-id="activityId"
          :page-load-status="pageLoadStatus"
          @purchaseVideo="purchaseVideo"
          @goToPlayVideo="goToPlayVideo"
        />
      </template>
      <!-- 视频彩铃列表 -->
      <template
        v-if="
          pageConfig.pageModule === 'eb-spcl-list' && pageConfig.isShow === 1
        "
      >
        <eb-spcl-list
          ref="EbSpclList"
          :page-config="pageConfig"
          :activity-id="activityId"
          :page-load-status="pageLoadStatus"
          @purchaseVideo="purchaseVideo"
          @goToPlayVideo="goToPlayVideo"
        />
      </template>
      <!-- 视频彩铃推荐列表 -->
      <template
        v-if="
          pageConfig.pageModule === 'eb-spcl-recommend' &&
          pageConfig.isShow === 1
        "
      >
        <eb-spcl-recommend
          :page-config="pageConfig"
          :activity-id="activityId"
          :page-load-status="pageLoadStatus"
          @openLoginPopup="openLoginPopup"
          @goToPlayVideo="goToPlayVideo"
        />
      </template>
      <!-- 浮动类广告位 -->
      <template
        v-if="
          pageConfig.pageModule === 'eb-ad-float' && pageConfig.isShow === 1
        "
      >
        <eb-ad-float
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
export default {
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
    pageLoadStatus: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {

    };
  },
  created () {
  },
  mounted () {
  },
  methods: {
    // 滚动到底部监听
    onScrollBottom () {
      if (this.$refs.EbSpclWaterFalls) {
        this.$refs.EbSpclWaterFalls[0].onScrollBottom();
      }
    },
    // 刷新数据
    handleFresh () {
      if (this.$refs.EbSpclWaterFalls) {
        this.$refs.EbSpclWaterFalls.forEach(item => {
          item.handleFresh();
        });
      }
      if (this.$refs.EbSpclTransverse) {
        this.$refs.EbSpclTransverse.forEach(item => {
          item.handleFresh();
        });
      }
      if (this.$refs.EbSpclList) {
        this.$refs.EbSpclList.forEach(item => {
          item.handleFresh();
        });
      }
      if (this.$refs.EbSpclSwiper) {
        this.$refs.EbSpclSwiper.forEach(item => {
          item.handleFresh();
        });
      }
    },
    // 子组件打开登录弹窗
    openLoginPopup () {
      uni.$emit("openLoginPopup", { msg: "展示登录弹窗" });
    },
    // 子组件操作AI换铃
    changeAi () {
      this.$emit("changeAi");
    },
    // 视频彩铃点赞埋点
    buryDz () {
      this.$analysis.dispatch("video_fabulous_count", this.activityId);
    },
    // 视频彩铃分享埋点
    buryShare (callBack = () => { }) {
      this.$analysis.dispatch("video_share_count", this.activityId).finally(() => callBack());
    },
    // 设置视频彩铃
    purchaseVideo (e) {
      this.$emit("purchaseVideo", e);
    },
    // 跳转视频彩铃播放页面
    goToPlayVideo ({ item, list, pageConfigTitle }) {
      this.$store.commit("spcl/M_changeVideoList", list);
      if (pageConfigTitle == "moreVideo") {
        uni.setStorageSync("isPlayFromIndex", false);
        this.$store.commit(
          "spcl/getVedioListTalNum",
          uni.getStorageSync("vedioListTalNum"),
        );
      } else {
        uni.setStorageSync("isPlayFromIndex", true);
      }
      this.$analysis.dispatch("video_play_count", `${this.activityId}`).finally(() => {
        uni.navigateTo({
          url: `/pagesSpcl/clVideo/clVideoPlay?id=${item.ringId}`,
        });
      });
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
}
.spcl-out-wrap {
  width: 100vw;
}
</style>
