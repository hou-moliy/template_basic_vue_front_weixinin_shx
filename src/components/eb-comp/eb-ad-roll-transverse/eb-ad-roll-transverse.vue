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
          <view
            class="img-box-row"
            :style="extraStyle"
          >
            <img
              :style="[extraStyle]"
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
import { copyAttr } from "@/utils/gCopy.js";

export default {
  props: {
    // pageConfig: {
    //   type: Object,
    //   default: () => { },
    // },
  },
  data () {
    return {
      adList: [],
      pageConfig: {},
      extraStyle: {
        width: "430",
        height: "240",
        borderRadius: "20",
      },
    };
  },
  mounted () {
    this.preHandleStyle();
    this.getAdLIst();
  },
  methods: {

    preHandleStyle () {
      this.pageConfig = JSON.parse("{\"pageName\":\"recommend_page\",\"pageModule\":\"find-new-hot-topic\",\"sort\":11,\"isShow\":1,\"showMoreFlag\":0,\"url\":null,\"title\":\"推荐页-管理\",\"showTitleFlag\":1,\"moduleId\":2764,\"moduleParams\":null,\"tagIcon\":\"https://t133.ebupt.com.cn/nresource/commonUpload/portalAd/893a3e3905504126bbb4abdb70e60912.jpg\",\"moduleFlag\":\"0031\",\"titleColor\":null,\"innerColor\":null,\"moduleType\":null,\"tipShow\":null,\"tip\":null,\"shareImgUrl\":null,\"shareTitle\":null,\"shareDesc\":null,\"moreTitle\":\"看看112\",\"extraStyle\":{\"width\": \"410\",\"height\": \"240\",\"borderRadius\":  \"20\"},\"eventUrl\":\"/pagesD/my/recenPlay\",\"eventType\":2,\"outAppId\":\"wx4e4ed37286c816c2\",\"freeLogin\":null}");
      this.extraStyle = copyAttr(this.extraStyle, this.pageConfig.extraStyle);
      console.log(this.extraStyle);
    },
    // 使用运营位接口 获取专题列表
    getAdLIst () {
      console.log("this.pageConfig", JSON.stringify(this.pageConfig));
      const params = {
        pageName: this.pageConfig.pageName,
        code: this.pageConfig.moduleId,
      };
      AdService.getAdvertisement(params).then((res) => {
        if (res.data.code === 200) {
          this.adList = res.data.data[0].portalAd;
        }
      });
    },
    // navigateToAny
    navigateToAny (item) {
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
