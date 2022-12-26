<template>
  <view>
    <!-- header -->
    <view class="header-ai">
      <image
        class="header-ai-image"
        :src="`${staticImgs}/shxmp/init/ai_bg.png`"
      />
    </view>
    <!-- 介绍 -->
    <view class="introduce-box">
      <view class="introduce">
        <view class="introduce-title">AI换铃计划</view>
        <view class="introduce-content">
          AI换铃是陕西移动为视频彩铃会员研发的一款智能换铃黑科技，根据用户喜好定时更换高质量的视频彩铃，让每一秒通话等待与众不同！
        </view>
        <view class="introduce-subcontent">
          您可自定义选择视频彩铃的主题，彩铃管家会为您在主题周期更换您选择的主题最近播放量最高的免费视频彩铃。
          <br />
          <text class="introduce-tips">注意：</text>
          开启AI换铃计划后，新的视频彩铃将会自动设置为“当前播放”，您之前的彩铃将会放置到“闲置彩铃”里。
        </view>
        <view
          class="introduce-button"
          :style="{ background: aiStatus ? '#c6c5c8' : '' }"
          @click="aiOpenChange"
        >
          <view v-if="!aiStatus" class="introduce-button-open">一键开启</view>
          <view
            v-else
            class="introduce-button-opened"
            :style="{ color: aiStatus ? '#fff' : '' }"
          >
            已开启
          </view>
        </view>
      </view>
      <!-- 主题 -->
      <view class="theme-name">选择您喜欢的视频彩铃主题</view>

      <view class="theme-part">
        <view
          v-for="(item, index) in aiTopicArray"
          :key="index"
          class="theme-part-content"
        >
          <view class="theme-part-content-tile">
            <image class="theme-part-content-tile-icon" :src="item.iconUrl" />
          </view>

          <view class="theme-part-right">
            <view class="theme-part-content-tile-name">
              {{ item.topicName }}
            </view>
            <view class="switch-relative">
              <switch :checked="item.isOpen" color="#9E79FF" />
              <view
                class="switch-absolute"
                @click="themeStatusChange(item, index)"
              />
            </view>
          </view>
        </view>
      </view>
      <view style="height: 20rpx" />
      <ebConfigContainerAsync
        v-if="activityId && pageConfig"
        ref="EbConfigContainerAsync"
        :page-config-list="pageConfig"
        :activity-id="activityId"
      />
    </view>
    <!-- 开通视彩弹窗 -->
    <popupTemplateOperition
      :popup-info="popupInfo"
      :show="show"
      @buttonClick="operitionBtnClick"
      @closePopup="closeOperitionPopup"
    />
    <!-- 提示类弹窗 -->
    <notifyPop ref="NotifyPop" />
    <!-- 下线通知 -->
    <offline-popup
      v-if="Boolean($store.state.offlinePopup.offlinePopupShow)"
      ref="offlinePopup"
    />
  </view>
</template>

<script>
import ebConfigContainerAsync from "@/components/eb-comp/eb-config-container/eb-config-container-async.vue";
import SpclService from "@/api/spcl/index.js";
import TemplateService from "@/api/template/index";

