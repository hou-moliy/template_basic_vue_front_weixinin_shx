<template>
  <view class="content">
    我的页面
    <!-- 自定义Tabbar -->
    <custom-tabbar
      :tab-bar="tabBar"
      :mid-button="true"
    />
  </view>
</template>

<script>
export default {
  name: "Index",
  data () {
    return {
      tabBar: this.$store.getters.tabbarList,
    };
  },
  onLoad () {
  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
