<template>
  <view class="ad-structure">
    <view
      v-for="(inItem,inIndex) in portalAd"
      :key="inIndex"
      class="ad-structure-type"
    >
      <view v-if="inItem.style==1">
        <view
          v-for="(contenItem,contentIndex) in inItem.portalAd"
          :key="contentIndex"
        >
          <view v-if="contentIndex<1">
            <view
              class="ad-structure-1-1"
              @click.stop="bannerClickEvent(contenItem)"
            >
              <view class="ad-structure-1-1-item">
                <img
                  class="item-image"
                  :src="contenItem.url"
                  alt=""
                >
                <img
                  v-if="isShowBtn === 1"
                  class="item-btn"
                  :src="`${staticImgs}/lnmp/ln-find/find-play-btn.png`"
                  alt=""
                >
              </view>
              <view class="ad-structure-1-1-title">
                <view
                  v-if="contenItem.categoryTitle"
                  class="title"
                >
                  {{ contenItem.categoryTitle }}
                </view>
                <view
                  v-if="contenItem.categoryDesc"
                  class="desc"
                >
                  {{ contenItem.categoryDesc }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="inItem.style==2">
        <view class="ad-structure-1-2">
          <view
            v-for="(contenItem,contentIndex) in inItem.portalAd"
            :key="contentIndex"
          >
            <view v-if="contentIndex<2">
              <view
                class="ad-structure-1-2-item"
                @click.stop="bannerClickEvent(contenItem)"
              >
                <view class="ad-structure-1-2-item-img-box">
                  <img
                    class="imgs"
                    :src="contenItem.url"
                  >
                  <img
                    v-if="isShowBtn === 1"
                    class="item-btn"
                    :src="`${staticImgs}/lnmp/ln-find/find-play-btn.png`"
                    alt=""
                  >
                </view>
                <view class="ad-structure-1-2-item-title">
                  <view
                    v-if="contenItem.categoryTitle"
                    class="title"
                  >
                    {{ contenItem.categoryTitle }}
                  </view>
                  <view
                    v-if="contenItem.categoryDesc"
                    class="desc"
                  >
                    {{ contenItem.categoryDesc }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="inItem.style==3">
        <view class="ad-structure-1-3">
          <view
            v-for="(contenItem,contentIndex) in inItem.portalAd"
            :key="contentIndex"
          >
            <view v-if="contentIndex<3">
              <view
                class="ad-structure-1-3-item"
                :class="{'is-margin':(contentIndex%3)===1}"
                :style="{backgroundImage:`url(${contenItem.url})`}"
                @click.stop="bannerClickEvent(contenItem)"
              >
                <view
                  v-if="contenItem.categoryTitle"
                  class="title"
                >
                  {{ contenItem.categoryTitle }}
                </view>
                <view
                  v-if="contenItem.categoryDesc"
                  class="desc"
                >
                  {{ contenItem.categoryDesc }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="inItem.style==4">
        <view
          class="ad-structure-4"
          @click.stop="bannerClickEvent(inItem.portalAd[0])"
        >
          <view class="ad-structure-4-1-item">
            <img
              :src="inItem.portalAd[0].url"
              alt=""
            >
          </view>
          <view class="ad-structure-4-2-item">
            <img
              class="imgs i-1"
              :src="inItem.portalAd[1].url"
              alt=""
              @click.stop="bannerClickEvent(inItem.portalAd[1])"
            >
            <img
              class="imgs i-2"
              :src="inItem.portalAd[2].url"
              alt=""
              @click.stop="bannerClickEvent(inItem.portalAd[2])"
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import adService from "@/api/ad/index.js";
import {
  programaAnalysis,
} from "@/utils/common.js";
import {
  navigateToAny,
} from "@/utils/tools.js";

export default {
  components: {},
  // import引入的组件需要注入到对象中才能使用
  props: {
    // 接口传入参数
    params: {
      requrie: true,
      type: Object,
      default: () => { },
    },
    //
    isShowBtn: {
      type: Number,
      default: 1,
    },
  },
  data () {
    // 这里存放数据
    return {
      staticImgs: this.$staticImgs,
      portalAd: [],
      xxx: 0, //
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {

  },

  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    // this.params.moduleName

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.getAdLIst();
  },
  // 方法集合
  methods: {
    getAdLIst () {
      const params = {
        pageName: this.params.pageName,
        code: this.params.moduleId,
      };
      adService.getAdvertisement(params).then(res => {
        if (res.data.code === 200) {
          this.portalAd = res.data.data;
        }
      });
    },
    async bannerClickEvent (item) {
      // 埋点
      programaAnalysis(this.params, item.id);
      await this.$store.dispatch("getCustomorderList", `runAd_${item.id}`);
      if (this.$store.state.offlinePopup.loginShow) {
        this.$emit("openLoginPopup");
        return;
      }
      if (this.$store.state.offlinePopup.offlineFlag) {
        return;
      }
      navigateToAny(item);
      this.$emit("bannerClickEvent", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.ad-structure {
  width: 100vw;

  &-1-1 {
    width: 100%;
    margin-bottom: 30rpx;
    padding: 0 32rpx;

    &-item {
      width: 686rpx;
      height: 140rpx;
      border-radius: 20rpx;
      position: relative;

      .item-image {
        width: 100%;
        height: 100%;
        border-radius: 20rpx;
      }

      .item-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -39rpx;
        margin-top: -39rpx;
        width: 78rpx;
        height: 78rpx;
      }
    }

    &-title {
      width: 100%;
      margin-top: 20rpx;

      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 30rpx;
        font-weight: 500;
        text-align: left;
      }

      .desc {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 24rpx;
        font-weight: 400;
        color: #666666;
        text-align: left;
      }
    }
  }

  &-1-2 {
    display: flex;
    justify-content: center;
    margin-left: 14rpx;

    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0rpx;
    }

    &-item:nth-child(1) {
      margin-right: 14rpx;
    }

    &-item {
      width: 340rpx;

      &-img-box {
        width: 340rpx;
        height: 190rpx;
        border-radius: 20rpx;
        position: relative;

        .imgs {
          border-radius: 20rpx;
          width: 100%;
          height: 100%;
        }

        .item-btn {
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -39rpx;
          margin-top: -39rpx;
          width: 78rpx;
          height: 78rpx;
        }
      }

      &-title {
        width: 100%;
        margin-top: 20rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        .title {
          font-size: 30rpx;
          font-weight: 500;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .desc {
          font-size: 24rpx;
          font-weight: 400;
          color: #666666;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &:last-child {
          margin-top: 14rpx;
        }
      }
    }
  }

  &-1-3 {
    display: flex;
    justify-content: center;

    .is-margin {
      margin: 0 23rpx;
    }

    &-item {
      background: #ffffff;
      // border: 1px solid #bfbfbf;
      width: 214rpx;
      height: 286rpx;
      border-radius: 20rpx;
      margin-bottom: 22rpx;
      background-repeat: no-repeat;
      background-size: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;

      .title {
        white-space: nowrap;
        font-size: 28rpx;
        font-weight: 600;
      }

      .desc {
        font-size: 24rpx;
        font-weight: 400;
        color: #666666;
        margin-bottom: 21rpx;
      }

      &:last-child {
        margin-bottom: 10rpx;
      }
    }
  }

  &-4 {
    display: flex;

    // justify-content: center;
    &-item:nth-child(odd) {
      margin-right: 18rpx;
    }

    &-1-item {
      margin-left: 32rpx;
      width: 334rpx;
      height: 302rpx;

      img {
        width: 100%;
        height: 100%;
        border-radius: 20rpx;
      }
    }

    &-2-item {
      margin-right: 32rpx;
      margin-left: 19rpx;
      width: 334rpx;

      .imgs {
        width: 100%;
        height: 140rpx;
        border-radius: 20rpx;
      }

      .i-2 {
        margin-top: 12rpx;
      }
    }
  }

  // 样式调整
  &-1-2 + &-1-2 {
    margin-top: 24rpx;
  }

  &-1-2 + &-1-3 {
    margin-top: 24rpx;
  }
}

// 样式调整
.ad-structure-type + .ad-structure-type {
  margin-top: 15rpx;
}
</style>
