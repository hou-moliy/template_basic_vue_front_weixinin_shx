<template>
  <view :class="['image-item',!lastFlag?'margin-style':'']">
    <image
      :src="item.imgUrl"
      alt=""
      @click="jumpToShare"
    />
    <view class="image-item-info">
      <view class="image-item-info__title">
        {{ item.imgTitle }}
      </view>
      <view class="image-item-info__btn">
        <button
          class="btn"
          data-type="image-share"
          :data-share-params="item"
          :open-type="isLogin?'share':''"
          @click="check"
        >
          <img
            :src="`${staticImgs}/lnmp/ln-find/find-share-black.png`"
            alt=""
          >
        </button>
        <span>{{ formatCount(item.shareCount) }}</span>
      </view>
    </view>
  </view>
</template>

<script>
import {
  formatCount,
} from "@/utils/tools.js";
import pictureService from "@/api/picture/index.js";

export default {
  name: "ImageItem",
  props: {
    item: {
      type: Object,
      default: () => { },
    },
    videoList: {
      type: Array,
      default: () => [],
    },
    isLogin: {
      type: Boolean,
      default () {
        return false;
      },
    },
    lastFlag: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
    };
  },
  computed: {

  },
  watch: {
    lastFlag: {
      handler () {

      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    formatCount,

    jumpToShare () {
      if (uni.getStorageSync("Authorization")) {
        uni.navigateTo({
          url: `/pagesC/liaoNingFind/views/imageShare/image-share?imgUrl=${this.item.imgUrl}&&shareImg=${this.item.shareUrl}&&imgId=${this.item.imgId}&&imgTitle=${this.item.imgTitle}`,
        });
      } else {
        this.$emit("openLoginPopup");
      }
    },
    check () {
      if (!this.isLogin) {
        this.$emit("openLoginPopup");
      } else {
        const params = {
          imgId: this.item.imgId,
          optType: "fx",
        };
        pictureService.addShareCount(params).then(res => {
          if (res.data.code === 200) {
            this.$analysis.dispatch("mgtp_fx_id", params.imgId);
            this.$emit("shareCountChange", this.item);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.image-item {
  width: 334rpx;
  height: 518rpx;
  background: #ffffff;
  border-radius: 20rpx;

  image {
    width: 100%;
    height: 445rpx;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    display: inline-block;
    vertical-align: top;
  }

  &-info {
    width: 100%;
    height: 73rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
    border-radius: 0 0 20rpx 20rpx;

    &__title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 80%;
      margin-left: 17rpx;
      font-size: 28rpx;
      color: #333333;
      white-space: nowrap;
    }

    &__btn {
      margin-right: 15rpx;
      display: flex;
      align-items: center;

      .btn {
        background: transparent;
        padding: 0;
        line-height: 0;

        img {
          width: 27rpx;
          height: 28rpx;
        }
      }

      span {
        margin-left: 10rpx;
        font-size: 24rpx;
        color: #999999;
      }
    }
  }
}
.margin-style {
  margin-bottom: 21rpx;
}
</style>
