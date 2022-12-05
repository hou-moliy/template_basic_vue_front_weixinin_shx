<template>
  <view class="more-news">
    <!-- 数据展示瀑布流 -->
    <waterfall
      v-if="wfList.length"
      :column-count="3"
      column-width="auto"
      class="waterfall-box"
    >
      <!-- 左侧 -->
      <view class="waterfall-column waterfall-column-left">
        <view v-for="(item, index) in wfList" :key="index">
          <view v-if="index % 2 === 0" class="more-new-item-column">
            <!-- 运营位 -->
            <view v-if="item.imgType === 2" class="recommend-wrap">
              <operate-item
                :item="item"
                @click.native="programaAnalysis(params, item.imgId)"
                @openLoginPopup="openLoginPopup"
              />
            </view>
            <!-- 元素 -->
            <view v-else class="video-box-new">
              <spclItem
                :item="item"
                :is-login="isLogin"
                :last-flag="index == wfList.length - 1"
                inner-color="#9E79FF"
                :spcl-style="1"
                @click.native="programaAnalysis(params, item.imgId)"
                @shareVideo="shareCountChange"
                @giveLikes="likeCountChange"
                @purchaseVideo="purchaseVideo"
                @openLoginPopup="openLoginPopup"
                @goToPlayVideo="goToPlayVideo"
              />
            </view>
          </view>
        </view>
      </view>
      <!-- 右侧 -->
      <view class="waterfall-column">
        <view v-for="(item, index) in wfList" :key="index">
          <view v-if="index % 2 !== 0" class="more-new-item-column">
            <!-- 运营位 -->
            <view v-if="item.imgType === 2">
              <operate-item
                :item="item"
                @click.native="programaAnalysis(params, item.imgId)"
                @openLoginPopup="openLoginPopup"
              />
            </view>
            <!-- 元素 -->
            <view v-else class="video-box-new">
              <spclItem
                :item="item"
                :last-flag="index == wfList.length - 1"
                inner-color="#9E79FF"
                :spcl-style="1"
                @click.native="programaAnalysis(params, item.imgId)"
                @shareVideo="shareCountChange"
                @giveLikes="likeCountChange"
                @purchaseVideo="purchaseVideo"
                @openLoginPopup="openLoginPopup"
                @goToPlayVideo="goToPlayVideo"
              />
            </view>
          </view>
        </view>
      </view>
    </waterfall>
    <!-- 为空时 -->
    <view v-if="!loadShow && !wfList.length" class="no-data">
      <image
        class="no-record"
        :src="`${staticImgs}/shxmp/init/no-spcl-data.png`"
      />
      <view class="no-record-tips1">您当前没有点赞过任何视频彩铃</view>
      <view class="no-record-tips2">快去给你喜欢的视频彩铃点赞吧~</view>
      <view class="go-to-see" @click="goToCx">去试听</view>
    </view>
    <!-- 加载更多 -->
    <uni-load-more
      v-show="loadShow"
      class="loadingicon"
      icon-size="20"
      icon-type="circle"
      :status="isLoadStatus"
    />
    <!-- 提示性弹窗 -->
    <notifyPop ref="NotifyPop" />
    <!-- 视频彩铃订购相关弹窗 -->
    <popupTemplateOperition
      :popup-info="operitionInfo"
      :show="Boolean($store.state.window.operitionShow)"
      @buttonClick="operitionBtnClick"
      @closePopup="closePopup"
    />
  </view>
</template>

