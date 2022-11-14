<template>
  <!-- 直播瀑布流 -->
  <view class="more-news">
    <waterfall
      :column-count="3"
      column-width="auto"
      class="waterfall-box "
    >
      <!-- 左侧 -->
      <view class="waterfall-column waterfall-column-left">
        <block
          v-for="(item, index) in wfList"
          :key="index"
        >
          <view
            v-if="index % 2 === 0"
            class="more-new-item-column"
          >
            <!-- 运营位 -->
            <view
              v-if="item.labelType === 1"
              class="recommend-wrap"
            />
            <!-- 元素 -->
            <view
              v-else
              class="video-box-new"
            >
              <livfall-item
                :item="item"
                @openLoginPopup="openLoginPopup"
                @click.native="programaAnalysis(params,item.liveId)"
              />
            </view>
          </view>
        </block>
      </view>
      <!-- 右侧 -->
      <view class="waterfall-column">
        <block
          v-for="(item, index) in wfList"
          :key="index"
        >
          <view
            v-if="index % 2 !== 0"
            class="more-new-item-column"
          >
            <!-- 运营位 -->
            <view v-if="item.labelType === 1" />
            <!-- 元素 -->
            <view
              v-else
              class="video-box-new"
            >
              <livfall-item
                :item="item"
                @openLoginPopup="openLoginPopup"
                @click.native="programaAnalysis(params,item.liveId)"
              />
            </view>
          </view>
        </block>
      </view>
    </waterfall>
    <uni-load-more
      v-if="!showMoreFlag"
      class="loadingicon"
      icon-size="20"
      icon-type="circle"
      :status="isLoadStatus"
    />
  </view>
</template>

<script>
import liveService from "@/api/live/live.js";
import livfallItem from "./livefallItem.vue";
import {
  programaAnalysis,
} from "@/utils/common.js";
export default {
  components: {
    livfallItem,
  },
  props: {
    pageConfig: {
      type: Object,
      required: true,
    },
    showMoreFlag: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      wfList: [],
      wfParams: {
        pageNum: 1,
        pageSize: 5,
      },
      total: 0, // 瀑布流总数据
      isLoadStatus: "more",
    };
  },
  watch: {
    params: {
      handler (n, o) {
      },
      deep: true,
      immediate: true,
    },
    showMoreFlag: {
      handler (n, o) {
      },
      deep: true,
      immediate: true,
    },
  },
  created () {
    this.getWfList();
  },
  methods: {
    programaAnalysis,
    // 滚动触底
    onScollBottom () {
      const curCount = this.wfList.length;
      if (curCount >= this.total) { // 没有数据了
        this.isLoadStatus = "nomore";
        return;
      }
      this.isLoadStatus = "loading";
      this.wfParams.pageNum++;
      this.getWfList(false);
    },
    openLoginPopup () {
      this.$emit("openLoginPopup");
    },
    async getWfList (flag = true) { // flag，true表示刷新或首次加载,false表示加载更多
      const {
        moduleId,
      } = this.pageConfig;
      const wfParams = {
        ...this.wfParams,
        moduleId,
      };
      await liveService.getLiveList(wfParams).then(({
        data: res,
      }) => {
        if (res.code === 200) {
          const {
            list,
            total,
          } = res.data;
          if (!list.length) return;
          this.total = total;
          const len = list.length;
          if (flag) {
            this.wfList.splice(0, len, ...list);
          } else {
            const oldLen = this.wfList.length;
            this.wfList.splice(oldLen, 0, ...list);
          }
          this.isLoadStatus = this.wfList.length >= total ? "nomore" : "more";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.more-news {
  width: 100%;
  padding: 0rpx 30rpx;
  box-sizing: border-box;
  // background: #f7f8fb !important;

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
        background: #ffffff;
        border-radius: 20rpx;
        margin-bottom: 18rpx;
      }
    }
  }
}
</style>
