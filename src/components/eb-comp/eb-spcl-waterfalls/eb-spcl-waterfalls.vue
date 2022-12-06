<template>
  <view
    class="more-news"
    :style="[extraStyle]"
    :class="{ 'no-margin': !compBottom }"
  >
    <!-- 标题 -->
    <view v-if="pageConfig.tagIcon" class="title-wrap">
      <image :src="pageConfig.tagIcon" class="tag-icon" />
      <text v-if="pageConfig.title" class="title">
        {{ pageConfig.title }}
      </text>
    </view>
    <!-- 加载中 -->
    <uni-load-more
      v-if="loading"
      class="loadingicon"
      icon-size="20"
      icon-type="circle"
      status="loading"
    />
    <waterfall
      v-if="wfList.length"
      :column-count="3"
      column-width="auto"
      class="waterfall-box"
    >
      <!-- 左侧 -->
      <view class="waterfall-column waterfall-column-left">
        <view v-for="(item, index) in wfList" :key="index">
          <view v-if="index % 2 === 0" class="more-new-item-column">
            <!-- 运营位 -->
            <view v-if="item.imgType === 2" class="recommend-wrap">
              <operate-item
                :item="item"
                @click.native="programaAnalysis(params, item.imgId)"
                @openLoginPopup="openLoginPopup"
              />
            </view>
            <!-- 元素 -->
            <view v-else class="video-box-new">
              <spclItem
                :item="item"
                :last-flag="index == wfList.length - 1"
                :inner-color="pageConfig.innerColor"
                :spcl-style="pageConfig.spclStyle"
                @click.native="programaAnalysis(params, item.imgId)"
                @shareVideo="shareCountChange"
                @giveLikes="likeCountChange"
                @purchaseVideo="purchaseVideo"
                @openLoginPopup="openLoginPopup"
                @goToPlayVideo="goToPlayVideo"
              />
            </view>
          </view>
        </view>
      </view>
      <!-- 右侧 -->
      <view class="waterfall-column">
        <view v-for="(item, index) in wfList" :key="index">
          <view v-if="index % 2 !== 0" class="more-new-item-column">
            <!-- 运营位 -->
            <view v-if="item.imgType === 2">
              <operate-item
                :item="item"
                @click.native="programaAnalysis(params, item.imgId)"
                @openLoginPopup="openLoginPopup"
              />
            </view>
            <!-- 元素 -->
            <view v-else class="video-box-new">
              <spclItem
                :item="item"
                :inner-color="pageConfig.innerColor"
                :last-flag="index == wfList.length - 1"
                :spcl-style="pageConfig.spclStyle"
                @click.native="programaAnalysis(params, item.imgId)"
                @shareVideo="shareCountChange"
                @giveLikes="likeCountChange"
                @purchaseVideo="purchaseVideo"
                @openLoginPopup="openLoginPopup"
                @goToPlayVideo="goToPlayVideo"
              />
            </view>
          </view>
        </view>
      </view>
    </waterfall>
    <!-- 加载更多 -->
    <uni-load-more
      v-if="compBottom && wfList.length"
      class="loadingicon"
      icon-size="20"
      icon-type="circle"
      :status="isLoadStatus"
    />
    <!-- 订购弹窗 -->
  </view>
</template>