<script>
import operateItem from "@/components/eb-comp/eb-spcl-waterfalls/operateItem.vue";
import spclItem from "@/components/eb-comp/eb-spcl-waterfalls/spclItem.vue";
import SpclService from "@/api/spcl/index.js";
import { videoInfoUpdate, handlePurchaseVideo } from "@/utils/video";
import {
  programaAnalysis,
} from "@/utils/common.js";
export default {
  name: "MyLike",
  components: {
    spclItem,
    operateItem,
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      wfList: [],
      wfParams: {
        pageNum: 1,
        pageSize: 10,
        behaviorType: "dz",
      },
      total: 0, // 瀑布流总数据
      isLoadStatus: "loading",
      operitionInfo: {}, // 订购弹窗的内容
      operitionBtnClick: (e) => { }, // 订购弹窗按钮回调
      loadShow: true, // 是否展示load
    };
  },
  onLoad () {
    this.getWfList();
  },
  onShow () {
    this.dispatchPageEvent();
    this.$store.dispatch("spcl/getMyLikeVideoIdList").then(res => {
      this.updateData();
    });
  },
  onHide () {
    this.offMonitor();
  },
  // 滚动触底
  onReachBottom () {
    const curCount = this.wfList.length;
    if (curCount >= this.total) {
      // 没有数据了
      console.log("没数据了");
      return;
    }
    this.isLoadStatus = "loading";
    this.wfParams.pageNum++;
    this.getWfList(false);
  },
  methods: {
    programaAnalysis,
    // 跨页面通信监听
    dispatchPageEvent () {
      uni.$on("openLoginPopup", data => {
        this.$showLoginPop(this);
      });
      // 展示订购、设置类弹窗，按钮点击回调
      uni.$on("operitionShow", ({ popupInfo, btnClickCallBack = () => { } }) => {
        this.operitionInfo = popupInfo;
        this.$store.commit("window/SET_OPERITION_SHOW", true);
        this.operitionBtnClick = (e) => btnClickCallBack(e);
      });
    },
    // 移除监听
    offMonitor () {
      console.log("移除监听");
      uni.$off("openLoginPopup");
      uni.$off("operitionShow");
    },
    closePopup () {
      this.operitionInfo = {};
      this.$store.commit("window/SET_OPERITION_SHOW", false);
    },
    // 获取视频列表
    getWfList (flag = true) { // flag，true表示刷新或首次加载,false表示加载更多
      this.loadShow = true;
      const wfParams = this.wfParams;
      SpclService.getBehaviorList(wfParams).then(({
        data: res,
      }) => {
        if (res.code === 200) {
          let { records, total } = res.data;
          if (!total && !records.length) {
            this.loadShow = false;
          }
          this.total = total;
          const oldLen = this.wfList.length;
          records = videoInfoUpdate(records);
          if (flag) {
            this.wfList = [...records];
          } else {
            this.wfList.splice(oldLen, 0, ...records);
          }
          this.isLoadStatus =
            this.wfList.length >= total ? "nomore" : "more";
        }
      });
    },
    // 更新页面数据
    updateData () {
      const likeIds = this.$store.state.spcl.myLikeIds;
      const list = this.wfList.filter(wf => likeIds.find(id => id === wf.ringId));
      this.wfList = [...list];
    },
    // 展示登录弹窗
    openLoginPopup () {
      uni.$emit("openLoginPopup", { msg: "展示登录弹窗" });
    },
    // 分享
    shareCountChange (e) {
      const temObj = {
        ...e,
      };
      temObj.shareCount = parseFloat(temObj.shareCount) + 1;
      this.wfList.forEach(item => {
        if (item.imgId === temObj.imgId) {
          item.shareCount = temObj.shareCount;
        }
      });
      uni.navigateTo({
        url: `/pagesCommon/share/shareVideo?videoId=${e.ringId}&shareType=1`,
      });
    },
    // 点赞或取消点赞
    likeCountChange ({ ringId, flag }) { // false 新增点赞 ，true 取消点赞
      const data = {
        ringId,
        target: "dz",
        opType: flag ? 0 : 1,
      };
      this.$store.dispatch("spcl/handleSpclUserOperate", data).then(res => {
        if (res.code === 200) {
          this.$store.commit("spcl/UPDATE_MY_LIKE_IDS", ringId);
          this.updateData();
        } else {
          this.$toast(res.message);
        }
      });
    },
    // 设置视频彩铃
    purchaseVideo (e) {
      handlePurchaseVideo(e, this.setRingCallBack);
    },
    // 设置成功回调
    setRingCallBack () {
      this.wfList = videoInfoUpdate(this.wfList);
    },
    // 跳转视频彩铃播放页面
    goToPlayVideo (item) {
      uni.setStorageSync("isFromMyLike", true);
      this.$store.commit("spcl/getVedioListTalNum", this.total);
      this.$store.commit("spcl/M_changeVideoList", this.wfList);
      uni.navigateTo({
        url: `/pagesSpcl/clVideo/clVideoPlay?id=${item.ringId}`,
      });
    },
    // 去试听
    goToCx () {
      console.log("去试听");
    },
  },
};
</script>

<style lang="scss" scoped>
.more-news {
  width: 100%;
  min-height: 100vh;
  padding: 33rpx 30rpx 30rpx;
  box-sizing: border-box;
  background: #f5f7f9;

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
      }

      .more-new-item-column + .more-new-item-column {
        margin-top: 21rpx;
      }
    }
  }
  .title-wrap {
    display: flex;
    align-items: center;
    padding: 43rpx 0rpx 49rpx;
    .tag-icon {
      width: 38rpx;
      height: 36rpx;
      margin-right: 13rpx;
    }
    .title {
      font-size: 36rpx;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-align: left;
      color: #000000;
    }
  }
}
// 无数据时
.no-data {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 412rpx;
  image {
    width: 410rpx;
    height: 184rpx;
  }
  .no-record-tips1 {
    font-size: 32rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: #222222;
    margin-top: 94rpx;
  }
  .no-record-tips2 {
    font-size: 26rpx;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: center;
    color: #999999;
    margin-top: 22rpx;
  }
  .go-to-see {
    width: 260rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(-90deg, #ff83d9 0%, #9e79ff 100%);
    border-radius: 10rpx;
    font-size: 32rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    letter-spacing: 0.32rpx;
    margin-top: 40rpx;
  }
}
</style>
