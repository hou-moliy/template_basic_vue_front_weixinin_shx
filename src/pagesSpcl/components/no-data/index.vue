<template>
  <!-- 空白展示样式 -->
  <view class="cur-ring-m">
    <image
      class="no-record"
      :src="`${staticImgs}/shxmp/init/no-spcl-data.png`"
    />

    <block v-if="type === 'curt'">
      <view class="no-record-tips1">您当前未设置播放</view>
      <view class="no-record-tips2">赶快去设置吧~</view>
      <view class="go-to-see" @click="toSet">去设置</view>
    </block>
    <view v-else class="no-record-tips3">您当前无闲置铃音哦~</view>
  </view>
</template>
<script>
export default {
  name: "NoData",
  props: {
    type: {
      type: String,
      default: "curt", // curt当前播放、lyk 我的闲置
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
    };
  },
  methods: {
    // 去设置
    toSet () {
      this.$emit("toSet", this.type);
    },
  },
};
</script>
<style lang="scss" scoped>
.cur-ring-m {
  margin-top: 30rpx;

  .no-record {
    width: 410rpx;
    height: 184rpx;
    margin-left: 170rpx;
    margin-top: 267rpx;
  }

  .no-record-tips1 {
    font-size: 32rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: #222222;
    margin-top: 94rpx;
  }

  .no-record-tips2 {
    margin-top: 22rpx;
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: center;
    color: #999999;
  }

  .no-record-tips3 {
    font-size: 30rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: #999999;
    margin-top: 96rpx;
  }

  .go-to-see {
    text-align: center;
    margin-top: 40rpx;
    width: 260rpx;
    background: linear-gradient(90deg, #ff6f50 54%, #ff008c 90%);
    background: linear-gradient(-90deg, #ff83d9 0%, #9e79ff 100%);
    border-radius: 10rpx;
    margin-left: 245rpx;
    font-size: 30rpx;
    font-family: PingFang SC Medium, PingFang SC Medium-Medium;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    letter-spacing: 0rpx;
    line-height: 80rpx;
  }
}
</style>
