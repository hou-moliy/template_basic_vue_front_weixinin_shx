<template>
  <view
    class="more-news"
    :style="{ marginTop }"
  >
    <waterfall
      :column-count="3"
      column-width="auto"
      class="waterfall-box"
    >
      <!-- 左侧 -->
      <view class="waterfall-column waterfall-column-left">
        <block
          v-for="(item, index) in miguVideoList"
          :key="index"
        >
          <view
            v-if="index % 2 === 0"
            class="more-new-item-column"
          >
            <!-- 运营位 -->
            <view
              v-if="item.sourceType == 2"
              class="recommend-wrap"
            >
              <operate-item
                :item="item"
                @openLoginPopup="openLoginPopup"
                @click.native="programaAnalysis(params, item.videoId)"
              />
            </view>
            <!-- 元素 -->
            <view
              v-else
              class="video-box-new"
            >
              <video-item
                :item="item"
                :video-list="miguVideoList"
                :is-login="isLogin"
                @shareVideo="shareVideo"
                @giveLikes="giveLikes"
                @openLoginPopup="openLoginPopup"
                @click.native="programaAnalysis(params, item.videoId)"
              />
            </view>
          </view>
        </block>
      </view>
      <!-- 右侧 -->
      <view class="waterfall-column">
        <block
          v-for="(item, index) in miguVideoList"
          :key="index"
        >
          <view
            v-if="index % 2 !== 0"
            class="more-new-item-column"
          >
            <!-- 运营位 -->
            <view v-if="item.sourceType == 2">
              <operate-item
                :item="item"
                @openLoginPopup="openLoginPopup"
                @click.native="programaAnalysis(params, item.videoId)"
              />
            </view>
            <!-- 元素 -->
            <view
              v-else
              class="video-box-new"
            >
              <video-item
                :item="item"
                :video-list="miguVideoList"
                :is-login="isLogin"
                @shareVideo="shareVideo"
                @giveLikes="giveLikes"
                @openLoginPopup="openLoginPopup"
                @click.native="programaAnalysis(params, item.videoId)"
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
import operateItem from "./operateItem.vue";
import videoItem from "./videoItem.vue";
import { programaAnalysis } from "@/utils/common.js";
import miguService from "@/api/migu/migu.js";
export default {
  name: "FindMiguVideoFalls",
  components: {
    videoItem,
    operateItem,
  },
  props: {
    params: {
      required: true,
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    marginTop: {
      type: String,
      default: "0rpx",
    },
    showMoreFlag: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      wfParams: {
        moduleId: 1,
        pageNum: 1,
        pageSize: 5,
      }, // 获取数据的参数
      total: "",
      miguVideoList: [],
    };
  },

  computed: {
    // miguVideoList() {
    //   return this.$store.state.miguVideo.miguVideoList;
    // },
    // isLoadStatus() {
    //   return this.$store.state.miguVideo.isLoadStatus;
    // },
    // total() {
    //   return this.$store.state.miguVideo.total;
    // },
  },
  watch: {
    params: {
      handler (n, o) { },
      deep: true,
      immediate: true,
    },
    showMoreFlag: {
      handler (n, o) { },
      deep: true,
      immediate: true,
    },
  },

  beforeDestroy () {
    this.$store.commit("miguVideo/SET_MIGU_VIDEO_LIST", []);
    this.$store.commit("miguVideo/SET_TOTAL", 0);
    this.$store.commit("miguVideo/SET_LOAD_STATUS", "more");
  },
  created () {
    this.getWfList();
  },
  mounted () { },
  beforeDestroy () {
    this.$store.commit("miguVideo/SET_MIGU_VIDEO_LIST", []);
  },
  methods: {
    programaAnalysis,
    // 强制刷新
    handleFresh () {
      this.$forceUpdate();
    },
    // 滚动触底
    onScollBottom () {
      const curCount = this.miguVideoList.length;
      if (curCount >= this.total) {
        // 没有数据了
        console.log("没数据了");
        return;
      }
      this.wfParams.pageNum++;
      this.getWfList(false);
    },
    // 打开登录弹窗
    openLoginPopup () {
      this.$emit("openLoginPopup");
    },
    // 获取咪咕视频列表
    async getWfList (flag = true) {
      // flag，true表示刷新或首次加载,false表示加载更多
      const { pageName, moduleId } = this.params;
      const wfParams = {
        ...this.wfParams,
        pageName,
        moduleId,
        flag,
      };
      miguService.getlistById(wfParams).then(({ data: res }) => {
        console.log("24-test", res);
        if (res.code === 200) {
          const { list, total } = res.data;
          if (!total && !list.length) return;
          this.total = total;
          const len = list.length;
          if (flag) {
            this.miguVideoList.splice(0, len, ...list);
          } else {
            const oldLen = this.miguVideoList.length;
            this.miguVideoList.splice(oldLen, 0, ...list);
          }
          this.isLoadStatus =
            this.miguVideoList.length >= total ? "nomore" : "more";
          console.log(
            "this.miguVideoList",
            this.miguVideoList,
            "isLoadStatus",
            this.isLoadStatus,
          );
        }
      });
    },
    // 分享
    shareVideo ({ videoId, target, item }) {
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
        return;
      }
      // this.$store.dispatch('getCustomorderList','a')
      // if(Boolean(this.$store.state.offlinePopup.offlineFlag)){
      // 	return
      // }
      this.handlecountVideoOperation(
        {
          videoId,
          target,
        },
        item,
      );
    },
    // 点赞
    giveLikes ({ videoId, target, optype, item }) {
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
        return;
      }
      // this.$store.dispatch('getCustomorderList','a')
      // if(Boolean(this.$store.state.offlinePopup.offlineFlag)){
      // 	return
      // }
      this.handlecountVideoOperation(
        {
          videoId,
          target,
          optype,
        },
        item,
      );
    },
    // 处理接口
    handlecountVideoOperation (params, item) {
      this.videoOperation({
        params,
        item,
      });
      this.$forceUpdate();
    },
    // 点赞触发方法
    videoOperation (payload) {
      const { params, item } = payload;
      return miguService.countVideoOperation(params).then(({ data: res }) => {
        if (res.code === 200) {
          // 找到当前item
          console.log("this.miguVideoList123", this.miguVideoList);
          const currentIndex = this.miguVideoList.findIndex(
            itemVal => itemVal.videoId === item.videoId,
          );
          const { target, optype } = params;
          if (target === "fx") {
            item.moreInfo.shareCount++;
            this.miguVideoList[currentIndex] = item;
            this.$forceUpdate();
          } else {
            if (optype) {
              uni.showToast({ title: "点赞成功", icon: "none" });
              item.moreInfo.like = true;
              item.moreInfo.likeCount++;
              this.miguVideoList[currentIndex] = item;
              this.$forceUpdate();
            } else {
              uni.showToast({ title: "取消点赞成功", icon: "none" });
              item.moreInfo.like = false;
              item.moreInfo.likeCount--;
              if (!item.moreInfo.likeCount) {
                item.moreInfo.likeCount = 0;
              }
              this.miguVideoList[currentIndex] = item;
              this.$forceUpdate();
            }
          }
        } else {
          uni.showToast({ title: res.message, icon: "none" });
        }
      });
    },
    // 处理接口
    // handlecountVideoOperation(params, item) {
    //   this.$store
    //     .dispatch("miguVideo/videoOperation", {
    //       params,
    //       item,
    //     })
    //     .then(() => {
    //       this.$forceUpdate();
    //     });
    // },
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
        // background: #ffffff;
        // border-radius: 10px;
      }

      .more-new-item-column + .more-new-item-column {
        margin-top: 31rpx;
      }
    }
  }
}
</style>
