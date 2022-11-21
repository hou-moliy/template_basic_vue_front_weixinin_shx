<template>
  <view class="container">
    <!-- 判断配置列表是否大于分页加载数量，大于则采用分批加载策略 -->
    <template v-if="pageConfigList && pageConfigList.length > asyncIdx">
      <eb-config-container
        :key="pageConfigIndex"
        :comp-bottom="false"
        :page-config-list="pageConfigList.slice(0, asyncIdx)"
      />
      <template v-if="asyncLoad">
        <eb-config-container
          :key="pageConfigIndex"
          :comp-top="false"
          :page-config-list="pageConfigList.slice(asyncIdx)"
        />
      </template>
    </template>
    <eb-config-container
      v-else
      ref="EbConfig"
      :key="pageConfigIndex"
      :page-config-list="pageConfigList"
    />
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
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
