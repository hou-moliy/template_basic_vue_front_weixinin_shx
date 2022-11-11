<template>
  <view class="subscribe-warp">
    <image
      :src="`${staticImgs}/lnmp/ln-find/find-subscribe-icon.png`"
      mode=""
      class="subscribe-icon"
    />
    <view class="subscribe-r">
      <text class="subscribe-text">
        订阅后下次开播提醒您，直播特惠不错过
      </text>
      <view
        class="subscribe-btn"
        :class="{'active':!subscribeFlag,'un-active':subscribeFlag}"
        @click.stop="handleSubscribe"
      >
        {{ subscribeText }}
      </view>
    </view>
  </view>
</template>

<script>
import globalData from "@/globalData.js";
import liveService from "@/api/live/live.js";

export default {
  name: "FindLiveSubscribe",
  props: {
    params: {
      required: true,
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      subscribeFlag: false, // 标记是否订阅
    };
  },
  computed: {
    subscribeText () {
      return this.subscribeFlag ? "已订阅" : "订阅";
    },
  },
  created () {
    console.log(this.params, "params");
    this.getLiveStatus();
  },
  methods: {
    // 查询订阅状态
    async getLiveStatus () {
      if (!uni.getStorageSync("Authorization")) {
        return;
      }
      await liveService.getLiveSourceStatus().then(({
        data: res,
      }) => {
        if (res.code === 200) {
          this.subscribeFlag = true; // 已订阅
        } else if (res.code === 500) {
          this.subscribeFlag = false; // 未订阅
        }
      });
    },
    // 处理订阅
    handleSubscribe () {
      const that = this;
      const { msgTempId } = globalData;
      console.log(msgTempId, "当前的模板id");
      if (!uni.getStorageSync("Authorization")) {
        that.$emit("openLoginPopup");
        return;
      }
      if (that.subscribeFlag) {
        this.$tips("请勿重复订阅");
        return;
      }
      wx.requestSubscribeMessage({
        tmplIds: [`${msgTempId}`],
        success (res) {
          const status = res[`${msgTempId}`];
          if (status === "accept") {
            that.handleLiveSubscribe(msgTempId);
            that.$analysis.dispatch("fxzb_dy");
            that.$tips("订阅直播成功");
          } else if (status === "reject") {
            that.$tips("取消订阅");
          }
        },
        fail (error) {
          console.log(error);
        },
      });
    },
    async handleLiveSubscribe (tempId) {
      const params = {
        templateIds: [tempId],
        pushType: "liveDy",
      };
      await liveService.subscribeLive(params).then(({
        data: res,
      }) => {
        if (res.code === 200) {
          // 查询订阅状态
          this.getLiveStatus();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.subscribe-warp {
  width: 686rpx;
  height: 64rpx;
  background: #fffaee;
  border-radius: 32rpx;
  box-shadow: 1rpx 5rpx 13rpx 0rpx rgba(6, 0, 1, 0.09);
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0rpx 13rpx 0rpx 20rpx;
  box-sizing: border-box;
}

.subscribe-text {
  font-size: 26rpx;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: center;
  color: #684d0b;
}

.subscribe-r {
  display: flex;
}

.subscribe-icon {
  width: 29rpx;
  height: 28rpx;
  margin-right: 12rpx;
}

.subscribe-btn {
  width: 96rpx;
  height: 38rpx;
  font-size: 24rpx;
  line-height: 38rpx;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  border-radius: 19rpx;
  margin-left: 49rpx;
}
.active {
  background: linear-gradient(0deg, #ff6f50 0%, #ff008c 100%);
}
.un-active {
  background: linear-gradient(0deg, #b6b6b6 0%, #838383 100%);
}
</style>
