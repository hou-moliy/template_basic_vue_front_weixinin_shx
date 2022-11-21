<template>
  <view class="eb-ad-roll">
    <scroll-view scroll-x="true">
      <view class="eb-ad-roll-box">
        <view
          v-for="(item, index) in adList"
          :key="index"
          class="eb-ad-roll-item"
          @click="goToTopicDetail(item)"
        >
          <view class="img-box-row">
            <img
              class="topic-img"
              :src="item.url"
            >
          </view>
          <view
            v-if="item.title"
            class="topic-title-row"
          >
            {{ item.title }}
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import AdService from "@/api/ad/index.js";
import { navigateToAny } from "@/utils/navigateToAny.js";
export default {
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      adList: [],
    };
  },
  mounted () {
    this.getAdLIst();
  },
  methods: {
    // 使用运营位接口 获取专题列表
    getAdLIst () {
      console.log(this.pageConfig);
      const params = {
        pageName: this.pageConfig.pageName,
        code: this.pageConfig.moduleId,
      };
      AdService.getAdvertisement(params).then((res) => {
        if (res.data.code === 200) {
          this.adList = res.data.data[0].portalAd;
          // console.log("8-19", this.adList);
        }
      });
    },
    // 去详情
    goToTopicDetail (item) {
      navigateToAny(item);
    },
  },
};
</script>

<style lang="scss" scoped>
.eb-ad-roll {
  .eb-ad-roll-box {
    display: flex;

    .eb-ad-roll-item {
      margin-right: 20rpx;

      .img-box-row {
        position: relative;

        .topic-img {
          width: 430rpx;
          height: 240rpx;
          border-radius: 20rpx;
        }
      }

      // 标题
      .topic-title-row {
        width: 430rpx;
        font-size: 28rpx;
        font-family: PingFang SC Bold, PingFang SC Bold-Bold;
        font-weight: 500;
        text-align: left;
        color: #333333;
        line-height: 36rpx;
        margin-top: 20rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
      }
    }

    .eb-ad-roll-item:nth-of-type(1) {
      padding-left: 4%;
    }

    .eb-ad-roll-item:last-child {
      padding-right: 4%;
    }
  }
}
</style>
