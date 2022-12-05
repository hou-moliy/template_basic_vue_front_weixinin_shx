<template>
  <view :class="['uni-popup-dialog', isOpen ? 'uni-popup-dialog-open' : '']">
    <view v-if="isOpen" class="uni-dialog-top_view">
      <image
        class="uni-dialog-top_image"
        :src="`${staticImgs}/lnmp/vip_open_yp.png`"
      />
    </view>
    <view
      class="uni-dialog-top"
      :style="{ height: isOpen ? '308rpx' : '236rpx' }"
    >
      <view class="uni-dialog-title">
        <text
          class="uni-dialog-title-text"
          :class="['uni-popup__' + dialogType]"
        >
          {{ title }}
        </text>
      </view>
      <view
        :class="['uni-dialog-content', isOpen ? 'uni-dialog-content-open' : '']"
      >
        <text
          v-if="mode === 'base'"
          :class="[
            'uni-dialog-content-text',
            isOpen ? 'uni-dialog-content-text-open' : '',
          ]"
        >
          {{ content }}
        </text>
        <text
          v-else-if="mode === 'open'"
          :class="[
            'uni-dialog-content-text',
            isOpen ? 'uni-dialog-content-text-open' : '',
          ]"
        >
          音频彩铃业务标准资费
          <text style="color: #5e4827; font-weight: bold">5元/月</text>
          ,是否马上开通？开通彩铃畅享海量彩铃音乐，快来挑选你喜欢的音乐作为彩铃吧！
        </text>
        <input
          v-else
          v-model="val"
          class="uni-dialog-input"
          type="text"
          :placeholder="placeholder"
          :focus="focus"
        />
      </view>
      <view v-if="isOpen" class="uni-dialog-check">
        <view
          class="list-checkbox"
          :class="checked ? 'list-checked' : ''"
          @click="check"
        >
          <text v-if="checked" class="iconfont icon-xuanzhong" />
        </view>
        <view class="check-view-conten-text">
          已阅读并同意
          <view
            style="color: #3fc2fc; display: inline-block"
            @click="navicateToMusicOrderPolicy"
          >
            《订购协议》
          </view>
        </view>
      </view>
    </view>

    <view class="uni-dialog-button-group">
      <view class="uni-dialog-button" @click="close">
        <text class="uni-dialog-button-text">取消</text>
      </view>
      <view class="uni-dialog-button uni-border-left" @click="onOk">
        <text
          :class="[
            'uni-dialog-button-text uni-button-color',
            isOpen ? 'uni-dialog-content-ok-text-open' : '',
          ]"
        >
          {{ confirmConent }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
/**
   * PopUp 弹出层-对话框样式
   * @description 弹出层-对话框样式
   * @tutorial https://ext.dcloud.net.cn/plugin?id=329
   * @property {String} value input 模式下的默认值
   * @property {String} placeholder input 模式下输入提示
   * @property {String} type = [success|warning|info|error] 主题样式
   * @value success 成功
   * @value warning 提示
   * @value info 消息
   * @value error 错误
   * @property {String} mode = [base|input] 模式、
   * @value base 基础对话框
   * @value input 可输入对话框
   * @property {String} content 对话框内容
   * @property {Boolean} beforeClose 是否拦截取消事件
   * @event {Function} confirm 点击确认按钮触发
   * @event {Function} close 点击取消按钮触发
   */
import Util from "@/utils/tools.js";
export default {
  name: "UniPopupDialog",
  inject: ["popup"],
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    placeholder: {
      type: [String, Number],
      default: "请输入内容",
    },
    /**
       * 对话框主题 success/warning/info/error 默认 success
       */
    type: {
      type: String,
      default: "error",
    },
    /**
       * 对话框模式 base/input
       */
    mode: {
      type: String,
      default: "base",
    },
    /**
       * 对话框标题
       */
    title: {
      type: String,
      default: "提示",
    },
    /**
       * 对话框内容
       */
    content: {
      type: String,
      default: "",
    },
    /**
       * 对话框内容
       */
    confirmConent: {
      type: String,
      default: "确定",
    },
    /**
       * 拦截取消事件 ，如果拦截取消事件，必须监听close事件，执行 done()
       */
    beforeClose: {
      type: Boolean,
      default: false,
    },
    /**
       * 是否是开通弹窗
       */
    isOpen: {
      type: Boolean,
      default: false,
    },
    /**
       * 是否是开通弹窗
       */
    openType: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      dialogType: "error",
      focus: false,
      val: "",
      staticImgs: this.$staticImgs,
      checked: false,
    };
  },
  watch: {
    type (val) {
      this.dialogType = val;
    },
    mode (val) {
      if (val === "input") {
        this.dialogType = "info";
      }
    },
    value (val) {
      this.val = val;
    },
  },
  created () {
    // 重置勾选
    uni.$on("resetCheck", () => {
      this.checked = false;
    });
    // 对话框遮罩不可点击
    this.popup.mkclick = false;
    if (this.mode === "input") {
      this.dialogType = "info";
      this.val = this.value;
    } else {
      this.dialogType = this.type;
    }
  },
  mounted () {
    this.focus = true;
  },
  methods: {
    /**
       * 点击确认按钮
       */
    onOk () {
      console.log("121212");
      const orderClLogConfirmTime = Util.formatTimeTwo(new Date(), "Y-M-D h:m:s");
      uni.setStorageSync("orderClLogConfirmTime", orderClLogConfirmTime);
      this.$emit("confirm", () => {
        this.popup.close();
        if (this.mode === "input") this.val = this.value;
      }, this.mode === "input" ? this.val : "");
    },
    /**
       * 点击取消按钮
       */
    close () {
      if (this.beforeClose) {
        this.$emit("close", () => {
          this.popup.close();
        });
        return;
      }
      this.popup.close();
    },
    /**
       * 点击勾选
       */
    check () {
      this.checked = !this.checked;
      uni.$emit("isMusicOpenChecked", this.checked);
      // this.checked=false
    },
    /**
       * 跳转协议
       */
    navicateToMusicOrderPolicy () {
      uni.navigateTo({
        url: "/pagesCommon/policy/musicOrderPolicy",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.uni-popup-dialog {
  width: 560rpx;
  border-radius: 20rpx;
  background-color: #fff;
  height: 327rpx;
}

.uni-popup-dialog-open {
  height: 570rpx;
}

.uni-dialog-top {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.uni-dialog-title {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  padding-top: 15px;
  padding-bottom: 5px;
}

.uni-dialog-title-text {
  font-size: 36rpx;
  font-weight: 500;
}

.uni-dialog-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 15px 15px 15px;
  line-height: 40rpx;
}

.uni-dialog-content-text {
  font-size: 14px;
  color: #6e6e6e;
}

.uni-dialog-content-text-open {
  font-size: 26rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-weight: 500;
  text-align: center;
  color: #999999;
  width: 443rpx;
  height: 109rpx;
}

.uni-dialog-button-group {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}

.uni-dialog-button {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 88rpx;
}

.uni-border-left {
  border-left-color: #f0f0f0;
  border-left-style: solid;
  border-left-width: 1px;
}

.uni-dialog-button-text {
  font-size: 30rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-weight: 500;
  color: #999999;
}

.uni-button-color {
  font-family: PingFang SC Bold, PingFang SC Bold-Bold;
  font-weight: 700;
  background: linear-gradient(#ff6f50, #ff008c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.uni-dialog-input {
  flex: 1;
  font-size: 14px;
}

.uni-popup__success {
  color: $uni-color-success;
}

.uni-popup__warn {
  color: $uni-color-warning;
}

.uni-popup__error {
  color: $uni-color-error;
}

.uni-popup__info {
  // color: #909399;
  color: black;
  font-weight: bold;
}

.uni-dialog-top_view {
  height: 171rpx;
  background-image: linear-gradient(#fbdda5, #eac488);
  padding-top: 0rpx;
  display: flex;
  justify-content: center;
  border-radius: 20rpx 20rpx 50% 50%;
}

.uni-dialog-top_image {
  width: 182rpx;
  height: 125rpx;
  display: block;
  padding-top: 46rpx;
}

.uni-dialog-content-ok-text-open {
  font-family: PingFang SC Bold, PingFang SC Bold-Bold;
  font-weight: 700;
  background: linear-gradient(#5e4827, #5e4827);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.uni-dialog-check {
  display: flex;
  margin-top: 18rpx;
  margin-bottom: 45rpx;
  // justify-content: center;
  padding-left: 50rpx;
}

.list-checkbox {
  background-color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 30rpx;
  width: 30rpx;
  height: 30rpx;
  border: 1rpx solid #a6a6a6;
  box-sizing: border-box;
  margin-right: 10rpx;
  box-sizing: border-box;
}

.list-checked {
  border: none;
  width: 30rpx;
  height: 30rpx;
}

.iconfont {
  font-size: 30rpx;
  color: #a9854a;
}

.check-view-conten-text {
  display: inline-block;
  font-size: 22rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-weight: 500;
  color: #333333;
}
</style>
