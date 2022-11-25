<template>
  <view
    v-if="!dataList.length == 0"
    class="spcl-recommend"
  >
    <view
      v-if="pageConfig.tagIcon"
      class="more-topic-top-img"
    >
      <image :src="pageConfig.tagIcon" />
    </view>
    <waterfall
      :column-count="3"
      column-width="auto"
      class="waterfall-box"
    >
      <view
        v-if="dataList != ''"
        class="waterfall-column waterfall-column-left"
      >
        <view
          v-for="(item, index) in dataList"
          :key="index"
        >
          <template v-if="index % 2 === 0">
            <!-- 元素 -->
            <view class="video-box-new more-new-item-column">
              <view
                :data-url="'/pages/cxVideo/cxVideoPlay?id=' + item.ringId"
                :data-topic="'moreVideo'"
                @click="$emit('goToPlayVideo', $event, dataList)"
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
            </view>
          </template>
        </view>
      </view>
      <view class="waterfall-column">
        <view
          v-for="(item, index) in dataList"
          :key="index"
        >
          <template v-if="index % 2 !== 0">
            <view class="video-box-new more-new-item-column">
              <view
                :data-url="'/pages/cxVideo/cxVideoPlay?id=' + item.ringId"
                :data-topic="'moreVideo'"
                @click="$emit('goToPlayVideo', $event, dataList)"
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
            </view>
          </template>
        </view>
      </view>
    </waterfall>
    <view class="see-more-box">
      <view
        class="see-more"
        @click="navigateToH5(pageConfig)"
      >
        查看更多
      </view>
    </view>
  </view>
</template>

<script>
import SpclService from "@/api/spcl/index.js";
import { navigateToAny } from "@/utils/tools.js";
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
  watch: {},
  created () { },
  mounted () {
    console.log("+++", this.pageConfig);
    this.getSpclList();
  },
  methods: {
    getSpclList () {
      const params = {
        ac: this.activityId,
        level: this.pageConfig.sort,
      };
      SpclService.getVideoByActivityId(params).then((res) => {
        if (res.data.code === 200) {
          let tempList = res.data.data;
          if (tempList.length > 4) {
            tempList = tempList.slice(0, 4);
          }
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
    async navigateToH5 (event) {
      this.$emit("watchMore", event.moduleId);
      await this.$store.dispatch(
        "getCustomorderList",
        `runAd_${event.moduleId}`,
      );
      console.log(
        this.$store.state.offlinePopup,
        "this.$store.state.offlinePopup",
      );
      if (this.$store.state.offlinePopup.loginShow) {
        this.$emit("openLoginPopup");
        return;
      }
      if (this.$store.state.offlinePopup.offlineFlag) {
        return;
      }
      this.$analysis.dispatch("dj_ckgd", event.id);
      navigateToAny(event);
    },
  },
};
</script>

<style lang="scss" scoped>
.spcl-recommend {
  margin-bottom: 30rpx;
  padding-top: 40rpx;
  .more-topic-top-img {
    display: flex;
    text-align: center;
    margin-bottom: 40rpx;
    justify-content: center;
    height: 60rpx;

    image {
      width: 100%;
      height: 48rpx;
    }
  }

  .waterfall-box {
    display: flex;
    padding: 0 33rpx 0 32rpx;

    .waterfall-column-left {
      margin-right: 18rpx;
    }

    .waterfall-column {
      // 竖屏
      .more-new-item-column {
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

  .see-more-box {
    justify-content: center;
    display: flex;

    .see-more {
      width: 352rpx;
      height: 64rpx;
      border: 2rpx solid #ffffff;
      border-radius: 32rpx;
      font-size: 30rpx;
      font-weight: 500;
      color: #fefefe;
      line-height: 64rpx;
      text-align: center;
    }
  }
}
</style>
