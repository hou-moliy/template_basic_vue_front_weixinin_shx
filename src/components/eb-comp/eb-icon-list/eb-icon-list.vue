<template>
  <view class="eb-icon start">
    <view
      v-for="(item, index) in iconList"
      :key="index"
      class="eb-icon-item"
      @click="navigateByEvent(item)"
    >
      <image :src="item.url" />
      <!-- icon限制n位文字 -->
      <view>
        <text>{{ item.title ? item.title.slice(0, wordLimit) : "" }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import AdService from "@/api/ad";
import { navigateToAnyCheck } from "@/utils/navigateToAny.js";
export default {
  name: "EbIconList",

  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
    activityId: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      iconList: "",
      wordLimit: 6,
    };
  },

  created () {
    this.getIconList();
  },
  methods: {
    // 获取icon
    getIconList () {
      const { pageName, moduleId } = this.pageConfig;
      AdService
        .getAdList({
          target: pageName,
          moduleId,
        })
        .then((resp) => {
          if (resp.data.code === 200 && resp.data.data.length > 0) {
            this.iconList = resp.data.data;
          }
        });
    },
    async navigateByEvent (event) {
      this.$emit("buryIconListId", event.id);
      navigateToAnyCheck(event, `icon_${event.id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.eb-icon {
  width: 100%;
  // padding: 58rpx auto 45rpx auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 26rpx;
}

.start {
  justify-content: flex-start;
}

.around {
  justify-content: space-around;
}

.eb-icon-item {
  display: flex;
  margin: 14rpx 0 0rpx 0rpx;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20%;
}

.eb-icon image {
  width: 84rpx;
  height: 84rpx;
  display: block;
  flex-shrink: 0;
}
.eb-icon text {
  text-align: center;
  padding: 0rpx 10rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 24rpx;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  color: #2d2d2d;
  line-height: 36px;
}
</style>
<style>
/* .swiper-box .wx-swiper-dot */
uni-swiper .uni-swiper-dot {
  width: 10rpx !important;
  height: 10rpx !important;
}
</style>
