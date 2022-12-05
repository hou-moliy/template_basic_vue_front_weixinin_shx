<template>
  <view class="eb-ad-roll">
    <scroll-view scroll-x="true">
      <view class="eb-ad-roll-box">
        <view
          v-for="(item, index) in adList"
          :key="index"
          class="eb-ad-roll-item"
          @click="navigateToAny(item)"
        >
          <view class="img-box-row" :style="[extraStyle]">
            <image :style="[extraStyle]" :src="item.url" alt="" />
          </view>
          <view
            v-if="item.title"
            class="topic-title-row"
            :style="{ width: extraStyle.width }"
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
import { copyAttr } from "@/utils/gCopy.js";

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
      extraStyle: {
        width: "430rpx",
        height: "240rpx",
        borderRadius: "20rpx",
      },
    };
  },
  created () {
    this.extraStyle = copyAttr(this.extraStyle, JSON.parse(this.pageConfig.extraStyle));
  },
  mounted () {
    this.getAdLIst();
  },
  methods: {
    navigateToAny,
    // 使用运营位接口 获取专题列表
    getAdLIst () {
      const params = {
        pageName: this.pageConfig.pageName,
        code: this.pageConfig.moduleId,
      };
      AdService.getAdvertisement(params).then((res) => {
        if (res.data.code === 200 && res.data.data.length) {
          this.adList = res.data.data[0].portalAd;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.eb-ad-roll {
  margin-bottom: 40rpx;
  .eb-ad-roll-box {
    display: flex;

    image {
      vertical-align: middle;
    }
    .eb-ad-roll-item {
      .img-box-row {
        position: relative;
      }

      // 标题
      .topic-title-row {
        font-size: 30rpx;
        font-family: PingFang SC, PingFang SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #222;
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
      box-sizing: border-box;
    }

    .eb-ad-roll-item:last-child {
      padding-right: 4%;
      box-sizing: border-box;
    }
  }
}
.eb-ad-roll-item + .eb-ad-roll-item {
  margin-left: 22rpx;
}
</style>
