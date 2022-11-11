<template>
  <!-- 推荐框架的基础布局组件 -->
  <view class="basic-wrap">
    <view class="basic-con">
      <slot name="basicLeft">
        <view class="basic-con-l">
          <image
            :src="item.coverUrl"
            mode=""
            class="basic-l-img"
          />
        </view>
      </slot>
      <slot name="basicRight">
        <view class="basic-con-r">
          <view>
            <view class="basic-r-title">
              {{ item.businessName }}
            </view>
            <slot name="subtitle">
              <view class="basic-r-subtitle">
                {{ item.businessDesc }}
              </view>
            </slot>
          </view>
          <slot name="basicRightActions">
            <view class="basic-r-actions">
              <view
                class="basic-r-btn"
                @click.stop="handleBtn(1,item)"
              >
                查看详情
              </view>
              <view
                class="basic-r-btn"
                @click.stop="handleBtn(2,item)"
              >
                立即订购
              </view>
            </view>
          </slot>
        </view>
      </slot>
    </view>
  </view>
</template>

<script>
export default {
  name: "FindRecommendBasic",
  props: {
    title: {
      type: String,
      default: "视频彩铃业务视频彩铃业务视频彩铃业务视频彩铃业务",
    },
    subtitle: {
      type: String,
      default: "5G助手包含有哪些功能？助手包含有哪些功能助手包含有哪些功能助手包含有哪些功能助手包含有哪些功能",
    },
    leftHeight: {
      type: Number,
      default: 195,
    },
    imgUrl: {
      type: String,
      default: "",
    },
    item: {
      type: Object,
      default: () => { },
    },

  },
  data () {
    return {

    };
  },
  created () {
    console.log(this.title, "222");
  },
  mounted () {
  },
  methods: {
    handleBtn (type, item) {
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
        return;
      }
      this.$emit("handleBtn", {
        type,
        item,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.basic-wrap {
  display: flex;
  flex-direction: column;
}

.basic-con {
  display: flex;
  padding: 18rpx 0rpx;
  box-sizing: border-box;
}

.basic-con-l {
  width: 260rpx;
  height: 194rpx;
  border-radius: 10rpx;
  margin-right: 29rpx;

  .basic-l-img {
    width: inherit;
    height: inherit;
    display: inline-block;
    border-radius: 20rpx;
    vertical-align: top;
  }
}

.basic-con-r {
  min-height: 100%;
  width: 100%;
  padding-right: 46rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .basic-r-title {
    width: 380rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 30rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 40rpx;
  }

  .basic-r-subtitle {
    width: 380rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 24rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: left;
    color: #999999;
    line-height: 33rpx;
    margin: 5rpx 0rpx 15rpx;
  }

  .basic-r-actions {
    display: flex;
    // justify-content: space-between;
  }
}

.basic-r-btn {
  width: 178rpx;
  height: 50rpx;
  text-align: center;
  background: linear-gradient(105deg, #ff6f50 0%, #ff008c 100%);
  border-radius: 10rpx;
  font-size: 24rpx;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  color: #ffffff;
  line-height: 50rpx;
}

.basic-r-btn + .basic-r-btn {
  margin-left: 54rpx;
}
</style>
