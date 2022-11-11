<template>
  <view
    class="fall-item-wrap"
    :style="{ backgroundImage: `url(${item.liveImgUrl})` }"
    @click="navigateLive(item)"
  >
    <view
      class="item-tag"
      :class="{'item-tag-livecount': liveStatus === 1||liveStatus === 0,'item-tag-living': liveStatus === 2}"
    >
      <block v-if="liveStatus === 2">
        <image
          :src="`${staticImgs}/lnmp/ln-find/find-living.png`"
          mode=""
        />
        <view class="item-tag-text">
          直播中
        </view>
      </block>
      <block v-else-if="liveStatus === 1">
        <image
          :src="`${staticImgs}/lnmp/ln-find/find-livecount.png`"
          mode=""
        />
        <view class="item-tag-text">
          {{ timehtml }}
        </view>
      </block>
      <block v-else-if="liveStatus === 0">
        <image
          :src="`${staticImgs}/lnmp/ln-find/find-livecount.png`"
          mode=""
        />
        <view class="item-tag-text">
          直播结束
        </view>
      </block>
    </view>
    <view class="item-bottom">
      <view class="item-title">
        {{ item.liveTitle }}
      </view>
      <view class="item-info">
        <image
          class="item-info-avatar"
          :src="item.channelAvatar"
          mode=""
        />
        <text class="item-info-name">
          {{ item.channelTitle }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "LivefallItem",
  props: {
    item: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      timer: null,
      timehtml: "",
      liveStatus: 1,
    };
  },
  created () {
    this.handleInit();
  },
  methods: {
    // 初始化直播数据
    async handleInit () {
      const {
        liveStartTime,
      } = this.item;
      this.liveStatus = await this.handleLiveStatus();
      if (this.liveStatus === 1 && liveStartTime) {
        this.timeCount(liveStartTime);
      }
    },
    // 跳转直播详情
    navigateLive (event) {
      if (uni.getStorageSync("Authorization")) {
        // TODO
        // 直播直接跳转直播H5页面，前缀写死；等待刘浩开发完成后提供
        this.$analysis.dispatch("fxzb_zbid", event.liveId);
        // console.log('event',event)
        uni.navigateTo({
          url: `/pagesCommon/webView/liveBroadcast?id=${event.liveId}&channelTitle=${event.channelTitle}&liveShareUrl=${event.liveShareUrl}`,
        });
      } else {
        this.$emit("openLoginPopup");
      }
    },
    // 处理直播状态
    handleLiveStatus () {
      const {
        liveStartTime,
        liveEnd,
      } = this.item;
      if (liveEnd !== null && liveEnd === 1) { // 直播结束
        return 0;
      } else if (this.contrastTime(liveStartTime)) { // 直播倒计时
        return 1;
      } else if (!this.contrastTime(liveStartTime)) { // 直播中
        return 2;
      }
    },
    // 判断当前直播时间是否大于当前实际时间
    contrastTime (liveStartTime) {
      // 获取当前时间
      const date = new Date();
      const now = date.getTime();
      // 转换直播时间
      liveStartTime = liveStartTime.replace(/-/g, "/");
      const endDate = new Date(liveStartTime);
      const end = endDate.getTime();
      // 时间差
      const offset = Math.floor((end - now) / 1000);
      if (offset <= 0) {
        return 0;
      }
      return 1;
    },
    timeCount (liveStartTime) {
      this.timer = setInterval(() => {
        // 获取当前时间
        const date = new Date();
        const now = date.getTime();
        // 设置截止时间
        liveStartTime = liveStartTime.replace(/-/g, "/");
        const endDate = new Date(liveStartTime);
        const end = endDate.getTime();
        // 时间差
        const offset = Math.floor((end - now) / 1000);
        if (offset <= 0) {
          this.liveStatus = 2; // 直播中
          clearInterval(this.timer);
        }

        let secLeft = offset % 60;
        let minLeft = Math.floor(offset / 60) % 60;
        let hourLeft = Math.floor(offset / 60 / 60) % 24;
        const day = Math.floor(offset / 60 / 60 / 24);

        // 补0操作
        secLeft = (secLeft < 10 ? "0" : "") + secLeft;
        minLeft = (minLeft < 10 ? "0" : "") + minLeft;
        hourLeft = (hourLeft < 10 ? "0" : "") + hourLeft;
        // 4）拼接时间格式，写入timehtml
        this.timehtml = day + "天" + hourLeft + "时" + minLeft + "分" + secLeft + "秒";
      }, 1000);
    },

  },
};
</script>

<style lang="scss" scoped>
.fall-item-wrap {
  width: 334rpx;
  height: 445rpx;
  border-radius: 20rpx;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  box-sizing: border-box;
  position: relative;
}

.item {
  &-tag {
    width: fit-content;
    padding: 0rpx 14rpx;
    box-sizing: border-box;
    height: 36rpx;
    display: flex;
    align-items: center;
    border-radius: 18rpx;
    font-size: 24rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: left;
    color: #ffffff;

    &-text {
      max-width: 220rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-living {
      width: fit-content;
      background: linear-gradient(to right, #ff6f50, #ff008c);

      image {
        width: 19rpx;
        height: 19rpx;
        vertical-align: middle;
        margin-right: 7rpx;
      }
    }

    &-livecount {
      width: fit-content;
      background-color: rgba(0, 0, 0, 0.4);

      image {
        width: 22rpx;
        height: 22rpx;
        vertical-align: middle;
        margin-right: 7rpx;
      }
    }
  }

  &-title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: left;
    color: #ffffff;
    line-height: 36rpx;
    text-shadow: 0rpx 3rpx 21rpx 0rpx rgba(0, 0, 0, 0.07);
  }

  &-bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0rpx;
    padding: 0rpx 20rpx 16rpx;
    height: 223rpx;
    box-sizing: border-box;
    background: linear-gradient(to bottom, #00000000, #000000b0);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border-radius: 0 0 20rpx 20rpx;
  }

  &-info {
    width: 100%;
    margin-top: 17rpx;

    &-avatar {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 11rpx;
    }

    &-name {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: left;
      color: #ffffff;
      line-height: 36rpx;
      text-shadow: 0rpx 3rpx 21rpx 0rpx rgba(0, 0, 0, 0.07);
    }
  }
}
</style>
