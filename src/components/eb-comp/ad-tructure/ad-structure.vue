<template>
  <view>
    <findAdStructure
      v-if="showFlag===0"
      :params="params"
      :is-show-btn="isShowBtn"
      @openLoginPopup="openLoginPopup"
      @bannerClickEvent="bannerClickEvent"
    />
    <findAdStructureTwo
      v-if="showFlag===1"
      :params="params"
      :is-show-btn="isShowBtn"
      @openLoginPopup="openLoginPopup"
      @bannerClickEvent="bannerClickEvent"
    />
    <findAdStructureThree
      v-if="showFlag===2"
      :params="params"
      :is-show-btn="isShowBtn"
      @openLoginPopup="openLoginPopup"
      @bannerClickEvent="bannerClickEvent"
    />
  </view>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import findAdStructure from "./find-ad-inner-structure.vue";
import findAdStructureTwo from "./find-ad-inner-structure-2.vue";
import findAdStructureThree from "./find-ad-inner-structure-3.vue";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    findAdStructure,
    findAdStructureTwo,
    findAdStructureThree,
  },
  props: {
    // 接口传入参数
    params: {
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
      if (this.params.moduleFlag) {
        if (noList.includes(this.params.moduleFlag)) {
          return 0;
        } else if (hasList.includes(this.params.moduleFlag)) {
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
      if (styleOneList.includes(this.params.moduleFlag)) {
        return 0;
      } else if (styleTwoList.includes(this.params.moduleFlag)) {
        return 1;
      } else if (styleThreeList.includes(this.params.moduleFlag)) {
        return 2;
      } else {
        return NaN;
      }
    },
  },
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  // 方法集合
  methods: {
    openLoginPopup () {
      this.$emit("openLoginPopup");
    },
    // 运营位点击了
    bannerClickEvent (item) {
      console.log(1);
      // const {
      //   pageName,
      //   moduleId,
      // } = this.params;
      // switch (pageName) {
      //   case "recommend_page":
      //     this.$analysis.dispatch("fxtj_id_id", `${moduleId}_${item.id}`);
      //     break;
      //   case "mgimg_page":
      //     this.$analysis.dispatch("fxmgtp_id_id", `${moduleId}_${item.id}`);
      //     break;
      //   default:
      //     break;
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
