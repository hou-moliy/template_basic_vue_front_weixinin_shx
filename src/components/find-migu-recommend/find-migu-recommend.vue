<template>
  <!-- 风景组件 -->
  <view
    v-if="wfList.length"
    class="scenery-wrap"
  >
    <scroll-view
      :scroll-x="true"
      class="items-box"
    >
      <view
        v-for="(item, index) in wfList"
        :key="index"
        class="item-wrap"
      >
        <video-item
          :item="item"
          :radius="24"
          :icons-class="['light']"
          :video-list="wfList"
          :is-login="isLogin"
          @click.native="programaAnalysis(params, item.moduleId)"
          @giveLikes="giveLikes"
          @shareVideo="shareVideo"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import miguService from "@/api/migu/migu.js";
import videoItem from "./videoItem.vue";
import { programaAnalysis } from "@/utils/common.js";
export default {
  name: "FindSceneryRecommend",
  components: {
    videoItem,
  },
  props: {
    isLogin: {
      type: Boolean,
      default: false,
    },
    params: {
      required: true,
    },
  },
  data () {
    return {
      wfList: [],
      isClickLike: false,
    };
  },
  created () {
    console.log("created", this.isLogin);
    this.getWfList();
  },
  methods: {
    programaAnalysis,
    // 强制刷新
    handleFresh () {
      this.$forceUpdate();
    },
    // 请求列表数据
    async getWfList () {
      const { moduleId } = this.params;
      if (!moduleId) return;
      const params = {
        moduleId,
      };
      await miguService.getlistById(params).then(({ data: res }) => {
        if (res.code === 200) {
          if (!res.data.list.length) return;
          this.wfList = res.data.list;
        }
      });
      // ----------------------------------------------------------------
    },
    // 分享
    shareVideo ({ videoId, target, item }) {
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
        return;
      }
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
          console.log("this.wfList", this.wfList);
          const currentIndex = this.wfList.findIndex(
            (itemVal) => itemVal.videoId === item.videoId,
          );
          const { target, optype } = params;
          if (target === "fx") {
            item.moreInfo.shareCount++;
            this.wfList[currentIndex] = item;
            this.$forceUpdate();
          } else {
            if (optype) {
              uni.showToast({ title: "点赞成功", icon: "none" });
              item.moreInfo.like = true;
              item.moreInfo.likeCount++;
              this.wfList[currentIndex] = item;
              this.$forceUpdate();
            } else {
              uni.showToast({ title: "取消点赞成功", icon: "none" });
              item.moreInfo.like = false;
              item.moreInfo.likeCount--;
              if (!item.moreInfo.likeCount) {
                item.moreInfo.likeCount = 0;
              }
              this.wfList[currentIndex] = item;
              this.$forceUpdate();
            }
          }
        } else {
          uni.showToast({ title: res.message, icon: "none" });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scenery-wrap {
  width: 100%;
  background-color: #fff;
}

.items-box {
  margin-top: 27rpx;
  white-space: nowrap;
  &:first-child {
    margin-top: 0rpx;
  }
}

.item-wrap {
  width: 334rpx;
  display: inline-block;
}

.item-wrap + .item-wrap {
  margin-left: 17rpx;
}
</style>
