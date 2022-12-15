<template>
  <view v-if="wfList.length" class="scenery-wrap">
    <scroll-view :scroll-x="true" class="items-box">
      <view v-for="(item, index) in wfList" :key="index" class="item-wrap">
        <video-item
          :item="item"
          :radius="20"
          :module-id="params.moduleId"
          :icons-class="['light']"
          :video-list="wfList"
          @giveLikes="giveLikes"
          @shareVideo="shareVideo"
          @goToPlayVideo="goToPlayVideo"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import SpclService from "@/api/spcl/index.js";
import videoItem from "./videoItem.vue";
export default {
  name: "FindSceneryRecommend",
  components: {
    videoItem,
  },
  props: {
    pageConfig: {
      required: true,
      type: Object,
      default: () => { },
    },
    pageLoadStatus: {
      type: Boolean,
      default: false,
    },
    activityId: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      wfList: [],
      moduleId: "",
      isClickLike: false,
    };
  },
  watch: {
    pageLoadStatus (value) {
      console.log(value, "页面切换状态");
      if (value) {
        this.getWfList();
      }
    },
  },
  created () {
    this.getWfList();
  },
  methods: {
    // 强制刷新
    handleFresh () {
      this.getWfList();
    },
    // 请求列表数据
    async getWfList () {
      this.moduleId = this.pageConfig.moduleId;
      if (!this.moduleId) return;
      const params = {
        ac: this.activityId,
        level: this.pageConfig.sort,
      };
      await SpclService.getVideoByActivityId(params).then(({ data: res }) => {
        if (res.code === 200) {
          if (!res.data.length) return;
          this.wfList = res.data;
        }
      });
    },
    // 分享
    shareVideo ({ ringId, target }) {
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
      } else {
        const params = {
          ringId,
          target,
          mainId: this.moduleId,
          pageName: this.activityId,
        };
        this.handleSpclUserBehavior(params);
        this.$emit("buryShare", () => {
          // 生成海报
          uni.navigateTo({
            url: `/pagesCommon/share/shareVideo?videoId=${ringId}`,
          });
        });
      }
    },
    handleTips ({ opType }) {
      if (opType === 1) {
        this.$emit("buryDz");
        this.$toast("点赞成功");
      } else if (opType === 0) {
        this.$toast("成功取消点赞");
      }
      this.getWfList();
    },
    // 点赞
    giveLikes ({ ringId, target, opType }) {
      // opType 1点赞，0取消
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
        return;
      }
      if (this.isClickLike) {
        return;
      }
      this.isClickLike = true;
      const params = {
        ringId,
        target,
        opType,
        mainId: this.moduleId,
        pageName: "1",
      };
      this.handleSpclUserBehavior(params);
    },
    handleSpclUserBehavior (params) {
      SpclService.getSpclUserBehavior(params).then(({ data: res }) => {
        this.isClickLike = false;
        if (res.code === 200) {
          this.handleTips(params);
        } else {
          this.$toast(res.message);
        }
      });
    },
    // 跳转视频彩铃播放页面
    goToPlayVideo (item) {
      this.$emit("goToPlayVideo", { item, list: this.wfList });
    },
  },
};
</script>

<style lang="scss" scoped>
.scenery-wrap {
  padding: 0 17px;
  margin-bottom: 40rpx;
}

.items-box {
  margin-top: 27rpx;
  white-space: nowrap;
  &:first-child {
    margin-top: 0rpx;
  }
}

.item-wrap {
  width: 270rpx;
  display: inline-block;
}

.item-wrap + .item-wrap {
  margin-left: 17rpx;
}
</style>
