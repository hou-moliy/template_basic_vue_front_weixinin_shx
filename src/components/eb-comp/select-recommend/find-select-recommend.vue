<template>
  <!-- 业务推荐组件 -->
  <view
    v-if="list&& list.length"
    class="select-wrap"
    :style="{marginTop}"
  >
    <view class="select-title">
      业务推荐
    </view>
    <view
      v-for="(item,index) in list.slice(0,len)"
      :key="index"
      class="select-item"
    >
      <find-recommend-basic
        :item="item"
        @openLoginPopup="openLoginPopup"
        @handleBtn="handleBtn"
      />
    </view>
    <view
      v-if=" list&&list.length>3"
      class="look-more-btn"
      @click="getMore(btnType)"
    >
      {{ btnType ? '查看更多 >>':'收起 >>' }}
    </view>

    <!-- 订购弹窗 -->
    <uni-popup
      ref="popup_open_status"
      type="dialog"
    >
      <view v-if="purchasePopupConfig">
        <common-purchase-popup
          :params="purchasePopupConfig"
          @confirm="handleConfirm"
        />
      </view>
    </uni-popup>
    <!-- 业务订购失败，成功弹窗 -->
    <orderPopup
      v-if="orderOpenFlag"
      :order-info-obj="orderInfoObj"
      :window-type="windowType"
      :window-type-index="windowTypeIndex"
      @orderPopupCancel="orderPopupCancel"
      @order="orderBusiness"
      @navigateToEventUrl="navigateToEventUrl"
    />
  </view>
</template>

<script>
import businessService from "@/api/business/index.js";
import analysisService from "@/api/analysis/analysis.js";
import {
  formatTimeTwo,
  navigateToAny,
} from "@/utils/tools.js";
export default {
  name: "FindSelectRecommend",
  props: {
    marginTop: {
      type: String,
      default: "0rpx",
    },
    params: {
      required: true,
    },
  },
  data () {
    return {
      size: "", // 展示几条数据
      list: [], // 推荐列表
      btnType: 1, // 1展示查看更多，0展示收起
      purchasePopupConfig: null, // 弹窗需要的参数
      curItem: null, // 当前点击的是item
      orderOpenFlag: false, // 业务订购失败成功弹窗展示
      orderInfoObj: {}, //
      simplePopupFlag: false,
      windowType: 1,
      windowTypeIndex: -1,
      len: 3, // 默认展示几个
    };
  },
  created () {
    this.getList(this.size);
  },
  methods: {
    openLoginPopup () {
      this.$emit("openLoginPopup");
    },
    // 获取推荐数据
    async getList (size) {
      const params = {
        ...this.params,
        size,
      };
      await businessService.getBusinessRecommend(params).then(({
        data: res,
      }) => {
        if (res.code === 200) {
          this.list = res.data;
        }
      });
    },
    getMore (btnType) {
      const allLen = this.list.length;
      if (allLen > 3) {
        this.len = btnType === 1 ? allLen : 3;
      }
      btnType ? (this.btnType = 0) : (this.btnType = 1);
    },
    // 点击按钮，type=1查看详情，2订购
    handleBtn ({
      type,
      item,
    }) {
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
        return;
      }
      this.curItem = item;
      if (type === 1) {
        this.$analysis.dispatch("spxq_ywxq_id", item.businessId);
        const url = `/pagesB/disanjidu/business/businessDetail?id=${item.businessId}`;
        uni.navigateTo({
          url,
          fail: function (error) {
            console.log(error);
          },
        });
      } else {
        this.windowType = 1;
        this.purchasePopupConfig = this.handlePopData(this.windowType);
        this.$refs.popup_open_status.open();
        const startTime = formatTimeTwo(new Date(), "Y-M-D h:m:s");
        uni.setStorageSync("orderClLogStartTime", startTime);
      }
    },
    // 处理订购
    handleConfirm () {
      const {
        serId,
        businessId,
      } = this.curItem;
      uni.showLoading({
        title: "请稍等...",
      });
      businessService.bOrder({
        serId,
        businessId,
      }).then(({
        data: res,
      }) => {
        this.orderInfoObj = this.curItem;
        uni.hideLoading();
        this.$refs.popup_open_status.close();
        switch (res.code) {
          case 200:
            this.$analysis.dispatch("spxq_ywdg_id", businessId);
            this.sendOrderRecordLog(0, serId);
            console.log("item", this.curItem);
            this.windowTypeIndex = this.curItem.portalWindows.findIndex(item => item.windowType ==
              res.data.windowType);
            if (res.data.windowType == 4) {
              this.sendOrderRecordLog(0, serId);
            } else {
              this.sendOrderRecordLog(1, serId);
            }
            break;
          case 500:
            this.sendOrderRecordLog(1, serId);
            this.windowTypeIndex = this.curItem.portalWindows.findIndex(item => item.windowType ==
              res.data.windowType);
            break;
          default:
            break;
        }
        this.orderOpenFlag = true;
      });
    },
    // 记录ftp日志
    sendOrderRecordLog (value, serId) {
      const createTime = formatTimeTwo(new Date(), "Y-M-D h:m:s");
      const orderLogParams = {
        type: 1,
        reWay: 4,
        ncode: serId,
        startTime: uni.getStorageSync("orderClLogStartTime"),
        confirmTime: uni.getStorageSync("orderClLogConfirmTime"),
        createTime,
        result: value,
      };
      analysisService.getOrderLog(orderLogParams).then();
    },
    // 弹窗关闭
    orderPopupCancel () {
      this.orderOpenFlag = false;
      this.orderInfoObj = {};
      this.windowType = 1;
    },
    // 处理弹窗需要的数据
    handlePopData (windowType) {
      const index = this.curItem.portalWindows.findIndex(portal => portal.windowType === windowType);
      if (index !== -1) {
        return this.curItem.portalWindows[index];
      }
    },
    // 再次订阅
    orderBusiness () {
      this.orderPopupCancel();
      this.handleBtn({
        type: 2,
        item: this.curItem,
      });
    },
    // 订购跳转
    navigateToEventUrl (item) {
      this.orderOpenFlag = false;
      navigateToAny(item);
    },

  },
};
</script>

<style lang="scss" scoped>
.select-wrap {
  width: 100%;
  padding: 0rpx 0rpx 0rpx 33rpx;
  box-sizing: border-box;
}

.select-title {
  font-size: 36rpx;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  text-align: left;
  color: #333333;
  line-height: 59rpx;
}

.select-item + .select-item {
  border-top: 1px solid #e5e5e5;
}

.look-more-btn {
  width: 686rpx;
  height: 66rpx;
  line-height: 66rpx;
  background: #f7f6f9;
  border-radius: 10rpx;
  margin: 25rpx auto 0;
  font-size: 26rpx;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: center;
  color: #666666;
}
</style>
