<template>
  <view class="content">
    <image
      class="logo"
      src="/static/logo.png"
    />
    <view>
      <text class="title">
        {{ title }}
      </text>
    </view>
    <!-- 自定义Tabbar -->
    <custom-tabbar
      :tab-bar="tabBar"
      :mid-button="true"
    />
  </view>
</template>

<script>
import testService from "../../api/test";
import CustomTabbar from "../../components/CustomTabbar/CustomTabbar.vue";
export default {
  name: "PageCommonList",
  components: { CustomTabbar },
  data () {
    return {
      title: "Hello",
      tabBar: this.$store.getters.tabbarList,
    };
  },
  onLoad () {
  },
  methods: {
    getAi () {
      testService.aiFunction().then(
        res => {
        },
      );
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
