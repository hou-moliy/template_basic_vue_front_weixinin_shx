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
  </view>
</template>
<script>
import SpclService from "../../../api/spcl/index";
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
    purchaseVideo (e) {
      if (uni.getStorageSync("Authorization")) {
        this.$store.dispatch("user/getUserSpclStatus").then(res => {
          if (res == 1) { // 已开通视频彩铃
            const popupInfo = this.$store.state.window.windowAllObj.common_spcl_set;
            popupInfo.windowDesc = popupInfo.windowDesc.replace("#{ringName}", `《${e.ringName}》`);
            uni.$emit("operitionShow", {
              popupInfo, btnClickCallBack: (item) => this.confirmOrderSpcl(item),
            });
          } else { // 未开通
            const popupInfo = this.$store.state.window.windowAllObj.common_spcl_open;
            uni.$emit("operitionShow", { popupInfo, btnClickCallBack: (item) => this.operitionBtnClick(item) });
          }
        });
      } else {
        this.openLoginPopup();
      }
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
      console.log(item, "item.protocolCheckFlag");
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
    // 开通AI换铃
    handleOpenAi () {
      return new Promise((resolve, reject) => {
        SpclService.openAi({ type: 2 }).then(res => {
          if (res.data.code === 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
