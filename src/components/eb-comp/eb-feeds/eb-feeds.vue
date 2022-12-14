<template>
  <view v-if="!portalAd.length == 0" class="ad-structure">
    <view v-if="pageConfig.tagIcon" class="more-topic-top-img">
      <image :src="pageConfig.tagIcon" mode="widthFix" />
    </view>
    <view class="ad-more-data-box">
      <view
        v-for="(inItem, inIndex) in portalAd"
        :key="inIndex"
        class="ad-structure-type"
      >
        <!-- 一行一个 -->
        <view v-if="inItem.style == 1">
          <view
            v-for="(contenItem, contentIndex) in inItem.portalAd"
            :key="contentIndex"
            :style="[contenItem.extraStyle]"
          >
            <view v-if="contentIndex < 1" :style="[contenItem.extraStyle]">
              <view
                class="ad-structure-1-1"
                :style="[contenItem.extraStyle]"
                @click.stop="bannerClickEvent(contenItem)"
              >
                <view
                  class="ad-structure-1-1-item"
                  :style="[contenItem.extraStyle]"
                >
                  <image
                    class="item-image"
                    :src="contenItem.url"
                    alt=""
                    :style="[contenItem.extraStyle]"
                  />
                </view>
                <view class="ad-structure-1-1-title">
                  <view v-if="contenItem.categoryTitle" class="title">
                    {{ contenItem.categoryTitle }}
                  </view>
                  <view v-if="contenItem.categoryDesc" class="desc">
                    {{ contenItem.categoryDesc }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 一行两个 -->
        <template v-else-if="inItem.style == 2">
          <view class="ad-structure-1-2">
            <view
              v-for="(contenItem, contentIndex) in inItem.portalAd"
              :key="contentIndex"
              :style="[contenItem.extraStyle]"
            >
              <view v-if="contentIndex < 2" :style="[contenItem.extraStyle]">
                <view
                  class="ad-structure-1-2-item"
                  :style="[contenItem.extraStyle]"
                  @click.stop="bannerClickEvent(contenItem)"
                >
                  <view
                    class="ad-structure-1-2-item-img-box"
                    :style="[contenItem.extraStyle]"
                  >
                    <image
                      class="imgs"
                      :src="contenItem.url"
                      :style="[contenItem.extraStyle]"
                      alt=""
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
        <!-- 一行三个 -->
        <view v-else-if="inItem.style == 3" style="width: 100%">
          <view class="ad-structure-1-3">
            <view
              v-for="(contenItem, contentIndex) in inItem.portalAd"
              :key="contentIndex"
              :style="[contenItem.extraStyle]"
            >
              <view v-if="contentIndex < 3" :style="[contenItem.extraStyle]">
                <view
                  class="ad-structure-1-3-item"
                  :style="{
                    backgroundImage: `url(${contenItem.url})`,
                    borderRadius: [contenItem.extraStyle.borderRadius],
                    height: [contenItem.extraStyle.height],
                  }"
                  @click.stop="bannerClickEvent(contenItem)"
                >
                  <view v-if="contenItem.categoryTitle" class="title">
                    {{ contenItem.categoryTitle }}
                  </view>
                  <view v-if="contenItem.categoryDesc" class="desc">
                    {{ contenItem.categoryDesc }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 左一右二 -->
        <view v-else-if="inItem.style == 4">
          <view
            class="ad-structure-4"
            @click.stop="bannerClickEvent(inItem.portalAd[0])"
          >
            <view
              class="ad-structure-4-1-item"
              :style="{ borderRadius: [extraStyle.borderRadius] }"
            >
              <image
                :src="inItem.portalAd[0].url"
                alt=""
                :style="{ borderRadius: [extraStyle.borderRadius] }"
              />
            </view>
            <view
              class="ad-structure-4-2-item"
              :style="{ borderRadius: [extraStyle.borderRadius] }"
            >
              <image
                class="imgs i-1"
                :src="inItem.portalAd[1].url"
                alt=""
                :style="{ borderRadius: [extraStyle.borderRadius] }"
                @click.stop="bannerClickEvent(inItem.portalAd[1])"
              />
              <image
                class="imgs i-2"
                :src="inItem.portalAd[2].url"
                :style="{ borderRadius: [extraStyle.borderRadius] }"
                alt=""
                @click.stop="bannerClickEvent(inItem.portalAd[2])"
              />
            </view>
          </view>
        </view>
        <!-- 轮播图 -->
        <view v-else-if="inItem.style == 5" class="ad-banner-box-5">
          <view
            v-if="inItem.portalAd.length === 1"
            class="ad-banner-box"
            :style="[inItem.portalAd[0].extraStyle]"
            @click="bannerClickEvent(inItem.portalAd[0])"
          >
            <image
              class="ad-banner-image"
              :src="inItem.portalAd[0].url"
              :style="[inItem.portalAd[0].extraStyle]"
            />
          </view>
          <swiper
            v-else
            class="ad-banner"
            circular
            :indicator-dots="true"
            autoplay
            indicator-color="rgba(255,255,255,1)"
            indicator-active-color="#FF6953"
          >
            <swiper-item
              v-for="(item, index) in inItem.portalAd"
              :key="index"
              :style="[item.extraStyle]"
              @click="bannerClickEvent(item)"
            >
              <view class="ad-banner-box" :style="[item.extraStyle]">
                <image
                  class="ad-banner-image"
                  :src="item.url"
                  :style="[item.extraStyle]"
                />
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import adService from "@/api/ad/index.js";
import { navigateToAnyCheck } from "@/utils/navigateToAny.js";
import { copyAttr } from "@/utils/gCopy.js";
export default {
  components: {},
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
      portalAd: [],
      extraStyle: {
        borderRadius: "50rpx",
        height: "",
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
    getAdLIst () {
      const params = {
        pageName: this.pageConfig.pageName,
        code: this.pageConfig.moduleId,
      };
      adService
        .getAdvertisement(params)
        .then(res => {
          if (res.data.code === 200) {
            this.portalAd = res.data.data;
            this.handleAdExtraStyle();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 处理每个Ad的单项的ExtraStyle
    handleAdExtraStyle () {
      this.portalAd.forEach(item => {
        item.portalAd.forEach(e => {
          const extraStyle = JSON.parse(e.extraStyle);
          if (extraStyle.height === "") {
            extraStyle.height = "300";
          }
          e.extraStyle = {
            height: extraStyle.height + "rpx",
            borderRadius: this.extraStyle.borderRadius,
          };
        });
      });
    },
    bannerClickEvent (item) {
      this.$analysis.dispatch("feeds", `${this.activityId}_${item.id}`).finally(() => navigateToAnyCheck(item, `feeds_${item.id}`));
    },
  },
};
</script>
<style lang="scss" scoped>
.ad-structure {
  margin-bottom: 40rpx;
  .more-topic-top-img {
    text-align: center;
    margin-bottom: 40rpx;

    image {
      width: 100%;
    }
  }
  .ad-more-data-box {
    padding: 0 33rpx 0 32rpx;
    box-sizing: border-box;
  }

  &-1-1 {
    padding: 0 32rpx;

    &-item {
      width: 686rpx;
      height: 300rpx;
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
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0rpx;
    }

    &:last-child {
      margin-bottom: 0rpx;
    }

    &:last-child {
      margin-bottom: 0rpx;
    }

    &-item {
      width: 335rpx;

      &-img-box {
        width: 335rpx;
        height: 140rpx;
        border-radius: 20rpx;
        position: relative;

        .imgs {
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
        margin-top: 10rpx;
        width: 100%;

        .title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 28rpx;
          font-weight: 500;
          color: #333333;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .desc {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 24rpx;
          font-weight: 400;
          color: #666666;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }

  &-1-3 {
    display: flex;
    justify-content: space-between;
    width: 100%;
    // margin: 0 23rpx;

    .is-margin {
      margin: 0 23rpx;
    }

    &-item {
      background: #ffffff;
      border: 1px solid #bfbfbf;
      width: 214rpx;
      height: 286rpx;
      border-radius: 20rpx;
      margin-bottom: 22rpx;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;

      .title {
        width: 100%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 28rpx;
        font-weight: 600;
      }

      .desc {
        width: 100%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 24rpx;
        font-weight: 400;
        color: #666666;
        margin-bottom: 15rpx;
      }

      &:last-child {
        margin-bottom: 0rpx;
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

      image {
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

.ad-banner {
  height: 280rpx;
  position: relative;

  .indicator {
    position: absolute;
    z-index: 3;
    bottom: 46rpx;
    right: 46rpx;
    background: rgba($color: #000000, $alpha: 0.4);
    border-radius: 14px;
    padding: 4rpx 14rpx;
    color: #fff;
    font-size: 22rpx;
    line-height: 33rpx;
  }
}

.ad-banner-box-5 {
  width: 100%;
}

.ad-banner-box {
  width: 100%;
  display: flex;
  justify-content: center;
}

.ad-banner-image {
  width: 686rpx;
  height: 280rpx;
  border-radius: 20rpx;
}

// 样式调整
.ad-structure-type + .ad-structure-type {
  margin-top: 15rpx;
}

.ad-structure-type {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}
</style>
