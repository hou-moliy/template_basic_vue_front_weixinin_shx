
<template>
  <view class="find-short-video-block">
    <view
      v-for="(item, index) in shortVideoList"
      :key="index"
      class="find-short-video-block-content"
      :class="index%2 === 0 ? 'right':'left'"
      @click="programaAnalysis(params,item.videoId)"
    >
      <shortVideoItem
        :item="item"
        @openLoginPopup="openLoginPopup"
      />
    </view>
  </view>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import miguService from "@/api/migu/migu.js";
import shortVideoItem from "./shortVideoItem.vue";
import {
  programaAnalysis,
} from "@/utils/common.js";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    shortVideoItem,
  },
  props: {
    params: {
      require: true,
    },
  },
  data () {
    // 这里存放数据
    return {
      shortVideoList: [],
      isFinished: false,
      staticImgs: this.$staticImgs,

    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.getShortVideoList();
  },
  // 方法集合
  methods: {
    programaAnalysis,
    getShortVideoList () {
      const params = {
        moduleId: 17,
        pageSize: 4,
      };
      this.isFinished = false;
      miguService.getlistById(params).then(res => {
        if (res.data.code === 200) {
          this.shortVideoList = [...res.data.data.list];
          this.isFinished = true;
        }
      });
    },
    openLoginPopup () {
      this.$emit("openLoginPopup");
    },
  },
};
</script>
<style lang="scss"  scoped>
.find-short-video-block {
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  &-content {
    margin-top: 24rpx;
    &:first-child {
      margin-top: 0rpx;
    }
    &:nth-child(2) {
      margin-top: 0rpx;
    }
  }
  .right {
    margin-right: 18rpx;
  }
}
</style>
