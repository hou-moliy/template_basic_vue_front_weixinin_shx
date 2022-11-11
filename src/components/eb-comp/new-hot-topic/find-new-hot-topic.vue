<template>
  <view class="hot-topic">
    <scroll-view scroll-x="true">
      <view class="hot-topic-box">
        <view
          v-for="(item, index) in videoTopicList"
          :key="index"
          class="hot-topic-item"
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
import adService from "@/api/ad/index.js";
import { navigateToAny } from "@/utils/tools.js";
export default {
  props: {
    params: {
      type: Object,
      default: () => { },
    },
    topicNum: {
      type: Number,
      default: 6,
    },
  },
  data () {
    return {
      videoTopicList: [],
    };
  },
  mounted () {
    this.getAdLIst();
  },
  methods: {
    // 使用运营位接口 获取专题列表

    getAdLIst () {
      const params = {
        pageName: this.params.pageName,
        code: this.params.moduleId,
      };
      adService.getAdvertisement(params).then((res) => {
        console.log("test-22", res);
        if (res.data.code === 200) {
          this.videoTopicList = res.data.data[0].portalAd;
          console.log("8-19", this.videoTopicList);
        }
      });
    },
    // 去专题详情
    goToTopicDetail (item) {
      console.log("item---8-22", item);
      navigateToAny(item);
    },
  },
};
</script>

<style lang="scss" scoped>
.hot-topic {
  .hot-topic-box {
    display: flex;

    .hot-topic-item {
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

    .hot-topic-item:nth-of-type(1) {
      padding-left: 4%;
    }

    .hot-topic-item:last-child {
      padding-right: 4%;
    }
  }
}
</style>
