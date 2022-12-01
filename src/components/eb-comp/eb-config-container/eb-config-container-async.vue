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
        @changeAi="changeAi"
      />
      <template v-if="asyncLoad">
        <eb-config-container
          :key="pageConfigIndex"
          ref="EbConfig"
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
      ref="EbConfig"
      :key="pageConfigIndex"
      :page-config-list="pageConfigList"
      :activity-id="activityId"
      @purchaseVideo="purchaseVideo"
      @changeAi="changeAi"
    />
  </view>
</template>
<script>
import SpclService from "@/api/spcl/index";
import { handlePurchaseVideo } from "@/utils/video.js";
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
      asyncIdx: 5,
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
      if (this.$refs.EbConfig) {
        this.$refs.EbConfig.onScrollBottom();
      }
    },
    // 刷新
    handleFresh () {
      this.$refs.EbConfig.handleFresh();
    },
    // 打开登录弹窗
    openLoginPopup () {
      uni.$emit("openLoginPopup", { msg: "展示登录弹窗" });
    },
    // 点击设置视频彩铃按钮
    purchaseVideo (item) {
      // 处理视频彩铃设置
      handlePurchaseVideo(item, this.handleFresh);
    },
    // 设置视频彩铃
    handleSetPcl (item) {
      SpclService.setSpcl({ ringId: item.ringId }).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.code === 0) {
            this.$toast("设置成功");
            // 更新用户所有铃音数据
            this.$store.commit("spcl/UPDATE_USER_SPCL_ALL", item);
            // 更新当前播放数据
            this.$store.commit("spcl/UPDATE_USER_SPCL_SETTINGS", item.ringId);
            this.handleFresh();
            this.$store.commit("window/SET_OPERITION_SHOW", false);
          } else {
            this.$toast(res.data.data.msg);
            this.$store.commit("window/SET_OPERITION_SHOW", true);
          }
        } else {
          this.$toast(res.data.message);
          this.$store.commit("window/SET_OPERITION_SHOW", true);
        }
      });
    },
    // 确定订购视频彩铃按钮点击
    confirmOrderSpcl (item) {
      this.$loading("设置中");
      if (item.protocolCheckFlag) { // 勾选了AI换铃
        this.handleOpenAi().then(() => {
          this.handleSetPcl(item);
        }).catch(() => this.$toast("AI换铃开通,失败请重试"));
      } else {
        this.handleSetPcl(item);
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
        if (res.data.code === 200) {
          if (e.protocolCheckFlag) { // 勾选了AI换铃
            this.handleOpenAi().then(() => {
              this.$toast("成功开通视频彩铃业务");
              this.$store.commit("window/SET_OPERITION_SHOW", false);
            }).catch(() => {
              this.$toast("AI换铃开通,失败请重试");
              this.$store.commit("window/SET_OPERITION_SHOW", true);
            });
          } else {
            this.$toast("成功开通视频彩铃业务");
            this.$store.commit("window/SET_OPERITION_SHOW", false);
          }
        } else {
          this.$toast("开通失败请重试");
          this.$store.commit("window/SET_OPERITION_SHOW", true);
        }
      });
    },
    // 开通或关闭AI换铃
    handleOpenAi (type = 2) { // type 2 开通, 1取消
      return new Promise((resolve, reject) => {
        SpclService.openAi({ type }).then(res => {
          if (res.data.code === 200) {
            this.$store.dispatch("user/getUserAiStatus");
            resolve(res.data);
          } else {
            reject(res.data);
          }
        });
      });
    },
    // Ai换铃状态切换
    changeAi () {
      this.$store.dispatch("user/getUserSpclStatus").then(spclStatus => {
        if (spclStatus == 1) { // 已开通、展示开启或关闭ai换铃声提示
          this.$store.dispatch("user/getUserAiStatus").then(isAIOpen => {
            const type = isAIOpen == 1 ? 1 : 2; // type 1是取消,2是开启
            const notifyInfo = type === 1 ? this.$store.state.window.windowAllObj.common_ai_cancel : this.$store.state.window.windowAllObj.common_ai_open;
            uni.$emit("changeAi", {
              notifyInfo,
              confirmCallback: () => {
                this.handleOpenAi(type).then(() => {
                  type === 1 ? this.$toast("取消成功!") : this.$toast("开启成功!");
                });
              },
            });
          });
        } else { // 未开通、展示开通弹窗
          const popupInfo = this.$store.state.window.windowAllObj.common_spcl_open;
          uni.$emit("operitionShow", { popupInfo, btnClickCallBack: (item) => this.operitionBtnClick(item) });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
