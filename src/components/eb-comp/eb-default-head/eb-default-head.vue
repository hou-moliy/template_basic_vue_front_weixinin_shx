<template>
  <view class="block" :style="{ padding: blockPadding }">
    <view class="block-box" :style="{ margin, padding }">
      <view class="block-box__title">
        <view>
          <img
            v-if="
              pageConfig.tagIcon !== '' &&
              pageConfig.pageName === 'ln_spcl_index'
            "
            class="spcl-icon"
            :src="params.tagIcon"
          />
        </view>
        <span v-if="pageConfig.showTitleFlag">{{ pageConfig.title }}</span>
        <view>
          <img
            v-if="
              pageConfig.tagIcon !== '' &&
              pageConfig.pageName !== 'ln_spcl_index'
            "
            :src="pageConfig.tagIcon"
          />
        </view>
      </view>
      <view
        v-if="pageConfig.showMoreFlag"
        class="block-box__button"
        @click="jumpTo"
      >
        {{ pageConfig.moreTitle ? pageConfig.moreTitle : "查看更多" }}
      </view>
    </view>
    <!-- 组件 -->
    <slot />
  </view>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { navigateToAny } from "@/utils/tools.js";
export default {
  components: {},
  // import引入的组件需要注入到对象中才能使用
  props: {
    // 当前模块的数据
    // 包括 blockTitle 标题  tagIcon 标题图片  navitgateUrl 查看更多跳转地址 showMoreFlag 查看更多按钮控制 showTitleFlag 标题控制 moduleId
    pageConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 外边距
    margin: {
      type: String,
      default: "0",
    },
    // 内边距
    padding: {
      type: String,
      default: "0",
    },
    // 内边距
    blockPadding: {
      type: String,
      default: "0rpx 34rpx",
    },
  },
  data() {
    // 这里存放数据
    return {
      staticImgs: this.$staticImgs,
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  watch: {
    params: {
      handler(n, o) {
        console.log("n", n);
        console.log("o", o);
      },
      deep: true,
      immediate: true,
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    async jumpTo() {
      await this.$store.dispatch(
        "getCustomorderList",
        `seeMore_rec_${this.pageConfig.moduleId}`,
      );
      if (this.$store.state.offlinePopup.loginShow) {
        this.$emit("openLoginPopup");
        return;
      }
      if (this.$store.state.offlinePopup.offlineFlag) {
        return;
      }
      if (this.pageConfig.eventType === 5) {
        // eventType为5的时候表示首页swiper切换，此时eventUrl为要切换的swiper-item的pageName
        this.$parent.changeTabByMore(this.pageConfig.eventUrl);
      } else {
        this.handleAnalysis();
        uni.setStorageSync("moreData", this.pageConfig);
        let params = this.pageConfig.eventUrl;
        // 请统一使用eventUrl字段作为跳转路径
        if (this.pageConfig.eventUrl.indexOf("?") > -1) {
          params = `${this.pageConfig.eventUrl}&moduleId=${this.pageConfig.moduleId}&pageName=${this.pageConfig.title}&showDirection=V`;
        } else {
          params = `${this.pageConfig.eventUrl}?moduleId=${this.pageConfig.moduleId}&pageName=${this.pageConfig.title}&showDirection=V`;
        }
        navigateToAny(params);
      }
    },
    // 处理不同栏目下查看更多的埋点
    handleAnalysis() {
      const { pageName, moduleId } = this.pageConfig;
      switch (pageName) {
        case "recommend_page": // 推荐
          this.$analysis.dispatch("fxtj_id_ckgd", moduleId);
          break;
        case "mgimg_page": // 咪咕图片
          this.$analysis.dispatch("fxmgtp_id_ckgd", moduleId);
          break;
        case "short_video_page": // 发现小视频
          this.$analysis.dispatch("fxxsp_id_ckgd", moduleId);
          break;
        default:
          this.$analysis.dispatch(pageName + "_ckgd", moduleId);
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  &-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    &__title {
      /* margin-left: 34rpx; */
      /* text-indent: 0.3em; */
      display: flex;
      align-items: center;

      view {
        height: 100%;
        display: flex;
        align-items: center;
      }

      span {
        font-size: 40rpx;
        color: #000000;
        font-weight: 600;
      }

      img {
        width: 37rpx;
        height: 49rpx;
        margin-left: 6rpx;
        padding-bottom: 6rpx;
      }

      .spcl-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 14rpx;
        margin-left: 0;
        padding-bottom: 0;
      }
    }

    &__button {
      font-size: 24rpx;
      font-family: PingFang SC Medium, PingFang SC Medium-Medium;
      font-weight: 500;
      height: 51rpx;
      color: #666666;
      line-height: 51rpx;
      padding: 0 28rpx 0 28rpx;
      border: 2rpx solid #999999;
      border-radius: 26rpx;
    }
  }
}
</style>
