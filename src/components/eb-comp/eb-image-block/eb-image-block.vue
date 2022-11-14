<template>
  <view
    v-if="isFinished"
    class="find-image-block"
  >
    <view
      class="find-image-block-item"
      @click.native="programaAnalysis(params, pictureList[0].imgId)"
    >
      <imageItem
        :item="pictureList[0]"
        :is-login="isLogin"
        :last-flag="true"
        @shareCountChange="shareCountChange"
        @openLoginPopup="openLoginPopup"
      />
    </view>
    <view
      class="find-image-block-item"
      @click.native="programaAnalysis(params, pictureList[1].imgId)"
    >
      <imageItem
        :item="pictureList[1]"
        :is-login="isLogin"
        :last-flag="true"
        @shareCountChange="shareCountChange"
        @openLoginPopup="openLoginPopup"
      />
    </view>
  </view>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import imageItem from "../eb-image-falls/imageItem.vue";
import pictureService from "@/api/picture/index.js";
import { programaAnalysis } from "@/utils/common.js";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    imageItem,
  },
  props: {
    params: {
      type: Object,
      default: () => { },
    },
    isLogin: {
      type: Boolean,
      default () {
        return false;
      },
    },
  },
  data () {
    // 这里存放数据
    return {
      pictureList: [{}, {}],
      isFinished: false,
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () { },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.getBlockList();
  },

  // 方法集合
  methods: {
    programaAnalysis,
    handleFresh () {
      this.getBlockList();
    },
    getBlockList () {
      const params = {
        moduleId: this.params.moduleId,
      };
      this.isFinished = false;
      pictureService.getPictureListBlcok(params).then(res => {
        if (res.data.code === 200) {
          this.pictureList = [...res.data.data.list];
          this.isFinished = true;
        }
      });
    },
    openLoginPopup () {
      this.$emit("openLoginPopup");
    },
    shareCountChange (item) {
      const temObj = {
        ...item,
      };
      temObj.shareCount = parseFloat(temObj.shareCount) + 1;
      this.pictureList.forEach(item => {
        if (item.imgId === temObj.imgId) {
          item.shareCount = temObj.shareCount;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.find-image-block {
  width: 100%;
  display: flex;
  // padding: 20rpx 0;
  // background: linear-gradient(0deg, #FFFFFF 0%,#F7F8FB 0%);
  // background: #F7F8FB !important;
  &-item:last-of-type {
    margin-left: 18rpx;
  }
}
</style>