export default {
  name: "AiPage",
  components: { ebConfigContainerAsync },
  data () {
    return {
      staticImgs: this.$staticImgs,
      aiStatus: false,
      aiTopicArray: [],
      spclStatus: false,
      switchStatus: false,
      show: false,
      popupInfo: {},
      pageConfig: {},
      notifyInfo: {}, // 弹窗信息
      activityId: "ai_spcl_page", //  ai换铃配置区域活动id
      isOpenCount: 0, // 开启AI主题数量
    };
  },
  onLoad () {
    this.getPageConfig();
  },
  onShow () {
    this.$analysis.dispatch("ai_pv");
    this.init();
    this.handleFresh();
  },
  // 下拉到底部
  onReachBottom () {
    // 请求列表
    console.log("下拉到底部");
    if (this.$refs.EbConfigContainerAsync) {
      this.$refs.EbConfigContainerAsync.onScrollBottom();
    }
  },
  methods: {
    // 刷新组件信息
    handleFresh () {
      if (this.$refs.EbConfigContainerAsync) {
        this.$refs.EbConfigContainerAsync.handleFresh();
      }
    },
    // 获取页面配置信息
    getPageConfig () {
      TemplateService.getPageConfigByPageName({
        pageName: `${this.activityId}`,
      }).then(res => {
        if (res.data.code === 200) {
          this.pageConfig = res.data.data;
        }
      });
    },
    // 初始化
    init () {
      // 获取主题信息
      this.getAiTopic();
      // 查询用户是否开通视频彩铃
      this.getSpclStatus();
      // 查询用户是否开通ai换铃
      this.checkPortalUser();
    },
    // 获取主题信息
    getAiTopic () {
      SpclService.getAiTopic().then(res => {
        if (res.data.code === 200 && res.data.data) {
          this.aiTopicArray = res.data.data;
        }
      });
    },
    // 查询用户是否开通ai换铃
    async checkPortalUser () {
      const res = await this.$store.dispatch("user/getUserAiStatus");
      this.aiStatus = res;
    },
    // 查询用户是否开通视频彩铃
    async getSpclStatus () {
      const res = await this.$store.dispatch("user/getUserSpclStatus");
      this.spclStatus = res;
    },
    // 开通AI换铃
    async handleOpenAi (flag = 2) {
      this.$loading("请稍等...", true, 0);
      // flag 2 开启 1取消
      const res = await SpclService.openAi({ type: flag });
      if (res.data.code === 200) {
        uni.hideLoading();
        const mes = flag === 2 ? "开启成功" : "取消成功";
        this.$toast(mes);
        this.aiStatus = flag === 2 ? 1 : 0;
        this.$store.commit("user/SET_AI_STATUS", this.aiStatus);
        this.getAiTopic();
      } else {
        uni.hideLoading();
        this.$toast(res.data.message);
      }
    },
    // ai换铃
    aiOpenChange () {
      // ai换铃业务开关接口
      if (!this.spclStatus) {
        // 埋点
        this.$analysis.dispatch("ai_open_count");
        // 是否开通视频彩铃业务
        this.show = true;
        this.popupInfo = uni.getStorageSync("windowAllObj").common_spcl_open;
      } else {
        if (!this.aiStatus) {
          this.$analysis.dispatch("ai_open_count");
          // 未开启ai功能,开通ai换铃方法
          const notifyInfo = uni.getStorageSync("windowAllObj").common_ai_open;
          this.$showNotifyPop(this, notifyInfo, () => this.handleOpenAi());
        } else {
          this.$analysis.dispatch("ai_close_count");
          // 已开启ai功能,弹出提示类弹窗
          const notifyInfo = uni.getStorageSync("windowAllObj").common_ai_cancel;
          this.$showNotifyPop(this, notifyInfo, () => this.handleOpenAi(1));
        }
      }
    },
    // 切换主题
    async themeStatusChange (item, index) {
      this.topicId = item.topicId;
      this.topicIndex = index;
      this.aiTopicArray.forEach(aiItem => {
        if (aiItem.isOpen) this.isOpenCount += 1;
      });
      console.log(this.isOpenCount);
      if (!this.spclStatus) {
        // 是否开通视频彩铃业务
        this.show = true;
        this.popupInfo = uni.getStorageSync("windowAllObj").common_spcl_open;
      } else if (!this.aiStatus) {
        // 判定是否开启AI
        this.$toast("请先开启AI换铃功能再进行设置");
      } else {
        if (this.isOpenCount === 1 && item.isOpen) {
          this.isOpenCount = 0;
          return this.$toast("至少开启一个主题哦~");
        }
        const type = item.isOpen ? 1 : 2;
        const res = await SpclService.updateUserTopic({ type, topicId: this.topicId });
        if (res.data.code === 200) {
          const message = item.isOpen ? "关闭成功" : "开启成功";
          this.$toast(message);
          if (item.isOpen) {
            this.aiTopicArray[this.topicIndex].isOpen = false;
            this.$analysis.dispatch("ai_theme_closecount", item.topicId);
            this.isOpenCount -= 1;
          } else {
            this.aiTopicArray[index].isOpen = true;
            this.$analysis.dispatch("ai_theme_opencount", item.topicId);
            this.isOpenCount += 1;
          }
        } else {
          this.$toast(res.data.message);
        }
      }
      this.isOpenCount = 0;
    },
    // 确认开通视频彩铃
    operitionBtnClick (e) {
      if (e.btnInfo.type === 1) {
        // 关闭弹窗
        this.closePopup();
      } else if (e.btnInfo.type === 2) {
        // 订购
        this.handleOpenSpcl(e);
      }
    },
    // 开通视频彩铃
    handleOpenSpcl (e) {
      SpclService.openSpcl({ servType: "001" }).then(res => {
        if (res.data.code === 200) {
          if (e.protocolCheckFlag) {
            // 勾选了AI换铃
            this.defaultthandleOpenAi();
          } else {
            this.$toast("成功开通视频彩铃业务");
            this.show = false;
            this.$store.commit("user/SET_SPCL_STATUS", 1);
          }
        } else {
          this.$toast("开通失败请重试");
        }
      });
    },
    defaultthandleOpenAi () {
      SpclService.openAi({ type: 2 }).then(res => {
        if (res.data.code === 200) {
          this.$toast("成功开通视频彩铃业务");
          this.show = false;
          this.$store.commit("user/SET_SPCL_STATUS", 1);
          this.$store.commit("user/SET_AI_STATUS", 1);
        } else {
          this.$toast("开通失败请重试");
        }
      });
    },
    // 取消开通视频彩铃
    closeOperitionPopup () {
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.introduce-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 365rpx;
  width: 100%;
}
.header-ai {
  .header-ai-image {
    display: inline-block;
    width: 100%;
    height: 801rpx;
    vertical-align: top;
  }
}
.introduce {
  top: 368rpx;
  width: 686rpx;
  margin: 0 auto;
  border-radius: 20rpx;
  box-shadow: 0px 0px 22rpx 2rpx rgba(32, 32, 32, 0.11);
  background: #ffffff;
  padding-left: 38rpx;
  padding-right: 38rpx;
  box-sizing: border-box;
  padding-bottom: 70rpx;

  .introduce-title {
    height: 100rpx;
    font-size: 36rpx;
    font-family: PingFang SC, PingFang SC-Bold, sans-serif;
    font-weight: 700;
    text-align: center;
    color: #333333;
    line-height: 100rpx;
    border-bottom: 1rpx solid #e5e5e5;
  }

  .introduce-content {
    text-indent: 26rpx;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Medium, sans-serif;
    font-weight: 400;
    text-align: left;
    color: #252a3e;
    margin-top: 23rpx;
    padding: 32rpx 38rpx 40rpx 26rpx;
    line-height: 46rpx;
    background-color: #f8f6ff;
  }
  .introduce-subcontent {
    font-size: 24rpx;
    font-family: PingFang SC, PingFang SC-Medium, sans-serif;
    font-weight: 400;
    text-align: left;
    color: #666666;
    margin: 26rpx 0 40rpx 0;
    line-height: 46rpx;
    .introduce-tips {
      color: #9276f1;
    }
  }

  .introduce-button {
    width: 520rpx;
    height: 88rpx;
    border-radius: 44rpx;
    margin: 0 auto;
    background: linear-gradient(90deg, #9e79ff 0%, #ff83d9 100%);
    display: flex;
    flex-direction: column;
    // justify-content: space-around;
    justify-content: center;
    padding: 6rpx 0rpx;
    box-sizing: border-box;
    // box-shadow: -4rpx 13rpx 44rpx -18rpx #b37bf5;

    .introduce-button-open {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC-Bold, sans-serif;
      font-weight: 700;
      text-align: center;
      color: #ffffff;
      line-height: 35rpx;
    }

    .introduce-button-opened {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC-Medium, sans-serif;
      font-weight: 500;
      text-align: center;
      color: #999999;
    }

    .introduce-button-price {
      font-size: 22rpx;
      font-family: PingFang SC, PingFang SC-Medium, sans-serif;
      font-weight: 500;
      text-align: center;
      color: #ffec9f;
      line-height: 25rpx;
      padding-top: 8rpx;
    }
  }
}
.theme-name {
  margin: 60rpx 0 40rpx 0rpx;
  font-size: 36rpx;
  font-family: PingFang SC, PingFang SC-Bold, sans-serif;
  font-weight: 700;
  text-align: left;
  color: #333333;
  padding: 0rpx 40rpx;
  box-sizing: border-box;
}
.theme-part {
  width: 686rpx;
  // height: 220rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0px 0px 22rpx 2rpx rgba(32, 32, 32, 0.11);
  padding: 32rpx 32rpx 0rpx 32rpx;
  box-sizing: border-box;
  margin: 0 auto;
  margin-bottom: 30rpx;

  .theme-part-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 26rpx;

    .theme-part-content-tile {
      display: flex;
      justify-content: space-between;

      .theme-part-content-tile-icon {
        width: 58rpx;
        height: 58rpx;
        display: inline-block;
        vertical-align: top;
        margin-right: 15rpx;
      }

      .theme-part-content-tile-name {
        font-size: 32rpx;
        font-family: PingFang SC, PingFang SC-Bold, sans-serif;
        font-weight: 700;
        text-align: left;
        color: #333333;
      }
    }
    .theme-part-right {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 31rpx;
      font-size: 30rpx;
      color: #222222;
    }
  }
  .switch-relative {
    position: relative;
  }

  .switch-absolute {
    position: absolute;
    top: 0rpx;
    left: 0rpx;
    bottom: 0rpx;
    right: 0rpx;
  }

  .theme-part-introduce {
    font-size: 24rpx;
    font-family: PingFang SC, PingFang SC-Regular, sans-serif;
    font-weight: 400;
    text-align: left;
    color: #666666;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 40rpx;
  }
}
.theme-part view:last-child .theme-part-right {
  border-bottom: 0px;
}
</style>
