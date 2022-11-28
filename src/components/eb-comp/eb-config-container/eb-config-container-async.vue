<template>
  <view class="container">
    <!-- 判断配置列表是否大于分页加载数量，大于则采用分批加载策略 -->
    <template v-if="pageConfigList && pageConfigList.length > asyncIdx">
      <eb-config-container
        :key="pageConfigIndex"
        :comp-bottom="false"
        :activity-id="activityId"
        :page-config-list="pageConfigList.slice(0, asyncIdx)"
        @purchaseVideo="purchaseVideo"
      />
      <template v-if="asyncLoad">
        <eb-config-container
          :key="pageConfigIndex"
          ref="EbConfig"
          :comp-top="false"
          :page-config-list="pageConfigList.slice(asyncIdx)"
          :activity-id="activityId"
          @purchaseVideo="purchaseVideo"
        />
      </template>
    </template>
    <eb-config-container
      v-else
      ref="EbConfig"
      :key="pageConfigIndex"
      :page-config-list="pageConfigList"
      :activity-id="activityId"
      @purchaseVideo="purchaseVideo"
    />
    <!-- 提示性弹窗 -->
    <notifyPop ref="NotifyPop" />
    <!-- 视频彩铃订购弹窗 -->
    <!-- businessInfo -->
    <popupTemplateOperition
      :popup-info="popupInfo"
      :show="show"
      @buttonClick="operitionBtnClick"
      @closePopup="closePopup"
    />
  </view>
</template>
<script>
import popupTemplateOperition from "../../popup-module/popup-template-operition.vue";
import SpclService from "../../../api/spcl/index";
export default {
  components: {
    popupTemplateOperition,
  },
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
      asyncIdx: 5,
      asyncLoad: false,
      asyncTiming: 2000,
      show: false, // 订购弹窗的展示控制
      popupInfo: {}, // 订购弹窗的内容
    };
  },
  created () {
    setTimeout(() => {
      this.asyncLoad = true;
    }, this.asyncTiming);
  },
  mounted () { },
  methods: {
    // 滑动到底部
    onScrollBottom () {
      if (this.$refs.EbConfig) {
        this.$refs.EbConfig.onScrollBottom();
      }
    },
    handleFresh () {
      this.$refs.EbConfig.handleFresh();
    },
    // 打开登录弹窗
    openLoginPopup () {
      this.$showLoginPop(this);
    },
    // 设置视频彩铃
    purchaseVideo (e) {
      // 设置视频彩铃
      if (uni.getStorageSync("Authorization")) {
        this.popupInfo = this.$store.state.window.windowAllObj.common_spcl_open;
        this.show = true;
      } else {
        this.openLoginPopup();
      }
    },
    // 订购弹窗按钮点击
    operitionBtnClick (e) {
      if (e.btnInfo.type === 1) { // 关闭弹窗
        this.closePopup();
      } else if (e.btnInfo.type === 2) { // 订购
        this.handleOpenSpcl(e);
      }
    },
    // 开通视频彩铃
    handleOpenSpcl (e) {
      SpclService.openSpcl({ servType: "001" }).then(res => {
        if (res.data.code == 200) {
          if (e.protocolCheckFlag) { // 勾选了AI换铃
            this.handleOpenAi();
          } else {
            this.$toast("成功开通视频彩铃业务");
          }
        } else {
          this.$toast("开通失败请重试");
        }
      });
    },
    // 开通AI换铃
    handleOpenAi () {
      SpclService.openAi({ type: 2 }).then(res => {
        if (res.data.code == 200) {
          this.$toast("成功开通视频彩铃业务");
        }
      });
    },
    // 订购弹窗关闭
    closePopup () {
      this.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
