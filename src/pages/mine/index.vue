<template>
  <view class="content">
    <view class="login-top" :style="{ height: loginBoxHeight + 'rpx' }">
      <view
        class="custom-tab"
        :style="{
          background: `url(${staticImgs}/shxmp/init/search-bg.png) center/cover no-repeat`,
          height: loginBoxHeight + 'rpx',
        }"
      >
        <view
          class="custom-tab-title"
          :style="{
            paddingTop: pointobj.top + 'px',
            lineHeight: pointobj.height + 'px',
          }"
        >
          我的
        </view>
        <!-- 头部 -->

        <view class="login-top-box" @click="isLogin()">
          <view class="txbox">
            <view v-if="loginFlag && isAuth" class="userinfo-avatar">
              <image :src="userInfo.avatarUrl" />
            </view>
            <image v-else :src="avatarUrl" />
          </view>
          <view class="tx-content">
            <view v-if="loginFlag && isAuth" class="tx-content-nickname">
              {{ userInfo.nickName }}
            </view>
            <button v-else-if="!loginFlag">
              {{ nickName }}
            </button>
            <text v-if="phoneNumber && isAuth" class="tx-content-text">
              <text class="tx-content-text">({{ phoneNumber }})</text>
            </text>
            <text v-else-if="phoneNumber && !isAuth" class="tx-content-text">
              <text class="tx-content-text">
                {{ phoneNumber }}
              </text>
            </text>
          </view>
        </view>
        <view class="cx-des">
          <view
            class="login-bottom-box"
            style="margin-top: 26rpx; display: flex; align-items: center"
          >
            <view style="width: 92%; display: flex; align-items: center">
              <image
                class="sign"
                :src="`${staticImgs}/shxmp/init/sp-icon.png`"
              />
              <text class="title">我的视彩：</text>
              <text
                v-if="!loginFlag"
                class="content"
                @click="navigateToLogin()"
              >
                登录后显示
              </text>
              <text v-else class="content" @click="navigateToEditForAll('sp')">
                {{ cxVideoContent }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- iconList -->
    <view class="my-iconlist">
      <text class="my-iconlist-title">我的铃音库</text>
      <eb-icon-list
        :page-config="{ pageName: 'default-mine' }"
        @openLoginPopup="openLoginPopup"
        @open="open"
      />
      <!-- 更多功能 -->
    </view>
    <!-- 更多功能 -->
    <view class="bottom-box">
      <text class="more-tips">更多功能</text>
      <view
        v-for="(item, index) in functionList"
        :key="index"
        class="fl-cell"
        @click="navigateToFunction(item)"
      >
        <view class="fl-cell-left">
          <image :src="item.iconUrl" class="cell-icon-title" />
        </view>
        <view class="fl-cell-right">
          <view class="cell-desc">
            {{ item.iconTitle }}
          </view>
          <image
            :src="`${staticImgs}/shxmp/init/more-icon.png`"
            class="cell-icon-end"
          />
        </view>
      </view>
    </view>
    <view :style="{ height: '82px', width: '100%' }" />

    <!-- 自定义Tabbar -->
    <custom-tabbar :tab-bar="tabBar" :mid-button="true" />
    <!-- 提示性弹窗 -->
    <notifyPop ref="NotifyPop" />
    <!--退出登录 -->
    <uni-popup ref="popup_login_out" type="dialog" :mask-click="false">
      <view class="login-out">
        <view class="login-out-sure" @click="loginOut()">退出登录</view>
        <view class="login-out-cancel" @click="cancel()">取消</view>
      </view>
    </uni-popup>
    <!-- 确认退出 -->
    <uni-popup ref="popup_login_confirm" type="dialog" :mask-click="false">
      <view class="login-out-confirm">
        <view class="login-out-confirm-qs">确认退出吗？</view>
        <view class="login-out-confirm-button">
          <view class="login-out-confirm-cancel" @click="confirmCancel()">
            取消
          </view>
          <view class="login-out-confirm-sure" @click="confirmLoginOut()">
            确认
          </view>
        </view>
      </view>
    </uni-popup>
    <!-- 下线通知 -->
    <offline-popup
      v-if="Boolean($store.state.offlinePopup.offlinePopupShow)"
      ref="offlinePopup"
    />
    <!-- 开通视彩弹窗 -->
    <popupTemplateOperition
      :popup-info="popupInfo"
      :show="show"
      @buttonClick="operitionBtnClick"
      @closePopup="closeOperitionPopup"
    />
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import popupTemplateOperition from "../../components/popup-module/popup-template-operition.vue";
import { navigateToAny } from "@/utils/navigateToAny.js";
import SpclService from "@/api/spcl/index";
export default {
  name: "Index",
  components: {
    uniPopup,
    popupTemplateOperition,
  },
  data () {
    return {
      tabBar: this.$store.getters.tabbarList,
      staticImgs: this.$staticImgs,
      pointobj: {},
      avatarUrl: `${this.globalData.staticImgs}/shxmp/init/avater_def.png`,
      nickName: "未登录",
      loginBoxHeight: 0,
      //   UserCyMsg: {},
      phoneNumber: "",
      loginFlag: false,
      isAuth: false,
      cxMusicStatus: 0, // 0未开通   1已开通 未设置 2 已开通 并设置
      cxMusicContent: "",
      cxVideoStatus: 0, // 0未开通   1已开通 未设置 2 已开通 并设置
      cxVideoContent: "",
      //   purchaseIndexIsShow: false,
      btnType: "",
      loginOutConfirmStatus: false,
      functionList: [], // 更多功能列表
      userInfo: {},
      popupInfo: {}, // 订购弹窗的内容
      show: false, // 订购弹窗的展示控制
      errFlg: null, // 获取铃音失败flag
    };
  },
  onLoad () {
    this.pointobj = uni.getMenuButtonBoundingClientRect();
    this.loginBoxHeight = (this.pointobj.top + 153) * 2;
  },
  onHide () {
    this.offMonitor();
  },
  onShow () {
    this.dispatchPageEvent();
    uni.hideTabBar();
    if (uni.getStorageSync("Authorization")) {
      this.loginFlag = true;
      this.isAuth = uni.getStorageSync("isAuth");
      this.userInfo = uni.getStorageSync("userInfo");
      const phone = uni.getStorageSync("phone");
      if (phone && phone.length === 11) {
        this.phoneNumber = phone.substring(0, 3) + "****" + phone.substring(7);
      }
    } else {
      this.loginFlag = false;
      this.isAuth = false;
      this.nickName = "未登录";
      this.phoneNumber = "";
    }
    // 更新用户信息
    this.updateUserInfo();
    // 获取我的更多功能
    this.getMyMore();
    // 获取我的喜欢
    this.$store.dispatch("spcl/getMyLikeVideoIdList");
  },
  methods: {
    // 移除监听
    offMonitor () {
      console.log("移除监听");
      uni.$off("openLoginPopup");
      uni.$off("operitionShow");
      uni.$off("changeAi");
    },
    navigateToFunction (item) {
      // 判断用户是否登录 否 提示弹窗 是 调用navgatertoany
      if (uni.getStorageSync("Authorization")) {
        console.log(item);
        navigateToAny(item);
      } else {
        this.$showLoginPop(this);
      }
    },
    // 根据开通状态打开订购弹窗或跳转页面
    async judgeStatusOperation (statusFlag, targetId, e) { // 未开通   1已开通 未设置 2 已开通 并设置
      uni.showLoading({
        title: "",
        mask: true,
      });
      await this.$store.dispatch("offlinePopup/getCustomorderList", targetId).then(() => {
        // 配置了策略
        if (this.store.state.offlinePopup.loginShow) {
          return uni.$emit("openLoginPopup", { msg: "展示登录弹窗" });
        }
        if (this.store.state.offlinePopup.offlineFlag) { // 展示下线弹窗
          return;
        }
        this.statusOperation(statusFlag, e);
      }).catch(() => {
        // 未配置策略
        if (!uni.getStorageSync("Authorization")) {
          this.$showLoginPop(this);
        }
        this.statusOperation(statusFlag, e);
      });
      uni.hideLoading();
    },
    // 状态操作
    statusOperation (statusFlag, e) {
      // 未开通
      if (!statusFlag) {
        this.show = true;
        this.popupInfo = this.$store.state.window.windowAllObj.common_spcl_open;
      } else {
        uni.setStorageSync("userCyMsg", e);
        uni.switchTab({
          url: "/pages/cl/index",
        });
      }
    },
    // 跳转至编辑页面
    async navigateToEditForAll (e) {
      // cxVideoStatus:0,//0未开通   1已开通 未设置 2 已开通 并设置
      if (e === "sp") {
        console.log("sp", this.cxVideoStatus);
        this.judgeStatusOperation(this.cxVideoStatus, "wdsc", e);
      } else {
        this.judgeStatusOperation(this.cxMusicStatus, "wdcl", e);
      }
    },
    // 点击订购弹窗
    operitionBtnClick (e) {
      if (e.btnInfo.type === 1) { // 关闭弹窗
        this.closePopup();
      } else if (e.btnInfo.type === 2) { // 订购
        this.handleOpenSpcl(e);
      }
    },
    // 开通视频彩铃
    handleOpenSpcl (e) {
      SpclService.openSpcl({ servType: "001" }).then(res => {
        if (res.data.code === 200) {
          if (e.protocolCheckFlag) { // 勾选了AI换铃
            this.handleOpenAi();
          } else {
            this.$toast("成功开通视频彩铃业务");
            this.show = false;
            this.cxVideoContent = "立即设置";
            this.cxVideoStatus = 1;
            this.$store.commit("user/SET_SPCL_STATUS", 1);
          }
        } else {
          this.$toast("开通失败请重试");
        }
      });
    },
    // 开通AI换铃
    handleOpenAi () {
      SpclService.openAi({ type: 2 }).then(res => {
        if (res.data.code === 200) {
          this.$toast("成功开通视频彩铃业务");
          this.show = false;
          this.cxVideoContent = "立即设置";
          this.cxVideoStatus = 1;
          this.$store.commit("user/SET_SPCL_STATUS", 1);
        }
      });
    },
    // 关闭开通弹窗
    closeOperitionPopup () {
      this.show = false;
    },
    updateUserInfo () {
      // 判断用户是否登录过
      if (uni.getStorageSync("Authorization")) {
        // 查询是否开通数据，视频
        this.handleIsOpen();
      } else {
        this.nickName = "未登录";
        this.loginFlag = false;
        this.phoneNumber = "";
        this.isAuth = false;
      }
    },
    async handleIsOpen () {
      await this.$store.dispatch("user/getUserSpclStatus").then((res) => {
        // 已开通，订购
        if (res) {
          if (uni.getStorageSync("userSpclData")[0] && uni.getStorageSync("userSpclData")[0]
            .vrbtResponse) {
            // 随机展示铃音
            this.randomSpclVideo();
          } else if (uni.getStorageSync("failSpcl")) {
            // 获取铃音接口失败
            this.cxVideoContent = "获取用户铃音失败";
            this.cxVideoStatus = 1;// 让其跳转到彩铃页面
          } else {
            this.cxVideoContent = "立即设置";
            this.cxVideoStatus = 1;
          }
        } else {
          this.cxVideoContent = "立即开通";
          this.cxVideoStatus = 0;
        }
      });
    },
    // 随机展示铃音
    randomSpclVideo () {
      const isBuyVideoListTemp = uni.getStorageSync("userSpclData")[0].vrbtResponse.filter(
        item => {
          return uni.getStorageSync("userSpclData")[0].vrbtSettingRes
            .findIndex(v => (v === item.ringId && item.hidden !== 1)) > -1;
        });
      const isBuyVideoList = [];
      isBuyVideoListTemp.forEach(v => {
        isBuyVideoList.push(v.ringId);
      });
      if (isBuyVideoList.length) {
        const n = Math.floor(Math.random() * isBuyVideoList.length);
        const currentRingId = isBuyVideoList[n];
        // 根据ID请求详情
        SpclService.getSpclVideoDetail({
          ringId: currentRingId,
        }).then(res => {
          if (res.data.code === 200) {
            this.cxVideoContent = res.data.data
              ? res.data.data.ringName
              : "";
            this.cxVideoStatus = 2;
          } else {
            this.cxVideoContent = "立即设置";
            this.cxVideoStatus = 1;
          }
        });
      } else {
        this.cxVideoContent = "立即设置";
        this.cxVideoStatus = 1;
      }
    },
    getMyMore () {
      SpclService.getSpclIcon({
        target: "myMore",
      }).then(res => {
        if (res.data.code === 200) {
          this.functionList = [...res.data.data];
        }
      });
    },
    // 是否登录
    isLogin () {
      if (this.loginFlag) {
        this.$refs.popup_login_out.open();
        uni.hideTabBar();
      } else {
        uni.navigateTo({
          url: "/pages/mine/login",
          fail (res) {
            console.log("res", res);
          },
        });
      }
    },
    // 退出登录
    loginOut () {
      this.loginOutConfirmStatus = true;
      this.$refs.popup_login_confirm.open();
      this.$refs.popup_login_out.open();
    },
    cancel () {
      this.$refs.popup_login_out.close();
      uni.hideTabBar();
    },
    confirmCancel () {
      this.$refs.popup_login_confirm.close();
      this.$refs.popup_login_out.close();
      uni.hideTabBar();
    },
    confirmLoginOut () {
      // 登出数据重置
      this.$refs.popup_login_confirm.close();
      this.$refs.popup_login_out.close();
      uni.removeStorageSync("Authorization");
      uni.removeStorageSync("userInfo");
      uni.removeStorageSync("phone");
      uni.removeStorageSync("token");
      uni.removeStorageSync("userSpclData");
      uni.removeStorageSync("isAuth");
      uni.removeStorageSync("openid");
      uni.removeStorageSync("unionid");
      uni.removeStorageSync("aiStatus");
      uni.removeStorageSync("spclStatus");
      uni.removeStorageSync("myLikeIds");
      uni.removeStorageSync("failSpcl");
      uni.removeStorageSync("userCyMsg");
      this.$refs.popup_login_out.close();
      const moreVideoListTemp = this.$store.state.spcl.moreVideoList;
      moreVideoListTemp.forEach(item => {
        item.isBuyVideo = false;
        if (item.extraInfo.like) {
          item.extraInfo.like = false;
        }
      });
      this.$store.commit("spcl/getMoreVideoList", moreVideoListTemp);
      this.$store.commit("spcl/SET_USER_SPCL_DATA", {});
      this.$store.commit("spcl/M_changeVideoList", []);
      this.$store.commit("spcl/getVideoLabelId", -1);
      this.$store.commit("spcl/getVedioListTalNum", 0);
      this.$store.commit("spcl/getMoreVideoList", []);
      this.$store.commit("spcl/getMyLikeVideoList", []);
      this.$store.commit("spcl/getVideoListFromCxVideoType", []);
      this.$store.commit("spcl/getSearchList", []);
      this.loginFlag = false;
      this.phoneNumber = "";
      uni.hideTabBar();
    },
    navigateToLogin () {
      // 提示登录弹窗
      this.$showLoginPop(this);
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
<style>
page {
  background-color: #f5f7f9;
}
</style>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .content-box {
    flex: 1;
  }
}

.login-top {
  width: 100%;
  background-color: #fff;
}
.my-iconlist {
  width: 688rpx;
  background: #ffffff;
  border-radius: 20rpx;
  margin-top: 24rpx;
  padding-top: 42rpx;
}
.my-iconlist-title {
  height: 36rpx;
  font-size: 36rpx;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  text-align: left;
  color: #000000;
  line-height: 36rpx;
  margin-left: 25rpx;
  margin-bottom: 20rpx;
  display: inline-block;
}

.custom-tab {
  // height: 446rpx;
  width: 100%;
  text-align: center;
  .custom-tab-title {
    font-family: PingFang SC, PingFang SC-Bold;
    font-size: 36rpx;
    font-weight: 700;
  }
}
.sign {
  vertical-align: middle;
  width: 34rpx;
  height: 30rpx;
  margin-right: 15rpx;
  flex-shrink: 0;
}
button::after {
  border: none;
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

.login-top-box {
  padding-top: 37rpx;
  display: flex;
  align-items: center;

  .tx-content {
    margin-left: 25rpx;
    display: flex;
    align-items: center;

    .tx-content-nickname {
      max-width: 280rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: bold;
      font-size: 40rpx;
      color: #252a3e;
      font-family: PingFang SC, PingFang SC-Heavy;
      background: unset;
      vertical-align: middle;
    }

    .tx-content-text {
      font-size: 40rpx;
      font-family: PingFang SC, PingFang SC-Heavy;
      text-align: left;
      color: #252a3e;
      line-height: 59rpx;
    }
  }
}

.login-top-box text {
  font-size: 28rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-weight: 500;
  text-align: left;
  color: #ffffff;
}

.login-top-box button {
  font-size: 40rpx;
  font-family: PingFang SC, PingFang SC-Heavy;
  font-weight: 800;
  background: unset;
  vertical-align: middle;
  padding-left: 5rpx;
  color: #252a3e;
}
.txbox {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-left: 30rpx;

  .userinfo-avatar {
    overflow: hidden;
    display: block;
    border-radius: 50%;
    width: 120rpx;
    height: 120rpx;
  }
}

.txbox image {
  vertical-align: middle;
  width: 100%;
  height: 100%;
  display: inline-block;
  border-radius: 50upx;
}

.login-out {
  position: fixed;
  bottom: 90rpx;
  left: 0rpx;

  .login-out-sure {
    width: 620rpx;
    margin-left: 65rpx;
    text-align: center;
    // border-radius: 550rpx;
    background: #fff;
    font-size: 30rpx;
    height: 90rpx;
    line-height: 90rpx;
    color: #8b6cf0;
    border-radius: 45rpx;
    border-bottom: 1rpx solid #e5e5e5;
  }

  .login-out-cancel {
    border-radius: 45rpx;
    width: 620rpx;
    margin-left: 65rpx;
    text-align: center;
    background: #fff;
    font-size: 30rpx;
    height: 90rpx;
    line-height: 90rpx;
    color: #000;
    margin-top: 30rpx;
  }
}

.login-out-confirm {
  position: fixed;
  width: 560rpx;
  height: 260rpx;
  top: 560rpx;
  left: 95rpx;
  background: white;
  border-radius: 20rpx;

  .login-out-confirm-qs {
    height: 170rpx;
    line-height: 169rpx;
    text-align: center;
    border-bottom: 1rpx solid #e5e5e5;
    color: #666666;
    font-size: 32rpx;
    font-weight: 500;
    font-family: PingFang SC Medium;
  }

  .login-out-confirm-button {
    display: flex;
    width: 560;
    height: 89rpx;

    .login-out-confirm-cancel {
      width: 279rpx;
      border-right: 1rpx solid #e5e5e5;
      height: 89rpx;
      line-height: 89rpx;
      text-align: center;
      color: #999999;
      font-weight: 500;
      font-size: 30rpx;
      font-family: PingFang SC Medium;
    }

    .login-out-confirm-sure {
      width: 280rpx;
      height: 89rpx;
      line-height: 89rpx;
      text-align: center;
      font-size: 30rpx;
      font-family: PingFang SC Bold;
      font-weight: 700;
      background: #8b6cf0;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
// 登录底部
.login-bottom-box {
  // padding-bottom: 35rpx;
  width: 90%;
  margin: 0 auto;

  .edit-box {
    display: inline-block;
    margin-left: 20rpx;

    .edit {
      width: 30rpx;
      height: 30rpx;
      vertical-align: middle;
    }
  }
}

.login-bottom-box .title {
  display: inline-block;
  width: 150rpx;

  font-size: 28rpx;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: left;
  color: #767b93;
  flex-shrink: 0;
}

.login-bottom-box .content {
  display: inline-block;
  font-size: 28rpx;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  text-align: left;
  color: #252a3e;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// 更多功能
.bottom-box {
  width: 688rpx;
  // height: 712rpx;
  background: #ffffff;
  border-radius: 20rpx;
  // margin-left: 30rpx;
  margin-top: 24rpx;
  padding: 42rpx 0;

  .more-tips {
    height: 36rpx;
    font-size: 36rpx;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    text-align: left;
    color: #000000;
    line-height: 36rpx;
    margin-left: 25rpx;
    margin-bottom: 20rpx;
    display: inline-block;
  }

  .fl-cell {
    height: 100rpx;
    line-height: 100rpx;
    display: flex;
    align-items: center;

    &-left {
      display: flex;
      align-items: center;

      .cell-icon-title {
        width: 48rpx;
        height: 48rpx;
        display: inline-block;
        margin-left: 27rpx;
        vertical-align: middle;
      }
    }

    &-right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 25rpx;
      flex: 1;
      border-bottom: 1px solid #e5e5e5;

      .cell-desc {
        margin-left: 20rpx;
        display: inline-block;
        font-size: 30rpx;
        font-family: PingFang SC Medium, PingFang SC Medium-Medium;
        font-weight: 500;
        text-align: center;
        color: #666666;
        letter-spacing: 0rpx;
        vertical-align: middle;
      }
      .cell-desc2 {
        font-size: 24rpx;
        font-family: PingFang SC Medium, PingFang SC Medium-Medium;
        font-weight: 500;
        text-align: right;
        color: #999999;
        line-height: 29rpx;
        letter-spacing: 0rpx;
        vertical-align: middle;
        display: inline-block;
        margin-right: 15rpx;
      }

      .cell-icon-end {
        vertical-align: middle;
        display: inline-block;
        width: 15rpx;
        height: 27rpx;
      }
    }
  }
}
</style>
