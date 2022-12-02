<template>
  <view v-if="!dataList.length == 0" class="spcl-swiper-box">
    <swiper
      class="spcl-swiper"
      previous-margin="136rpx"
      next-margin="136rpx"
      circular
      indicator-dots
      interval="4000"
      autoplay
      indicator-color="rgba(255,255,255,1)"
      indicator-active-color="#FF6953"
      @change="swiperChange"
    >
      <swiper-item
        v-for="(item, index) in dataList"
        :key="index"
        :class="{
          'swiper-item': currentIndex == index,
          'swiper-item-side': currentIndex != index,
        }"
      >
        <view
          class="equites-item"
          :class="
            currentIndex === index
              ? 'swiper-item-content'
              : 'swiper-item-content-side'
          "
          :animation="index == currentIndex ? animationData : animationData2"
          @click="goToPlayVideo(item)"
        >
          <image :src="item.openHCoverUrl || item.openVCoverUrl" />
          <view class="more-new-title">
            <view class="more-new-titleText">
              {{ item.ringName }}
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="oper-btn-box">
      <view v-if="dataList[currentIndex].isBuyVideo" class="oper-btn is-buy">
        已设置
      </view>
      <view
        v-else
        class="oper-btn"
        :style="{ background: `${pageConfig.innerColor}` }"
        @click="$emit('purchaseVideo', dataList[currentIndex])"
      >
        {{ pageConfig.title }}
      </view>
    </view>
  </view>
</template>

<script>
import SpclService from "@/api/spcl/index.js";
import { videoInfoUpdate } from "@/utils/video";
export default {
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
    activityId: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      agreementCheckFlag: false,
      staticImgs: this.$staticImgs,
      serveId: -1,
      currentIndex: 0,
      dataList: [],
      zoomParam: 1,
      animationData: {},
      animationData2: {},
    };
  },
  watch: {

  },
  created () {
    this.getSpclList();
  },
  mounted () {
  },
  methods: {
    handleFresh () {
      console.log("刷新拉~~~");
      this.getSpclList();
    },
    swiperChange (e) {
      this.currentIndex = e.detail.current;
      this.changeActive();
      this.changeNormal();
    },
    getSpclList () {
      const params = {
        ac: this.activityId,
        level: this.pageConfig.sort,
      };
      SpclService.getVideoByActivityId(params).then(res => {
        if (res.data.code === 200) {
          let tempList = res.data.data;
          if (tempList.length > 12) {
            tempList = tempList.slice(0, 12);
          }
          this.dataList = videoInfoUpdate(tempList);
        }
      });
    },
    // 收缩
    changeNormal () {
      const animation2 = wx.createAnimation({
        duration: 300,
        timingFunction: "linear",
      });
      this.animation2 = animation2;
      animation2
        .scale(1)
        .step();
      this.animationData2 = animation2.export();
    },
    // 展开
    changeActive () {
      const animation = wx.createAnimation({
        duration: 300,
        timingFunction: "linear",
      });
      this.animation = animation;
      animation
        .scale(1.13)
        .step();
      this.animationData = animation.export();
    },
    goToPlayVideo (item) {
      this.$emit("goToPlayVideo", { item, list: this.dataList });
    },
  },
};
</script>

<style scoped lang="scss">
.spcl-swiper-box {
  // padding-bottom: 40rpx;
  margin-bottom: 40rpx;
}

.equites-item {
  position: relative;
  width: 400rpx;
  height: 716rpx;

  image {
    width: 400rpx;
    height: 716rpx;
    border-radius: 20rpx;
  }
}

.more-new-title {
  width: 100%;
  height: 116rpx;
  font-size: 32rpx;
  font-family: PingFang SC Bold, PingFang SC Bold-Bold;
  font-weight: 700;
  text-align: left;
  color: #ffffff;
  background: linear-gradient(180deg, #ffffff00, #000000);
  opacity: 0.85;
  line-height: 36rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 20rpx;
  position: absolute;
  bottom: 0rpx;
  .more-new-titleText {
    width: 344rpx;
    position: absolute;
    bottom: 20rpx;
    left: 21rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.spcl-swiper {
  width: 750rpx;
  height: 950rpx;
}

// 指示点样式
.spcl-swiper ::v-deep .wx-swiper-dot {
  height: 10rpx;
  width: 10rpx;
}

.swiper-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-item-content {
  transform: scale(1.13);
}

.swiper-item-side {
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-item-content-side {
  transform: scale(1);
}

.oper-btn-box {
  display: flex;
  justify-content: center;
  margin-top: 28rpx;
}

.oper-btn {
  width: 445rpx;
  height: 78rpx;
  border-radius: 40rpx;
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
  line-height: 78rpx;
  text-align: center;
}

.is-buy {
  background: #c6c5c8;
}
</style>
