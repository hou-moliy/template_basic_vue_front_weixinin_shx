<template>
  <view>
    <view class="bgcolor clearfix">
      <block>
        <block>
          <view
            class="themeLists"
            :style="{ background: pageConfig.innerColor }"
          >
            <view class="themeLists-title">
              <block v-if="pageConfig.tagIcon">
                <image :src="pageConfig.tagIcon" mode="aspectFit" />
              </block>
            </view>
            <view class="ad-recommend">
              <block v-for="(inItem, inIndex) in portalAds" :key="inIndex">
                <!-- 一行一个 -->
                <block v-if="inItem.style == 1">
                  <block
                    v-for="(contenItem, contentIndex) in inItem.portalAd"
                    :key="contentIndex"
                  >
                    <block v-if="contentIndex < 1">
                      <view
                        class="ad-recommend-1-1"
                        :style="[contenItem.extraStyle]"
                        @click="bannerClickEvent(contenItem)"
                      >
                        <image
                          class="ad-recommend-1-1-item"
                          :src="contenItem.url"
                          :style="[contenItem.extraStyle]"
                        />
                      </view>
                    </block>
                  </block>
                </block>
                <!-- 一行两个 -->
                <block v-else-if="inItem.style == 2">
                  <view class="ad-recommend-1-2 flex flex-wrap">
                    <block
                      v-for="(contenItem, contentIndex) in inItem.portalAd"
                      :key="contentIndex"
                    >
                      <block v-if="contentIndex < 2">
                        <view
                          class="ad-recommend-1-2-item bg-white"
                          :style="[contenItem.extraStyle]"
                          @click="bannerClickEvent(contenItem)"
                        >
                          <view
                            class="ad-recommend-1-2-img-box"
                            :style="[contenItem.extraStyle]"
                          >
                            <image
                              class="ad-recommend-1-2-img"
                              :src="contenItem.url"
                              :style="[contenItem.extraStyle]"
                            />
                          </view>
                        </view>
                      </block>
                    </block>
                  </view>
                </block>
                <!-- 一行三个 -->
                <block v-else-if="inItem.style == 3">
                  <view class="ad-recommend-1-3">
                    <view
                      v-for="(contenItem, contentIndex) in inItem.portalAd"
                      :key="contentIndex"
                      :style="[contenItem.extraStyle]"
                    >
                      <view
                        v-if="contentIndex < 3"
                        :style="[contenItem.extraStyle]"
                      >
                        <view
                          class="ad-recommend-1-3-item"
                          :class="{ 'is-margin': contentIndex % 3 === 1 }"
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
                </block>
                <!-- 左一右二 -->
                <block v-else-if="inItem.style == 4">
                  <view class="ad-recommend-1-4">
                    <view class="ad-recommend-1-4-item bg-white">
                      <block
                        v-for="(contenItem, contentIndex) in inItem.portalAd"
                        :key="contentIndex"
                      >
                        <block v-if="contentIndex == 0">
                          <view
                            class="ad-recommend-1-4-img-box"
                            :style="{ borderRadius: [extraStyle.borderRadius] }"
                            @click="bannerClickEvent(contenItem)"
                          >
                            <image
                              class="ad-recommend-1-4-img"
                              :src="contenItem.url"
                              :style="{
                                borderRadius: [extraStyle.borderRadius],
                              }"
                            />
                          </view>
                        </block>
                      </block>

                      <view class="ad-recommend-1-4-item-right">
                        <block
                          v-for="(contenItem, contentIndex) in inItem.portalAd"
                          :key="contentIndex"
                        >
                          <block v-if="contentIndex == 1">
                            <view
                              class="ad-recommend-1-4-item-right-img"
                              :style="{
                                borderRadius: [extraStyle.borderRadius],
                              }"
                              @click="bannerClickEvent(contenItem)"
                            >
                              <image
                                class="ad-recommend-1-4-img"
                                :style="{
                                  borderRadius: [extraStyle.borderRadius],
                                }"
                                :src="contenItem.url"
                              />
                            </view>
                          </block>
                        </block>
                        <block
                          v-for="(contenItem, contentIndex) in inItem.portalAd"
                          :key="contentIndex"
                        >
                          <block v-if="contentIndex == 2">
                            <view
                              class="ad-recommend-1-4-item-right-img"
                              :style="{
                                borderRadius: [extraStyle.borderRadius],
                              }"
                              @click="bannerClickEvent(contenItem)"
                            >
                              <image
                                class="ad-recommend-1-4-img"
                                :src="contenItem.url"
                                :style="{
                                  borderRadius: [extraStyle.borderRadius],
                                }"
                              />
                            </view>
                          </block>
                        </block>
                      </view>
                    </view>
                  </view>
                </block>
                <!-- 轮播图 -->
                <block v-else-if="inItem.style == 5">
                  <view
                    class="ad-recommend-1-5"
                    :style="[inItem.portalAd[0].extraStyle]"
                  >
                    <view
                      v-if="inItem.portalAd.length === 1"
                      class="ad-recommend-1-5-item"
                      :style="[inItem.portalAd[0].extraStyle]"
                      @click="bannerClickEvent(inItem.portalAd[0])"
                    >
                      <image
                        class="ad-recommend-1-5-image"
                        :style="[inItem.portalAd[0].extraStyle]"
                        :src="inItem.portalAd[0].url"
                      />
                    </view>
                    <swiper
                      v-else
                      class="ad-recommend-1-5-item"
                      circular
                      :indicator-dots="true"
                      autoplay
                      indicator-color="rgba(255,255,255,1)"
                      indicator-active-color="#FF6953"
                    >
                      <swiper-item
                        v-for="(item, index) in inItem.portalAd"
                        :key="index"
                        :style="[inItem.portalAd[0].extraStyle]"
                        @click="bannerClickEvent(item)"
                      >
                        <view
                          class="ad-recommend-1-5-image"
                          :style="[inItem.portalAd[0].extraStyle]"
                        >
                          <image
                            class="ad-recommend-1-5-image"
                            :src="item.url"
                            :style="[inItem.portalAd[0].extraStyle]"
                          />
                        </view>
                      </swiper-item>
                    </swiper>
                  </view>
                </block>
              </block>
            </view>
          </view>
        </block>
      </block>
    </view>
  </view>
