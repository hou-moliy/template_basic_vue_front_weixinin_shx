<template>
  <view class="container">
    <!-- 判断配置列表是否大于分页加载数量，大于则采用分批加载策略 -->
    <template v-if="pageConfigList && pageConfigList.length > asyncIdx">
      <eb-config-container
        :key="pageConfigIndex"
        ref="EbConfig1"
        :comp-bottom="false"
        :activity-id="activityId"
        :page-config-list="pageConfigList.slice(0, asyncIdx)"
        @purchaseVideo="purchaseVideo"
        @changeAi="changeAi"
      />
      <template v-if="asyncLoad">
        <eb-config-container
          :key="pageConfigIndex"
          ref="EbConfig2"
          :comp-top="false"
          :page-config-list="pageConfigList.slice(asyncIdx)"
          :activity-id="activityId"
          @purchaseVideo="purchaseVideo"
          @changeAi="changeAi"
        />
      </template>
    </template>
    <eb-config-container
      v-else
      ref="EbConfig3"
      :key="pageConfigIndex"
      :page-config-list="pageConfigList"
      :activity-id="activityId"
      @purchaseVideo="purchaseVideo"
      @changeAi="changeAi"
    />
  </view>
</template>
<script>
import { handlePurchaseVideo, handleOpenAi, changeAi } from "@/utils/video.js";
export default {
  props: {
    pageConfigList: {
      type: Array,
      default: () => [],
    },
    activityId: {
      type: String,
      default: "",
    },
    pageLoadStatus: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      asyncIdx: 7,
      asyncLoad: false,
      asyncTiming: 2000,
    };
  },
  created () {
    setTimeout(() => {
      this.asyncLoad = true;
    }, this.asyncTiming);
  },
  mounted () {
  },
  methods: {
    // 滑动到底部
    onScrollBottom () {
      if (this.$refs.EbConfig1) {
        this.$refs.EbConfig1.onScrollBottom();
      }
      if (this.$refs.EbConfig2) {
        this.$refs.EbConfig2.onScrollBottom();
      }
      if (this.$refs.EbConfig3) {
        this.$refs.EbConfig3.onScrollBottom();
      }
    },
    // 刷新
    handleFresh () {
      if (this.$refs.EbConfig1) {
        this.$refs.EbConfig1.handleFresh();
      }
      if (this.$refs.EbConfig2) {
        this.$refs.EbConfig2.handleFresh();
      }
      if (this.$refs.EbConfig3) {
        this.$refs.EbConfig3.handleFresh();
      }
    },
    // 打开登录弹窗
    openLoginPopup () {
      uni.$emit("openLoginPopup", { msg: "展示登录弹窗" });
    },
    // 点击设置视频彩铃按钮
    purchaseVideo (item) {
      // 处理视频彩铃设置
      handlePurchaseVideo(item, this.handleFresh, "video_set_count", this.activityId);
    },
    // 开通或关闭AI换铃
    handleOpenAi,
    // Ai换铃状态切换
    changeAi,
  },
};
</script>
<style lang="scss" scoped>
</style>
