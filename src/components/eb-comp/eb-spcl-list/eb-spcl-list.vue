<template>
  <view v-if="!dataList.length == 0" class="spcl-box">
    <view v-if="pageConfig.tagIcon" class="more-topic-top-img">
      <image :src="pageConfig.tagIcon" />
    </view>
    <waterfall :column-count="3" column-width="auto" class="waterfall-box">
      <view class="waterfall-column waterfall-column-left">
        <view v-for="(item, index) in dataList" :key="index">
          <!-- 元素 -->
          <view v-if="index % 2 === 0" class="video-box-newList">
            <view class="video-box-new more-new-item-column">
              <view
                :data-url="'/pages/cxVideo/cxVideoPlay?id=' + item.ringId"
                :data-topic="'moreVideo'"
                @click="goToPlayVideo(item)"
              >
                <view class="img-box-more">
                  <image
                    class="new-img"
                    :src="
                      item.coverUrl
                        ? item.coverUrl
                        : item.openVCoverUrl
                        ? item.openVCoverUrl
                        : item.openHCoverUrl
                    "
                    mode="aspectFill"
                  />
                  <view class="morel-new-title">
                    <view class="morel-new-titleText">
                      {{ item.ringName }}
                    </view>
                  </view>
                </view>
              </view>
              <view class="icon-box">
                <view v-if="item.isBuyVideo" class="setting-btn-isBuy">
                  已设置
                </view>
                <view
                  v-else
                  class="setting-btn"
                  :style="{ background: `${pageConfig.innerColor}` }"
                  @click="$emit('purchaseVideo', item)"
                >
                  {{ pageConfig.title }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="waterfall-column">
        <view v-for="(item, index) in dataList" :key="index">
          <view v-if="index % 2 !== 0" class="video-box-newList">
            <view class="video-box-new more-new-item-column">
              <view
                :data-url="'/pages/cxVideo/cxVideoPlay?id=' + item.ringId"
                :data-topic="'moreVideo'"
                @click="goToPlayVideo(item)"
              >
                <view class="img-box-more">
                  <image
                    class="new-img"
                    :src="
                      item.coverUrl || item.openVCoverUrl || item.openHCoverUrl
                    "
                    mode="aspectFill"
                  />
                  <view class="morel-new-title">
                    <view class="morel-new-titleText">
                      {{ item.ringName }}
                    </view>
                  </view>
                </view>
              </view>

              <view class="icon-box">
                <view v-if="item.isBuyVideo" class="setting-btn-isBuy">
                  已设置
                </view>
                <view
                  v-else
                  class="setting-btn"
                  :style="{ background: `${pageConfig.innerColor}` }"
                  @click="$emit('purchaseVideo', item)"
                >
                  {{ pageConfig.title }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </waterfall>
  </view>
</template>

<script>
import SpclService from "@/api/spcl/index.js";
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
  watch: {

  },
  created () {
    this.getSpclList();
  },
  mounted () {
  },
  methods: {
    handleFresh () {
      console.log("刷新拉~~~~~~");
      this.getSpclList();
    },
    getSpclList () {
      const params = {
        ac: this.activityId,
        level: this.pageConfig.sort,
      };
      SpclService.getVideoByActivityId(params).then(res => {
        if (res.data.code === 200) {
          const tempList = res.data.data;
          if (
            uni.getStorageSync("Authorization") &&
            uni.getStorageSync("userData")[0] &&
            uni.getStorageSync("userData")[0].vrbtResponse
          ) {
            const isBuyList = uni.getStorageSync("userData")[0].vrbtResponse;
            for (let i = 0; i < tempList.length; i++) {
              const isBuy = isBuyList.filter(
                (item) => tempList[i].ringId === item.ringId,
              );
              if (isBuy[0]) {
                tempList[i].isBuyVideo = true;
              }
            }
          }
          this.dataList = tempList;
        }
      });
    },
    goToPlayVideo (item) {
      this.$emit("goToPlayVideo", { item, list: this.dataList });
    },
  },
};
</script>

<style lang="scss" scoped>
.video-box-newList {
  padding-top: 20rpx;
}
.spcl-box {
  padding-top: 40rpx;

  .waterfall-box {
    display: flex;
    padding: 0 33rpx 0 32rpx;

    .waterfall-column-left {
      margin-right: 18rpx;
    }

    .waterfall-column {
      // 竖屏
      .more-new-item-column {
        // margin-bottom: 20rpx;
        width: 334rpx;
        -webkit-column-break-inside: avoid;
        border-radius: 20rpx;
        margin-bottom: 40rpx;

        .img-box-more {
          position: relative;

          .new-img {
            width: 334rpx;
            height: 593rpx;
            border-radius: 20rpx;
          }
        }

        .icon-box {
          // width: 334rpx;
          display: flex;
          align-items: center;
          // justify-content: center;
          // padding: 20rpx 12rpx 15rpx 12rpx;

          .icon-box-in {
            display: flex;
            align-items: center;
            // justify-content: space-between;
            width: 200rpx;

            .icon-item {
              display: flex;
              align-items: center;
              font-size: 22rpx;
              font-family: PingFang SC Medium, PingFang SC Medium-Medium;
              font-weight: 500;
              text-align: left;
              color: #333333;
              line-height: 30rpx;
              text-shadow: 0px 2rpx 4rpx 0px rgba(0, 0, 0, 0.1);
              width: 80rpx;

              .icon {
                flex-shrink: 0;
                width: 30rpx;
                height: 30rpx;
                margin-right: 3rpx;
              }
            }

            .share-item {
              margin-right: 15rpx;
            }
          }

          .setting-btn {
            width: 334rpx;
            height: 66rpx;
            // background: linear-gradient(90deg, #FF6F50, #FF008C);
            border-radius: 33rpx;
            color: #ffffff;
            line-height: 66rpx;
            text-align: center;
            font-size: 30rpx;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #ffffff;
            margin-top: 25rpx;
          }

          .setting-btn-isBuy {
            background: #c6c5c8;
            width: 334rpx;
            height: 66rpx;
            border-radius: 33rpx;
            color: #ffffff;
            line-height: 66rpx;
            text-align: center;
            font-size: 30rpx;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #ffffff;
            margin-top: 25rpx;
          }
        }

        .morel-new-title {
          width: 100%;
          height: 84rpx;
          font-size: 28rpx;
          font-family: PingFang SC Bold, PingFang SC Bold-Bold;
          font-weight: 700;
          text-align: left;
          color: #ffffff;
          background: linear-gradient(180deg, #ffffff00, #000000);
          opacity: 0.85;
          line-height: 36rpx;

          border-radius: 20rpx;
          // padding: 15rpx 12rpx 20rpx 21rpx;
          position: absolute;
          bottom: 9rpx;
          .morel-new-titleText {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 274rpx;
            position: absolute;
            bottom: 20rpx;
            left: 21rpx;
          }
        }
      }
    }
  }
}
.more-topic-top-img {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;

  image {
    height: 48rpx;
    width: 50%;
  }
}
</style>
