<template>
  <view v-if="wfList.length" class="scenery-wrap">
    <scroll-view :scroll-x="true" class="items-box">
      <view v-for="(item, index) in wfList" :key="index" class="item-wrap">
        <video-item
          :item="item"
          :radius="24"
          :module-id="params.moduleId"
          :icons-class="['light']"
          :video-list="wfList"
          @click.native="programaAnalysis(params, item.ringId)"
          @giveLikes="giveLikes"
          @shareVideo="shareVideo"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import cxVideoService from "@/api/cx/video.js";
import videoItem from "./videoItem.vue";
import { programaAnalysis } from "@/utils/common.js";
export default {
  name: "FindSceneryRecommend",
  components: {
    videoItem,
  },
  props: {
    pageConfig: {
      required: true,
      type: Object,
      default: () => {},
    },
    pageLoadStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      wfList: [],
      moduleId: "",
      isClickLike: false,
    };
  },
  watch: {
    pageLoadStatus(value) {
      console.log(value, "页面切换状态");
      if (value) {
        this.getWfList();
      }
    },
  },
  created() {
    this.getWfList();
  },
  methods: {
    programaAnalysis,
    // 请求列表数据
    async getWfList() {
      this.moduleId = this.pageConfig.moduleId;
      if (!this.moduleId) return;
      const params = {
        labelId: this.moduleId,
      };
      await cxVideoService.getSceneryListById(params).then(({ data: res }) => {
        if (res.code === 200) {
          if (!res.data.list.length) return;
          this.wfList = res.data.list;
        }
      });
    },
    // 分享
    shareVideo({ ringId, target }) {
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
      } else {
        // this.$store.dispatch('getCustomorderList','a')
        // if(Boolean(this.$store.state.offlinePopup.offlineFlag)){
        // return
        // }
        const params = {
          ringId,
          target,
          mainId: this.moduleId,
          pageName: "1",
        };
        this.handleSpclUserBehavior(params);
        // 生成海报
        uni.navigateTo({
          url: `/pagesCommon/share/shareVideo?videoId=${ringId}`,
        });
      }
    },
    handleTips({ opType }) {
      if (opType === 1) {
        this.$tips("点赞成功");
      } else if (opType === 0) {
        this.$tips("取消点赞成功");
      }
      this.getWfList();
    },
    // 点赞
    giveLikes({ ringId, target, opType }) {
      // opType 1点赞，0取消
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
        return;
      }
      // this.$store.dispatch("getCustomorderList", "a");
      // if (this.$store.state.offlinePopup.offlineFlag) {
      //   return;
      // }
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
    handleSpclUserBehavior(params) {
      cxVideoService.getSpclUserBehavior(params).then(({ data: res }) => {
        this.isClickLike = false;
        if (res.code === 200) {
          this.handleTips(params);
        } else {
          this.$tips(res.message);
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
  width: 270rpx;
  display: inline-block;
}

.item-wrap + .item-wrap {
  margin-left: 17rpx;
}
</style>
