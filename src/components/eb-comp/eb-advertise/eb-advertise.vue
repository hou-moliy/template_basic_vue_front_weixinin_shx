<template>
  <view
    v-if="adverSource.length"
    class="advertising"
  >
    <view class="news_icon">
      <image
        class="news"
        :src="`${staticImgs}/lnmp/advertise_news.png`"
      />
    </view>
    <view class="split" />
    <view class="content">
      <swiper
        autoplay
        circular
        vertical
        :interval="3000"
        @change="currentChange"
      >
        <swiper-item
          v-for="item in adverSource"
          :key="item.id"
          @click="jump(item)"
        >
          <image
            class="icon"
            mode="heightFix"
            :src="item.url"
          />
          <view>
            {{ item.categoryTitle }}
          </view>
        </swiper-item>
      </swiper>
      <view
        class="img_box"
        @click="jump(singleSource)"
      >
        <image
          class="arrow"
          :src="`${staticImgs}/lnmp/advertise_arrow_right.png`"
        />
      </view>
    </view>
  </view>
</template>

<script>
import adService from "@/api/ad/index.js";
import { navigateToAny } from "@/utils/tools.js";
export default {
  name: "FindAdvertise",
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      adverSource: [], // 广告资源
      singleSource: null, // 当前广播资源
    };
  },
  mounted () {
    this.getAdvertising();
  },
  methods: {
    // 获取轮播广告资源
    getAdvertising () {
      const params = {
        pageName: this.pageConfig.pageName,
        code: this.pageConfig.pageModule,
      };
      adService.getAdvertise(params).then((res) => {
        console.log("test", res);
        if (res.data.code === 200) {
          this.adverSource = res.data.data;
          this.singleSource = this.adverSource[0];
          console.log("test1", this.adverSource);
        }
      });
    },
    // 广告事件
    async jump (e) {
      console.log("广告", e);
      if (this.pageConfig.pageName === "recommend_page") {
        this.$analysis.dispatch("fxtj_xx_gg_id", e.id);
      } else if (this.pageConfig.pageName === "ln_spcl_index") {
        this.$analysis.dispatch("fxspcl_xx_gg_id", e.id);
      }
      await this.$store.dispatch("getCustomorderList", `advertise_${e.id}`);
      if (this.$store.state.offlinePopup.loginShow) {
        this.$emit("openLoginPopup");
        return;
      }
      if (this.$store.state.offlinePopup.offlineFlag) {
        return;
      }
      navigateToAny(e);
    },
    currentChange (e) {
      this.singleSource = this.adverSource[e.detail.current];
    },
  },
};
</script>

<style lang="scss" scoped>
.advertising {
  height: 88rpx;
  background: #f8f8f8;
  border-radius: 20rpx;
  // box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 44rpx 20rpx 0 20rpx;

  .news_icon {
    width: 84rpx;
    display: flex;
    justify-content: flex-end;
    .news {
      width: 62rpx;
      height: 26rpx;
    }
  }

  .split {
    width: 2rpx;
    height: 34rpx;
    border-right: 1rpx solid #d6d6d6;
    margin: 0 15rpx 0 20rpx;
  }

  .content {
    width: calc(100% - 122rpx);
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    swiper {
      width: calc(100% - 58rpx);
      height: 100%;

      swiper-item {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

        .icon {
          // width: 58rpx;
          height: 30rpx;
          margin-right: 12rpx;
        }

        view {
          width: calc(100% - 70rpx);
          font-size: 26rpx;
          font-family: PingFang SC, PingFang SC-Medium;
          color: #666666;
          line-height: 26rpx;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
        }
      }
    }
  }

  .img_box {
    height: 100%;
    width: 58rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    .arrow {
      width: 15rpx;
      height: 27rpx;
    }
  }
}
</style>