<script>
import operateItem from "./operateItem.vue";
import spclItem from "./spclItem.vue";
import SpclService from "@/api/spcl/index.js";
import { copyAttr } from "@/utils/gCopy.js";
import { videoInfoUpdate } from "@/utils/video";
import {
  programaAnalysis,
} from "@/utils/common.js";
export default {
  components: {
    spclItem,
    operateItem,
  },
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
    activityId: {
      type: String,
      default: "",
    },
    compBottom: { // 是否是页面最后一个
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      wfList: [],
      wfParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0, // 瀑布流总数据
      isLoadStatus: "loading",
      extraStyle: { // 默认样式
        backgroundColor: "transparent",
      },
      loading: true,
    };
  },
  created () {
    this.extraStyle = copyAttr(this.extraStyle, JSON.parse(this.pageConfig.extraStyle));
    if (!this.compBottom) { this.wfParams.pageSize = 10; }; // 非配置化页面的最后一个就固定展示10条数据
    this.getWfList();
    uni.$on("purchaseVideo", data => {
      console.log(data, "设置视频彩铃");
    });
  },
  methods: {
    programaAnalysis,
    // 强制刷新
    handleFresh () {
      console.log("刷新啦，eb-spcl-waterfalls");
      const olaNum = this.wfParams.pageNum;
      this.wfParams.pageSize = olaNum * this.wfParams.pageSize;
      this.wfParams.pageNum = 1;
      this.getWfList().then(() => {
        this.wfParams.pageSize = 10;
        this.wfParams.pageNum = olaNum;
      });
    },
    // 滚动触底
    onScrollBottom () {
      if (!this.compBottom) return; // 非配置化页面的最后一个就没有上拉加载更多功能
      const curCount = this.wfList.length;
      if (curCount >= this.total) {
        // 没有数据了
        console.log("没数据了");
        return;
      }
      this.isLoadStatus = "loading";
      this.wfParams.pageNum++;
      this.getWfList(false);
    },
    // 获取视频列表
    getWfList (flag = true) { // flag，true表示刷新或首次加载,false表示加载更多
      const wfParams = this.wfParams;
      wfParams.ac = this.activityId;
      wfParams.level = this.pageConfig.sort;
      return new Promise((resolve, reject) => {
        SpclService.getVideoByActivityIdPage(wfParams).then(({
          data: res,
        }) => {
          if (res.code === 200) {
            let { list, total } = res.data;
            if (!total && !list.length) { this.loading = false; return; };
            this.total = total;
            uni.setStorageSync("vedioListTalNum", this.total);
            const oldLen = this.wfList.length;
            list = videoInfoUpdate(list);
            if (flag) {
              this.wfList = [...list];
            } else {
              this.wfList.splice(oldLen, 0, ...list);
            }
            this.isLoadStatus =
              this.wfList.length >= total ? "nomore" : "more";
            this.loading = false;
            resolve();
          } else {
            this.loading = false;
            reject(res);
          }
        });
      });
    },
    openLoginPopup () {
      this.$emit("openLoginPopup");
    },
    // 分享
    shareCountChange (e) {
      const temObj = {
        ...e,
      };
      temObj.shareCount = parseFloat(temObj.shareCount) + 1;
      this.wfList.forEach(item => {
        if (item.imgId === temObj.imgId) {
          item.shareCount = temObj.shareCount;
        }
      });
      uni.navigateTo({
        url: `/pagesCommon/share/shareVideo?videoId=${e.ringId}&shareType=1`,
      });
    },
    // 点赞或取消点赞
    likeCountChange ({ ringItem, flag }) { // false 新增点赞 ，true 取消点赞
      const { ringId } = ringItem;
      const index = this.wfList.findIndex(i => i.ringId === ringId);
      const item = this.wfList[index];
      const data = {
        ringId,
        target: "dz",
        opType: flag ? 0 : 1,
      };
      this.$store.dispatch("spcl/handleSpclUserOperate", data).then(res => {
        if (res.code === 200) {
          if (flag) {
            item.extraInfo.likeCount -= 1;
          } else {
            item.extraInfo.likeCount += 1;
          }
          item.extraInfo.like = !flag;
          // 更新我的喜欢数据
          this.$store.commit("spcl/UPDATE_MY_LIKE_IDS", ringItem);
          this.$set(this.wfList, index, item);
        } else {
          this.$toast(res.message);
        }
      });
    },
    // 设置视频彩铃
    purchaseVideo (e) {
      this.$emit("purchaseVideo", e);
    },
    // 跳转视频彩铃播放页面
    goToPlayVideo (item, topic) {
      uni.setStorageSync("activityId", this.activityId);
      uni.setStorageSync("level", this.pageConfig.sort);
      this.$emit("goToPlayVideo", { item, list: this.wfList, pageConfigTitle: topic });
    },
  },
};
</script>

<style lang="scss" scoped>
.more-news {
  width: 100%;
  padding: 0rpx 30rpx 30rpx;
  box-sizing: border-box;
  border-radius: 40rpx 40rpx 0rpx 0rpx;

  .waterfall-box {
    display: flex;

    .waterfall-column-left {
      margin-right: 18rpx;
    }

    .waterfall-column {
      // 竖屏
      .more-new-item-column {
        width: 334rpx;
        -webkit-column-break-inside: avoid;
      }

      .more-new-item-column + .more-new-item-column {
        margin-top: 21rpx;
      }
    }
  }
  .title-wrap {
    display: flex;
    align-items: center;
    padding: 43rpx 0rpx 49rpx;
    .tag-icon {
      width: 38rpx;
      height: 36rpx;
      margin-right: 13rpx;
    }
    .title {
      font-size: 36rpx;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-align: left;
      color: #000000;
    }
  }
}
.no-margin {
  margin-bottom: 40rpx;
}
</style>
