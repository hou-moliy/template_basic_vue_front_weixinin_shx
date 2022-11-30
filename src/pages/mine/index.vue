<template>
  <view
    class="content"
    :style="{
      height: `${windowHeight}px`,
    }"
  >
    <view class="login-top" :style="{ height: loginBoxHeight + 'px' }">
      <view
        class="custom-tab"
        :style="{
          background: `url(${staticImgs}/shxmp/init/search-bg.png) center/cover no-repeat`,
          height: loginBoxHeight + 'px',
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
            style="
              margin-top: 25rpx;
              display: flex;
              align-items: center;
              padding-bottom: 0rpx;
            "
          >
            <view style="width: 92%; display: flex; align-items: center">
              <image
                class="sign"
                :src="`${staticImgs}/shxmp/init/yp-icon.png`"
              />
              <text class="title">我的彩铃：</text>
              <text
                v-if="!loginFlag"
                class="content"
                @click="navigateToLogin()"
              >
                登录后显示
              </text>
              <text v-else class="content" @click="navigateToEditForAll('cl')">
                {{ cxMusicContent }}
              </text>
            </view>
            <view class="edit-box">
              <image
                v-if="loginFlag && cxMusicStatus === 2"
                class="edit"
                :src="`${staticImgs}/lnmp/edit.png`"
                @click="navigateToEditForAll('cl')"
              />
            </view>
          </view>

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
            <view class="edit-box">
              <image
                v-if="loginFlag && cxVideoStatus === 2"
                class="edit"
                :src="`${staticImgs}/lnmp/edit.png`"
                @click="navigateToEditForAll('sp')"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
    <eb-icon-list :page-config="{ pageName: 'sell_default-mine' }" />
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
    <!-- 自定义Tabbar -->
    <custom-tabbar :tab-bar="tabBar" :mid-button="true" />
    <!-- 提示性弹窗 -->
    <notifyPop ref="NotifyPop" />
  </view>
</template>

<script>
import videoService from "@/api/cx/video.js";

