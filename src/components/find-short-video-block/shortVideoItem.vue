<template>
  <view
    class="short-video-item"
    @click="jump"
  >
    <view class="short-video-item-image">
      <image
        class="short-video-item-image1"
        :src="item.coverUrl"
      />
      <image
        class="item-btn"
        :src="`${staticImgs}/lnmp/ln-find/find-play-btn.png`"
      />
    </view>

    <view class="short-video-item-content">
      <view
        v-if="item.title"
        class="title"
      >
        {{ item.title }}
      </view>
      <view
        v-if="item.info"
        class="desc"
      >
        {{ item.info }}
      </view>
    </view>
  </view>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  components: {},
  // import引入的组件需要注入到对象中才能使用
  props: {
    item: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    // 这里存放数据
    return {
      staticImgs: this.$staticImgs,
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () { },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () { },
  // 方法集合
  methods: {
    jump () {
      console.log("000");
      uni.navigateTo({
        url: `/pagesC/liaoNingFind/views/littleVideo/littleVideo?videoId=${this.item.videoId}&type=2`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.short-video-item {
  width: 334rpx;
  &-image {
    width: 100%;
    position: relative;
    image {
      width: 100%;
      height: 100%;
      border-radius: 20rpx;
    }
    .item-btn {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -39rpx;
      margin-top: -39rpx;
      width: 78rpx;
      height: 78rpx;
    }
  }

  &-content {
    width: 100%;
    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      white-space: nowrap;
      font-size: 28rpx;
      font-weight: 500;
      padding: 16rpx 0 4rpx 0;
    }
    .desc {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      white-space: nowrap;
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
    }
  }
  .short-video-item-image1 {
    width: 334rpx;
    height: 390rpx;
  }
}
</style>
