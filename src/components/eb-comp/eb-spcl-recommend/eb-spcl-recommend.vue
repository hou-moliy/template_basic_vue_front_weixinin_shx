<template>
  <view v-if="!dataList.length == 0" class="spcl-recommend">
    <view v-if="pageConfig.tagIcon" class="more-topic-top-img">
      <image :src="pageConfig.tagIcon" />
    </view>
    <waterfall :column-count="3" column-width="auto" class="waterfall-box">
      <view
        v-if="dataList != ''"
        class="waterfall-column waterfall-column-left"
      >
        <view v-for="(item, index) in dataList" :key="index">
          <template v-if="index % 2 === 0">
            <!-- 元素 -->
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
            </view>
          </template>
        </view>
      </view>
      <view class="waterfall-column">
        <view v-for="(item, index) in dataList" :key="index">
          <template v-if="index % 2 !== 0">
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
            </view>
          </template>
        </view>
      </view>
    </waterfall>
    <view class="see-more-box">
      <view
        class="see-more"
        :style="{ background: pageConfig.innerColor }"
        @click="navigateToH5(pageConfig)"
      >
        查看更多
      </view>
    </view>
  </view>
</template>

<script>
import SpclService from "@/api/spcl/index.js";
import { navigateToAnyCheck } from "@/utils/navigateToAny.js";
import { videoInfoUpdate } from "@/utils/video";
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
  mounted () {
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
          this.dataList = videoInfoUpdate(tempList);
        }
      });
    },
    async navigateToH5 (event) {
      this.$emit("watchMore", event.moduleId);
      this.$analysis.dispatch("dj_ckgd", event.id);
      navigateToAnyCheck(event, `runAd_${event.moduleId}`);
    },
    goToPlayVideo (item) {
      this.$emit("goToPlayVideo", { item, list: this.dataList });
    },
  },
};
</script>

<style lang="scss" scoped>
.spcl-recommend {
  margin-bottom: 40rpx;
  .more-topic-top-img {
    display: flex;
    text-align: center;
    margin-bottom: 40rpx;
    justify-content: center;
    height: 90rpx;
    image {
      width: 60%;
      height: 100%;
      vertical-align: middle;
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
      border-radius: 32rpx;
      font-size: 30rpx;
      font-weight: 500;
      color: #ffffff;
      line-height: 64rpx;
      text-align: center;
    }
  }
}
</style>