export default {
  name: "Index",
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
      //   popTit: "温馨提示",
      //   loginCont: "您还没有登录，请先完成登录",
      //   login_confirm_content: "前往登录",
      //   wangpanTit: "温馨提示",
      //   wangpanCont: "即将打开“和彩云”小程序",
      //   wangpan_confirm_content: "允许",
      isAuth: false,
      cxMusicStatus: 0, // 0未开通   1已开通 未设置 2 已开通 并设置
      cxMusicContent: "",
      cxVideoStatus: 0, // 0未开通   1已开通 未设置 2 已开通 并设置
      cxVideoContent: "",
      //   purchaseIndexIsShow: false,
      //   btnType: "",
      //   loginOutConfirmStatus: false,
      //   iconList: [],
      //   isMusicOpenChecked: false,
      //   isBuyList: [],
      functionList: [], // 更多功能列表
      userInfo: {},
      windowsWidth: 0, // 可使用窗口宽度
      windowHeight: 0, // 可使用窗口高度
    };
  },
  onLoad () {
    this.pointobj = uni.getMenuButtonBoundingClientRect();
    this.loginBoxHeight = this.pointobj.top + 203;
    this.getPageWidthHeight();
  },
  onShow () {
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
    // this.updateUserInfo();
    // 获取我的更多功能
    this.getMyMore();
  },
  methods: {
    // 初始化页面样式宽高等
    getPageWidthHeight () {
      uni.getSystemInfo({
        success: res => {
          console.log("bar", res);
          if (res.safeAreaInsets.bottom === 0) {
            this.windowHeight = res.windowHeight;
            // this.navHeight = res.safeArea.top;
          } else {
            this.windowHeight = res.safeArea.height;
            // this.navHeight = res.safeArea.top / 2;
          }
          this.navHeight = res.safeArea.top;
          this.windowsWidth = res.windowWidth;
        },
      });
    },
    navigateToFunction (item) {
      // 判断用户是否登录 否 提示弹窗 是 调用navgatertoany

    },
    updateUserInfo () {
      // 判断用户是否登录过
      if (uni.getStorageSync("Authorization")) {
        // 查询是否开通数据
        // 视频
        videoService.getSpclStatus().then(res => {
          // console.log(res.data.code)
          // 已开通，订购
          if (res.data.code === 200 && (res.data.data.baseAbility || res.data.data.baseVip || res.data.data.spclMonthly)) {
            // 查询是否有数据
            if (uni.getStorageSync("userData")[0] && uni.getStorageSync("userData")[0]
              .vrbtResponse) {
              // let isBuyVideoList = uni.getStorageSync('userData')[0].vrbtSettingRes;
              const isBuyVideoListTemp = uni.getStorageSync("userData")[0].vrbtResponse.filter(
                item => {
                  return uni.getStorageSync("userData")[0].vrbtSettingRes
                    .findIndex(v => (v == item.ringId && item.hidden != 1)) > -1;
                });
              const isBuyVideoList = [];
              isBuyVideoListTemp.forEach(v => {
                isBuyVideoList.push(v.ringId);
              });
              if (isBuyVideoList.length) {
                const n = Math.floor(Math.random() * isBuyVideoList.length);
                const currentRingId = isBuyVideoList[n];
                // 根据ID请求详情
                videoService.getSpclVideoDetail({
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
            } else {
              this.cxVideoContent = "立即设置";
              this.cxVideoStatus = 1;
            }
          } else if (res.data.code === 200 && (res.data.data.baseAbility && res.data.data.baseVip && res.data.data.spclMonthly)) {
            this.cxVideoContent = "立即开通";
            this.cxVideoStatus = 0;
          } else {
            this.cxVideoContent = "立即开通";
            this.cxVideoStatus = 0;
          }
        });
        // 彩铃
        cxService.queryClStatus().then(res => {
          this.isBuyList = [];
          // cxMusicStatus:0,//0未开通   1已开通 未设置 2 已开通 并设置
          // 已开通，订购
          if (res.data.code === 200 && res.data.data === "1") {
            // 查询是否有数据
            if (uni.getStorageSync("userData")[0]) {
              // console.log('uni',uni.getStorageSync('userData')[0].crbtSettingRes)
              const ringIdAllArray = uni.getStorageSync("userData")[0].crbtSettingRes;
              // console.log('ringIdAllArray',ringIdAllArray)
              cxService.getClMusicList(JSON.stringify(uni.getStorageSync("userData")[0]
                .crbtSettingRes)).then(res => {
                  if (res.data.code == 200) {
                    this.isBuyList = res.data.data.filter(item => item.hidden != 1);
                    // console.log('this.isBuyList', this.isBuyList)
                  }
                  if (this.isBuyList.length) {
                    const n = Math.floor(Math.random() * this.isBuyList.length);
                    const currentRingId = this.isBuyList[n].ringId;
                    cxService.getCxMusicDetail({
                      ringId: currentRingId,
                    }).then(res => {
                      if (res.data.code === 200) {
                        this.cxMusicContent = res.data.data
                          ? res.data.data
                            .ringName
                          : "";
                        this.cxMusicStatus = 2;
                      } else {
                        this.cxMusicContent = "立即设置";
                        this.cxMusicStatus = 1;
                      }
                    });
                  } else {
                    this.cxMusicContent = "立即设置";
                    this.cxMusicStatus = 1;
                  }
                });
            } else {
              this.cxMusicContent = "立即设置";
              this.cxMusicStatus = 1;
            }
          } else if (res.data.code === 200 && res.data.data === "0") {
            this.cxMusicContent = "立即开通";
            this.cxMusicStatus = 0;
          } else if (res.data.code === -200) {
            this.cxMusicContent = "立即开通";
            this.cxMusicStatus = 0;
          } else {
            this.cxMusicContent = res.data.msg;
            this.cxMusicStatus = 1;
          }
        });
      } else {
        this.nickName = "未登录";
        this.loginFlag = false;
        this.phoneNumber = "";
        this.isAuth = false;
      }
    },
    getMyMore () {
      videoService.getSpclIcon({
        target: "myMore",
      }).then(res => {
        if (res.data.code === 200) {
          this.functionList = [...res.data.data];
        }
      });
    },
    isLogin () {
      if (this.loginFlag) {
        this.$refs.popup_login_out.open();
        uni.hideTabBar();
      } else {
        uni.navigateTo({
          url: "/pagesD/my/login",
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
    navigateToLogin () {
      this.$refs.popup_login.open();
    },
    // 跳转至编辑页面
    async navigateToEditForAll (e) {

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
  overflow: scroll;
}
.login-top {
  width: 100%;
  background-color: #fff;
}
.custom-tab {
  // height: 446rpx;
  width: 100%;
  .custom-tab-title {
    font-weight: 700;
    font-size: 36rpx;
    color: #252a3e;
    width: 100%;
    text-align: center;
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

.yxlogo {
  display: inline-block;
  width: 22%;
  height: 50rpx;
  margin-left: 20rpx;
  vertical-align: middle;
  float: right;
  margin-top: -14%;
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
    color: red;
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
      background: linear-gradient(#ff6f50, #ff008c);
      -webkit-background-clip: text;
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
    // width: 142rpx;
    height: 34rpx;
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
        float: right;
      }
    }
  }
}
</style>
