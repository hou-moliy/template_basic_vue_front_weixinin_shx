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
    <view class="introduce">
      <view class="introduce-title">
        AI换铃计划
      </view>
      <view class="introduce-content">
        AI换铃是陕西移动为视频彩铃会员研发的一款智能换铃黑科技，根据用户喜好定时更换高质量的视频彩铃，让每一秒通话等待与众不同！
      </view>
      <view class="introduce-subcontent">
        您可自定义选择视频彩铃的主题，彩铃管家会为您在主题周期更换您选择的主题最近播放量最高的免费视频彩铃。<br>
        <text class="introduce-tips">
          注意：
        </text>开启AI换铃计划后，新的视频彩铃将会自动设置为“当前播放”，您之前的彩铃将会放置到“闲置彩铃”里。
      </view>
      <view
        class="introduce-button"
        :style="{background:aiStatus?'#e9e9e9':''}"
        @click="aiOpenChange"
      >
        <view
          v-if="!aiStatus"
          class="introduce-button-open"
        >
          一键开启
        </view>
        <view
          v-else="aiStatus"
          class="introduce-button-opened"
        >
          已开启
        </view>
      </view>
    </view>
    <!-- 主题 -->
    <view class="theme-name">
      我的主题彩铃
    </view>
    <view
      v-for="(item,index) in aiTopicArray"
      :key="index"
      class="theme-part"
    >
      <view class="theme-part-content">
        <view class="theme-part-content-tile">
          <image
            class="theme-part-content-tile-icon"
            :src="item.iconUrl"
          />
          <view class="theme-part-content-tile-name">
            {{ item.topicName }}
          </view>
        </view>
        <view class="switch-relative">
          <switch
            :checked="item.isOpen"
            color="#9E79FF"
          />
          <view
            class="switch-absolute"
            @click="themeStatusChange(item,index)"
          />
        </view>
      </view>
      <view class="theme-part-introduce">
        说明：{{ item.topicDesc }}
      </view>
    </view>
  </view>
</template>

<script>
// import aiPopup from "@/pagesB/components/aiPopup.vue";
import aiService from "@/api/ai/index.js";
import spclService from "@/api/cx/video.js";
// import uniPopup from "@/components/uni-popup/uni-popup.vue";
// import purchaseIndex from "@/components/purchase-popup/index.vue";
export default {
  name: "AiPage",
  data () {
    return {
      staticImgs: this.$staticImgs,
      aiStatus: false,
      aiTopicArray: [],
      spclStatus: false,
      switchStatus: false,
      // simplePopupFlag: false,
      // simpleContent: '',
      // buttonType: '',
      // topicId: -1,
      // topicIndex: -1,
      // btnType: '',
    };
  },
  onShow () {
    this.init();
  },
  methods: {
    // 初始化
    init () {
      // 查询用户是否开通ai换铃
      this.checkPortalUser();
      // 获取主题信息
      this.getAiTopic();
      // 查询用户是否开通视频彩铃
      this.getSpclStatus();
    },
    // 获取主题信息
    getAiTopic () {
      aiService.getAiTopic().then(res => {
        if (res.data.code == 200 && res.data.data) {
          this.aiTopicArray = res.data.data;
        }
      });
    },
    // 查询用户是否开通ai换铃
    checkPortalUser () {
      aiService.checkPortalUser().then(res => {
        if (res.data.code == 200) {
          console.log("res", res);
          if (res.data.data && res.data.data.isAIOpen == 1) {
            this.aiStatus = true;
          } else {
            this.aiStatus = false;
          }
        } else {
          console.log("请求接口有误");
        }
      });
    },
    // 查询用户是否开通视频彩铃
    getSpclStatus () {
      spclService.getSpclAiStatus().then(res => {
        if (res.data.code === 200 && res.data.data === "1") {
          this.spclStatus = true;
        } else if ((res.data.code === 200 && res.data.data === "0") || res.data.code === -200) {
          this.spclStatus = false;
        } else {
          this.spclStatus = true;
        }
      });
    },
    // ai换铃
    aiOpenChange () {
      /*
      // ai换铃业务开关接口
      if (!this.spclStatus) { // 是否开通视频彩铃业务
        this.buttonType = "open";
        this.simplePopupFlag = true;
        this.simpleContent = "AI智能换铃体验计划是辽宁移动对本省视频彩铃用户提供的专属特权服务，请您开通视频彩铃后体验!";
      } else {
        if (!this.aiStatus) { // 未开启ai功能
          aiService.aiFunction({
            type: 2,
          }).then(res => {
            if (res.data.code == 200) {
              this.$analysis.dispatch("aihl_kq");
              this.aiStatus = true;
              uni.showToast({
                title: "开启成功",
                icon: "none",
                duration: 1500,
              });
              uni.setStorageSync("aiStatus", true);
              this.getAiTopic();
            } else {
              uni.showToast({
                title: "操作失败，请稍后再试",
                icon: "none",
                duration: 1500,
              });
            }
          });
        } else { // 已开启ai功能
          this.simpleContent = "您确定要关闭Ai换铃功能吗？关闭后将无法享受Ai换铃特权哦～";
          this.simplePopupFlag = true;
          this.buttonType = "confirm";
        }
      }
      */
    },
    // 切换主题
    themeStatusChange (item, index) {
      /*
      this.topicId = item.topicId;
      this.topicIndex = index;
      if (!this.spclStatus) { // 是否开通视频彩铃业务
        this.buttonType = "open";
        this.simplePopupFlag = true;
        this.simpleContent = "AI智能换铃体验计划是辽宁移动对本省视频彩铃用户提供的专属特权服务，请您开通视频彩铃后体验!";
      } else if (!this.aiStatus) { // 判定是否开启AI
        uni.showToast({
          title: "请先开启AI换铃功能再进行设置",
          icon: "none",
          duration: 1500,
        });
      } else {
        if (item.isOpen) {
          console.log(88, this.topicId, this.topicIndex);
          // this.switchStatus = !this.switchStatus
          aiService.updateUserTopic({
            type: 1,
            topicId: this.topicId,
          }).then(res => {
            if (res.data.code == 200) {
              uni.showToast({
                title: "关闭成功",
                icon: "none",
                duration: 1500,
              });
              this.aiTopicArray[this.topicIndex].isOpen = false;
              this.simplePopupFlag = false;
            }
          });
        } else {
          aiService.updateUserTopic({
            type: 2,
            topicId: item.topicId,
          }).then(res => {
            if (res.data.code == 200) {
              this.$analysis.dispatch("aihl_zt_id", item.topicId);
              uni.showToast({
                title: "开启成功",
                icon: "none",
                duration: 1500,
              });
              this.aiTopicArray[index].isOpen = true;
              this.simplePopupFlag = false;
            }
          });
        }
      }
      */
    },
  },
};
</script>

