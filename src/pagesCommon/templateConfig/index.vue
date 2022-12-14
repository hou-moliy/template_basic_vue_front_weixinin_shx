<template>
  <view
    class="topic-page"
    :style="{
      backgroundImage: pageBaseInfo.backgroundImg
        ? `url(${pageBaseInfo.backgroundImg})`
        : '',
      backgroundSize: '100%',
      backgroundColor: pageBaseInfo.backgroundColor,
    }"
  >
    <!-- 分享栏 -->
    <view v-if="pageBaseInfo.getChanceDesc" class="main-share">
      <button class="btn" open-type="share">
        <image :src="pageBaseInfo.getChanceDesc" alt="" />
      </button>
    </view>
    <!-- 配置化组件 -->
    <ebConfigContainerAsync
      v-if="activityId && pageConfig"
      ref="EbConfigContainerAsync"
      :page-config-list="pageConfig"
      :activity-id="activityId"
    />
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
      @closePopup="$store.commit('window/SET_OPERITION_SHOW', false)"
    />
  </view>
</template>

<script>
import ebConfigContainerAsync from "@/components/eb-comp/eb-config-container/eb-config-container-async.vue";
import TemplateService from "@/api/template/index";
export default {
  name: "TemplateConfig",
  components: {
    ebConfigContainerAsync,
  },
  data () {
    return {
      pageName: "",
      activityId: "",
      pageConfig: null, // 页面配置组件信息
      pageBaseInfo: {}, // 页面配置的背景图颜色、分享标题等
      shareObj: {
      }, // 页面分享内容
      phoneNum: uni.getStorageSync("phone"),
      operitionInfo: {}, // 订购弹窗的内容
      operitionBtnClick: (e) => { }, // 订购弹窗按钮回调
    };
  },
  onLoad (options) {
    this.activityId = options.activityId;
    this.$analysis.dispatch("page_pv", `${this.activityId}`);
    this.pageName = options.pageName;
    this.getActivityStatus();
  },
  onShow () {
    this.dispatchPageEvent();
    this.handleFresh();
  },
  onHide () {
    this.offMonitor();
  },
  // 下拉到底部
  onReachBottom () {
    // 请求列表
    console.log("下拉到底部");
    if (this.$refs.EbConfigContainerAsync) {
      this.$refs.EbConfigContainerAsync.onScrollBottom();
    }
  },
  onShareAppMessage (res) {
    if (res.from === "button") {
      // 来自页面内分享按钮
      console.log("页面按钮点击");
    }
    return {
      title: this.shareObj.text
        ? this.shareObj.text
        : "您的好友邀您使用陕西小程序，好听、好看、好玩快来体验吧～",
      path: `pagesCommon/templateConfig/index?activityId=${this.activityId}&pageName=${this.pageName}`,
      imageUrl: this.shareObj.image,
    };
  },
  methods: {
    // 跨页面通信监听
    dispatchPageEvent () {
      // 关闭设置弹窗
      this.$store.commit("window/SET_OPERITION_SHOW", false);
      uni.$on("openLoginPopup", () => {
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
    // 刷新页面信息
    handleFresh () {
      if (this.$refs.EbConfigContainerAsync) {
        this.$refs.EbConfigContainerAsync.handleFresh();
      }
      this.$store.dispatch("user/getUserSpclStatus");
      this.$store.dispatch("user/getUserAiStatus");
      this.$store.dispatch("spcl/getMyLikeVideoIdList");
      this.$store.dispatch("spcl/getUserAllVideoList");
    },
    // 获取页面配置信息
    getPageConfig () {
      TemplateService.getPageConfigByPageName({ pageName: `${this.activityId}` }).then(res => {
        if (res.data.code === 200) {
          this.pageConfig = res.data.data;
        }
      });
    },
    // 获取页面基本信息如背景图、分享等
    getPageBaseInfo () {
      TemplateService.getPageConfigByActivityId({ id: this.activityId }).then(res => {
        if (res.data.code === 200) {
          this.pageBaseInfo = res.data.data;
          uni.setNavigationBarTitle({
            title: this.pageBaseInfo.activityName,
          });
          this.shareObj = {
            text: this.pageBaseInfo.wechatShareDesc,
            image: this.pageBaseInfo.wechatShareImg,
          };
          this.getPageConfig();
        }
      });
    },
    // 处理不正确的状态
    handleErrorStatus (releaseStatus, msg) { // releaseStatus 0.未发布1.已发布2.下线
      if (releaseStatus === 0) {
        this.$toast(msg || "暂未发布！");
      } else if (releaseStatus === 1) {
        this.$toast("不在活动时间内呢");
      } else {
        this.$toast(msg || "已下线！");
      }
      setTimeout(() => {
        uni.navigateBack();
      }, 500);
    },
    // 获取活动状态
    getActivityStatus () {
      TemplateService.getActivityStatusByActivityId({ activityId: this.activityId }).then(res => {
        if (res.data.code === 200) { // 正常
          this.getPageBaseInfo();
        } else { // 不正常
          this.handleErrorStatus(res.data.data, res.data.message);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.topic-page {
  min-height: 100vh;
  height: auto;
  background-position-y: 9%;
  padding: 40rpx 0rpx 50rpx;
  box-sizing: border-box;

  .top-img {
    height: 900rpx;

    image {
      width: 100%;
    }
  }
}
.main-share {
  position: absolute;
  top: 26rpx;
  right: 0rpx;
  border-radius: 22rpx 0rpx 0rpx 22rpx;
  z-index: 1;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  .btn {
    background: transparent;
    padding: 0;
    line-height: 0;

    image {
      width: 54rpx;
      height: 56rpx;
    }
  }
  .main-share-image {
    width: 126rpx;
    height: 52rpx;
  }

  .main-share-text {
    font-weight: Regular;
    font-size: 26rpx;
    text-align: center;
    color: #ffffff;
  }
}
button::after {
  border: none;
}
</style>
