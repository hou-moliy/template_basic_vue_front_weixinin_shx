<template>
  <view>
    <ebInnerStructure
      v-if="showFlag === 0"
      :page-config="pageConfig"
      :is-show-btn="isShowBtn"
      @openLoginPopup="openLoginPopup"
      @bannerClickEvent="bannerClickEvent"
    />
    <ebInnerStructureTwo
      v-if="showFlag === 1"
      :page-config="pageConfig"
      :is-show-btn="isShowBtn"
      @openLoginPopup="openLoginPopup"
      @bannerClickEvent="bannerClickEvent"
    />
    <ebInnerStructureThree
      v-if="showFlag === 2"
      :page-config="pageConfig"
      :is-show-btn="isShowBtn"
      @openLoginPopup="openLoginPopup"
      @bannerClickEvent="bannerClickEvent"
    />
  </view>
</template>

<script>
import ebInnerStructure from "./eb-inner-structure.vue";
import ebInnerStructureTwo from "./eb-ad-inner-structure-two.vue";
import ebInnerStructureThree from "./eb-inner-structure-three.vue";
export default {
  components: {
    ebInnerStructure,
    ebInnerStructureTwo,
    ebInnerStructureThree,
  },
  props: {
    // 接口传入参数
    pageConfig: {
      type: Object,
      default () {
        return {};
      },
      requrie: true,
    },
  },
  data () {
    // 这里存放数据
    return {};
  },
  // 监听属性 类似于data概念
  computed: {
    isShowBtn () {
      const noList = ["0004", "0006", "0008", "0019"];
      const hasList = ["0009", "0018"];
      if (this.pageConfig.moduleFlag) {
        if (noList.includes(this.pageConfig.moduleFlag)) {
          return 0;
        } else if (hasList.includes(this.pageConfig.moduleFlag)) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    },
    showFlag () {
      const styleOneList = ["0009", "0018", "0019"];
      const styleTwoList = ["0004", "0006"];
      const styleThreeList = ["0008"];
      if (styleOneList.includes(this.pageConfig.moduleFlag)) {
        return 0;
      } else if (styleTwoList.includes(this.pageConfig.moduleFlag)) {
        return 1;
      } else if (styleThreeList.includes(this.pageConfig.moduleFlag)) {
        return 2;
      } else {
        return NaN;
      }
    },
  },
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () { },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () { },
  // 方法集合
  methods: {
    openLoginPopup () {
      this.$emit("openLoginPopup");
    },
    // 运营位点击了
    bannerClickEvent (item) {
      console.log(1);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
