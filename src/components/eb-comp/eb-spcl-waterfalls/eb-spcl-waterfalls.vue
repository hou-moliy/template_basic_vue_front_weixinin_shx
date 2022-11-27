<template>
  <view class="more-news" :style="[extraStyle]">
    <!-- 标题 -->
    <view v-if="pageConfig.tagIcon" class="title-wrap">
      <image :src="pageConfig.tagIcon" class="tag-icon" />
      <text v-if="pageConfig.title" class="title">
        {{ pageConfig.title }}
      </text>
    </view>
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
                :is-login="isLogin"
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
                :is-login="isLogin"
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
    isLogin: {
      type: Boolean,
      default () {
        return false;
      },
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
        pageSize: 2,
      },
      total: 0, // 瀑布流总数据
      isLoadStatus: "more",
      extraStyle: { // 默认样式
        backgroundColor: "transparent",
      },
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
      this.getWfList();
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
      this.wfParams.pageNum++;
      this.getWfList(false);
    },
    // 获取视频列表
    getWfList (flag = true) { // flag，true表示刷新或首次加载,false表示加载更多
      const wfParams = this.wfParams;
      wfParams.ac = this.activityId;
      wfParams.level = this.pageConfig.sort;
      SpclService.getVideoByActivityIdPage(wfParams).then(({
        data: res,
      }) => {
        if (res.code === 200) {
          const { list, total } = res.data;
          if (!total && !list.length) return;
          this.total = total;
          const len = list.length;
          if (flag) {
            this.wfList.splice(0, len, ...list);
          } else {
            const oldLen = this.wfList.length;
            this.wfList.splice(oldLen, 0, ...list);
          }
          this.isLoadStatus =
            this.wfList.length >= total ? "nomore" : "more";
        }
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
    likeCountChange ({ ringId, flag }) { // false 新增点赞 ，true 取消点赞
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
    goToPlayVideo ({ ringId }) {
      this.$store.commit("spcl/M_changeVideoList", this.wfList);
      uni.navigateTo({
        url: `/pagesSpcl/clVideo/clVdieoPlay?id=${ringId}`,
      });
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
</style>
