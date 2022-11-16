<template>
  <view class="container">
    <!-- 判断配置列表是否大于分页加载数量，大于则采用分批加载策略 -->
    <template v-if="pageConfigList && pageConfigList.length > asyncIdx">
      <eb-config-container
        :key="pageConfigIndex"
        :page-config-list="pageConfigList.slice(0, asyncIdx)"
      ></eb-config-container>
      <template v-if="asyncLoad">
        <eb-config-container
          :key="pageConfigIndex"
          :page-config-list="pageConfigList.slice(asyncIdx)"
        ></eb-config-container>
      </template>
    </template>
    <eb-config-container
      v-else
      ref="EbConfig"
      :page-config-list="pageConfigList"
      :key="pageConfigIndex"
    ></eb-config-container>
  </view>
</template>

<script>
export default {
  props: {
    pageConfigList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      asyncIdx: 5,
      asyncLoad: false,
      asyncTiming: 2000,
    };
  },
  created() {
    setTimeout(() => {
      this.asyncLoad = true;
    }, this.asyncTiming);
  },
  mounted() {
    console.log("模块化渲染器异步加载");
    console.log("pageConfigList ,", this.pageConfigList);
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
