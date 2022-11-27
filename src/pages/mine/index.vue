<template>
  <view class="content">
    <button @click="toLogin">登录</button>
    <!-- 自定义Tabbar -->
    <custom-tabbar :tab-bar="tabBar" :mid-button="true" />
    <!-- 提示性弹窗 -->
    <notifyPop ref="NotifyPop" />
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
    this.dispatchPageEvent();
  },
  methods: {
    toLogin () {
      uni.navigateTo({
        url: "./login",
      });
    },
    // 跨页面通信监听
    dispatchPageEvent () {
      uni.$on("openLoginPopup", data => {
        console.log(data);
        this.$showLoginPop(this);
      });
    },
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
