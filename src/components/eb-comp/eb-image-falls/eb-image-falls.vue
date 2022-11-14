<template>
  <view class="more-news">
    <waterfall
      :column-count="3"
      column-width="auto"
      class="waterfall-box"
    >
      <!-- 左侧 -->
      <view class="waterfall-column waterfall-column-left">
        <view
          v-for="(item, index) in wfList"
          :key="index"
        >
          <view
            v-if="index % 2 === 0"
            class="more-new-item-column"
          >
            <!-- 运营位 -->
            <view
              v-if="item.imgType === 2"
              class="recommend-wrap"
            >
              <operate-item
                :item="item"
                @click.native="programaAnalysis(params,item.imgId)"
                @openLoginPopup="openLoginPopup"
              />
            </view>
            <!-- 元素 -->
            <view
              v-else
              class="video-box-new"
            >
              <imageItem
                :item="item"
                :is-login="isLogin"
                :last-flag="index==wfList.length-1"
                @click.native="programaAnalysis(params,item.imgId)"
                @shareCountChange="shareCountChange"
                @openLoginPopup="openLoginPopup"
              />
            </view>
          </view>
        </view>
      </view>
      <!-- 右侧 -->
      <view class="waterfall-column">
        <view
          v-for="(item, index) in wfList"
          :key="index"
        >
          <view
            v-if="index % 2 !== 0"
            class="more-new-item-column"
          >
            <!-- 运营位 -->
            <view v-if="item.imgType === 2">
              <operate-item
                :item="item"
                @click.native="programaAnalysis(params,item.imgId)"
                @openLoginPopup="openLoginPopup"
              />
            </view>
            <!-- 元素 -->
            <view
              v-else
              class="video-box-new"
            >
              <imageItem
                :item="item"
                :is-login="isLogin"
                :last-flag="index==wfList.length-1"
                @click.native="programaAnalysis(params,item.imgId)"
                @shareCountChange="shareCountChange"
                @openLoginPopup="openLoginPopup"
              />
            </view>
          </view>
        </view>
      </view>
    </waterfall>
  </view>
</template>

<script>
import pictureService from "@/api/picture/index.js";
import operateItem from "./operateItem.vue";
import imageItem from "./imageItem.vue";
import {
  programaAnalysis,
} from "@/utils/common.js";
export default {
  components: {
    imageItem,
    operateItem,
  },
  props: {
    pageConfig: {
      type: Object,
      default: () => { },
    },
    isLogin: {
      type: Boolean,
      default () {
        return false;
      },
    },

  },
  data () {
    return {
      wfList: [],
      wfParams: {
        moduleId: "6",
      },
      total: 0, // 瀑布流总数据
      isLoadStatus: "more",
    };
  },
  created () {
    this.getWfList();
  },
  methods: {
    programaAnalysis,
    handleFresh () {
      this.getWfList();
    },
    getWfList () { // flag，true表示刷新或首次加载,false表示加载更多
      const wfParams = this.wfParams;
      wfParams.moduleId = this.pageConfig.moduleId;
      pictureService.getPictureList(wfParams).then(({
        data: res,
      }) => {
        if (res.code === 200) {
          this.wfList = [...res.data];
        }
      });
    },
    openLoginPopup () {
      this.$emit("openLoginPopup");
    },
    // 分享
    shareCountChange (item) {
      const temObj = {
        ...item,
      };
      temObj.shareCount = parseFloat(temObj.shareCount) + 1;
      this.wfList.forEach(item => {
        if (item.imgId === temObj.imgId) {
          item.shareCount = temObj.shareCount;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.more-news {
  width: 100%;
  padding: 0rpx 30rpx;
  box-sizing: border-box;
  // background: #F7F8FB !important;
  // background: linear-gradient(0deg, #FFFFFF 0%,#F7F8FB 0%);

  .waterfall-box {
    display: flex;

    .waterfall-column-left {
      margin-right: 18rpx;
    }

    .waterfall-column {
      // 竖屏
      .more-new-item-column {
        width: 334rpx;
        -webkit-column-break-inside: avoid;
        // background: #ffffff;
        // border-radius: 10px;
      }

      .more-new-item-column + .more-new-item-column {
        margin-top: 21rpx;
      }
    }
  }
}
</style>