<style lang="scss" scoped>
.header-ai {
  .header-ai-image {
    display: inline-block;
    width: 100%;
    height: 801rpx;
    vertical-align: top;
  }
}
.introduce {
  position: absolute;
  top: 368rpx;
  left: 50%;
  transform: translate(-50%, 0rpx);
  width: 686rpx;
  height: 674rpx;
  margin: 0 auto;
  border-radius: 20rpx;
  box-shadow: 0px 0px 22rpx 2rpx rgba(32, 32, 32, 0.11);
  background: #ffffff;
  padding-left: 38rpx;
  padding-right: 38rpx;
  box-sizing: border-box;

  .introduce-title {
    height: 100rpx;
    font-size: 36rpx;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    text-align: center;
    color: #333333;
    line-height: 100rpx;
    border-bottom: 1rpx solid #e5e5e5;
  }

  .introduce-content {
    text-indent: 26rpx;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 400;
    text-align: left;
    color: #252A3E;
    margin-top: 23rpx ;
    padding: 32rpx 38rpx 40rpx 26rpx;
    line-height: 46rpx;
    background-color: #F8F6FF;
  }
  .introduce-subcontent{
    font-size: 24rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 400;
    text-align: left;
    color: #666666;
    margin: 26rpx 0 40rpx 0;
    line-height: 46rpx;
    .introduce-tips{
      color: #9276f1;
    }
  }

  .introduce-button {
    width: 520rpx;
    height: 88rpx;
    border-radius: 44rpx;
    margin: 0 auto;
    background: linear-gradient(90deg, #9E79FF 0%, #FF83D9 100%);
    display: flex;
    flex-direction: column;
    // justify-content: space-around;
    justify-content: center;
    padding: 6rpx 0rpx;
    box-sizing: border-box;

    .introduce-button-open {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-align: center;
      color: #ffffff;
      line-height: 35rpx;
    }

    .introduce-button-opened {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: center;
      color: #999999;
    }

    .introduce-button-price {
      font-size: 22rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: center;
      color: #ffec9f;
      line-height: 25rpx;
      padding-top: 8rpx;
    }
  }

}
.theme-name {
  margin: 320rpx 0 40rpx 33rpx;
  font-size: 36rpx;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  text-align: left;
  color: #333333;
}
.theme-part {
  width: 686rpx;
  // height: 220rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0px 0px 22rpx 2rpx rgba(32, 32, 32, 0.11);
  padding: 29rpx 32rpx 29rpx 32rpx;
  box-sizing: border-box;
  margin: 0 auto;
  margin-bottom: 30rpx;

  .theme-part-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24rpx;

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
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        text-align: left;
        color: #333333;
      }
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
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: left;
    color: #666666;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 40rpx;
  }
}
</style>