</template>

<script>
import adService from "@/api/ad/index.js";
import { copyAttr } from "@/utils/gCopy.js";

import {
  navigateToAnyCheck,
} from "@/utils/navigateToAny.js";
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
      portalAds: [],
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
      adService.getAdvertisement(params).then(res => {
        if (res.data.code === 200) {
          this.portalAds = res.data.data;
          this.handleAdExtraStyle();
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 处理每个Ad的单项的ExtraStyle
    handleAdExtraStyle () {
      this.portalAds.forEach(item => {
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
      this.$analysis.dispatch(`${this.activityId}_feeds_bg`, item.id).finally(() => navigateToAnyCheck(item, `feeds_bg_${item.id}`));
    },
  },
};
</script>

<style lang="scss" scoped>
.bsHl-catagory-box {
  margin: 0 auto;
  margin-top: 118rpx;
  position: relative;
  background: linear-gradient(335deg, #3578e3 35%, #b45df7 100%);
  border-radius: 10rpx;
  width: 686rpx;
  padding: 56rpx 13rpx 20rpx 13rpx;
  box-sizing: border-box;

  .bsHl-catagory-title {
    width: 50%;
    height: 96rpx;
    position: absolute;
    display: flex;
    vertical-align: top;
    top: 0rpx;
    left: 50%;
    transform: translate(-50%, -65%);
  }

  .bsHl-catagory-style {
    margin: 0 auto;

    .bsHl-catagory-style1 {
      .bsHl-catagory-style1-image {
        width: 660rpx;
        height: 190rpx;
        display: inline-block;
        vertical-align: top;
        margin-bottom: 22rpx;
      }
    }

    .bsHl-catagory-style2 {
      width: 660rpx;
      display: flex;
      justify-content: space-between;

      .bsHl-catagory-style2-image {
        width: 320rpx;
        height: 190rpx;
        display: inline-block;
        vertical-align: top;
      }
    }
  }
}

// 更多推荐样式
.more-recommend {
  // background-color: #007AFF;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 60rpx 0 43rpx;
  image {
    width: 281rpx;
    height: 38rpx;
  }
}
.more-recommend-box {
  white-space: nowrap;
  margin: 0 32rpx;
  width: 686rpx;
  height: 358rpx;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 98rpx;
  .more-recommend-info {
    display: inline-block;
    width: 214rpx;
    height: 358rpx;
    margin-right: 20rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}

.clearfix::before {
  content: "";
  display: table;
}

.bgcolor {
  // background-color: white;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;

  .themeLists {
    // background: linear-gradient(335deg, #3578e3 35%, #b45df7 100%);
    background: white;
    margin: 82rpx 32rpx 60rpx;
    width: 686rpx;
    padding-top: 43rpx;
    // height: 498rpx;
    background-color: #fff;
    position: relative;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .themeLists-title {
      height: 95rpx;
      position: absolute;
      top: -50rpx;
      // left: 50%;
      // margin-left: -183rpx;

      // background-color: #4D69FF;
      image {
        height: 100%;
      }
    }
  }
}

.bottom1 {
  width: 100%;
  height: 60rpx;
}

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.ad-recommend {
  padding: 13rpx;
  width: 660rpx;
  .ad-recommend-1-1 {
    width: 100%;
    height: 190rpx;
    margin-top: 15rpx;
    margin-bottom: 15rpx;
    // background-color: #E03997;
    border-radius: 10rpx;

    .ad-recommend-1-1-item {
      width: 100%;
      height: 100%;
      border-radius: 20rpx;
    }
  }

  .ad-recommend-1-2 {
    display: flex;
    justify-content: space-between;

    .ad-recommend-1-2-item {
      width: 49%;
      height: 190rpx;
      margin-top: 5rpx;

      // background-color: #FF6F50;
      .ad-recommend-1-2-img-box {
        width: 100%;
        height: 190rpx;
        // background-color: #ffff00;
        border-radius: 10rpx;

        .ad-recommend-1-2-img {
          // border-top-left-radius: 11px;
          // border-top-right-radius: 11px;
          width: 100%;
          height: 100%;
          border-radius: 20rpx;
        }
      }
    }
  }

  .ad-recommend-1-3 {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 15rpx;
    // margin: 0 23rpx;

    .is-margin {
      margin: 0 13rpx;
    }

    .ad-recommend-1-3-item {
      background: #ffffff;
      border: 1px solid #bfbfbf;
      width: 207rpx;
      height: 286rpx;
      border-radius: 20rpx;
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

      .ad-recommend-1-3:last-child {
        margin-bottom: 0rpx;
      }
    }
  }

  .ad-recommend-1-4 {
    height: 398rpx;
    overflow: hidden;
    margin-top: 15rpx;

    .ad-recommend-1-4-item {
      width: 100%;
      height: 398rpx;
      display: flex;
      justify-content: space-between;

      .ad-recommend-1-4-img-box {
        width: 320rpx;
        height: 398rpx;
        border-radius: 10rpx;
      }

      .ad-recommend-1-4-img {
        width: 100%;
        height: 100%;
        border-radius: 20rpx;
      }

      .ad-recommend-1-4-item-right {
        width: 320rpx;
        height: 398rpx;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        border-radius: 10rpx;

        .ad-recommend-1-4-item-right-img {
          width: 320rpx;
          height: 190rpx;
          border-radius: 10rpx;
        }
      }
    }
  }
  .ad-recommend-1-5 {
    width: 100%;
    height: 190rpx;
    margin-top: 15rpx;
    &-item {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
    }
    &-image {
      width: 100%;
      height: 100%;
      border-radius: 20rpx;
    }
  }
}

.bottom1 {
  height: 15rpx;
  width: 100%;
}
</style>
