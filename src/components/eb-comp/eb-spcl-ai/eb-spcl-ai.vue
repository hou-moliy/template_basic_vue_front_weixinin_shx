<template>
  <view v-if="dataList[0].portalAd[0].url" class="spcl-ai">
    <view v-if="pageConfig.tagIcon" class="more-topic-top-img">
      <image :src="pageConfig.tagIcon" />
    </view>
    <view class="ad-banner">
      <view class="ad-banner-box">
        <image class="ad-banner-image" :src="dataList[0].portalAd[0].url" />
        <view
          v-if="aiStatus == 0"
          class="oper-btn"
          :style="{ background: `${pageConfig.innerColor}` }"
          @click="openAiFun"
        >
          立即开启
        </view>
        <view v-else class="oper-btn oper-btn-grey" @click="openAiFun">
          已开启
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import AdService from "@/api/ad/index.js";
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
      staticImgs: this.$staticImgs,
      dataList: [],
    };
  },
  computed: {
    aiStatus () {
      return this.$store.state.user.aiStatus;
    },
  },
  created () {
    this.getAdBanner();
  },
  methods: {
    getAdBanner () {
      const params = {
        pageName: this.pageConfig.pageName,
        code: this.pageConfig.moduleId,
      };
      AdService.getAdvertisement(params).then(res => {
        if (res.data.code === 200) {
          this.dataList = res.data.data;
          this.$forceUpdate();
        }
      });
    },
    openAiFun () {
      this.$analysis.dispatch("spcl_ai", `${this.activityId}`).finally(() => {
        if (!uni.getStorageSync("Authorization")) {
          this.$emit("openLoginPopup");
          return;
        }
        this.$emit("changeAi");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.spcl-ai {
  margin-bottom: 40rpx;
}
.more-topic-top-img {
  text-align: center;
  margin-bottom: 40rpx;
  image {
    width: 100%;
    height: 48rpx;
  }
}

.ad-banner {
  height: 142rpx;
}

.ad-banner-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
}

.ad-banner-image {
  width: 686rpx;
  height: 142rpx;
  border-radius: 20rpx;
}

.oper-btn {
  width: 148rpx;
  height: 58rpx;
  background: linear-gradient(90deg, #fc6e5b 0%, #ff1c7d 100%);
  border-radius: 29rpx;
  font-size: 24rpx;
  color: #ffffff;
  line-height: 58rpx;
  text-align: center;
  position: absolute;
  right: 60rpx;
  top: 40rpx;
}

.oper-btn-grey {
  background: #c6c5c8;
}
</style>
