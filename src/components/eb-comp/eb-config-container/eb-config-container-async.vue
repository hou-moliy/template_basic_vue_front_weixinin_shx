<template>
  <view class="container">
    <!-- 判断配置列表是否大于分页加载数量，大于则采用分批加载策略 -->
    <template v-if="pageConfigList && pageConfigList.length > asyncIdx">
      <eb-config-container
        :key="pageConfigIndex"
        :comp-bottom="false"
        :activity-id="activityId"
        :page-config-list="pageConfigList.slice(0, asyncIdx)"
      />
      <template v-if="asyncLoad">
        <eb-config-container
          :key="pageConfigIndex"
          ref="EbConfig"
          :comp-top="false"
          :page-config-list="pageConfigList.slice(asyncIdx)"
          :activity-id="activityId"
        />
      </template>
    </template>
    <eb-config-container
      v-else
      ref="EbConfig"
      :key="pageConfigIndex"
      :page-config-list="pageConfigList"
      :activity-id="activityId"
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
  mounted () { },
  methods: {
    // 滑动到底部
    onScrollBottom () {
      this.$refs.EbConfig.onScrollBottom();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
