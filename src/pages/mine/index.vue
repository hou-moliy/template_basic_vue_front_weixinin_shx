<template>
  <view class="content">
    <!-- <button @click="toLogin">
      登录
    </button> -->
    <view
      class="custom-tab"
      :style="{ background:`url(${staticImgs}/shxmp/init/search-bg.png) center/cover no-repeat`}"
    >
      <view
        class="custom-tab-title"
        :style="{ paddingTop: pointobj.top + 'px',lineHeight: pointobj.height+'px'}"
      >
        我的
      </view>
      <!-- 头部 -->

      <view
        class="login-top-box"
        @click="isLogin()"
      >
        <view class="txbox">
          <view
            v-if="loginFlag && isAuth"
            class="userinfo-avatar"
          >
            <image :src="userInfo.avatarUrl" />
          </view>
          <image
            v-else
            :src="avatarUrl"
          />
        </view>
        <view class="tx-content">
          <view
            v-if="loginFlag && isAuth"
            class="tx-content-nickname"
          >
            {{ userInfo.nickName }}
          </view>
          <button v-else-if="!loginFlag">
            {{ nickName }}
          </button>
          <text
            v-if="phoneNumber && isAuth"
            class="tx-content-text"
          >
            <text class="tx-content-text">
              ({{ phoneNumber }})
            </text>
          </text>
          <text
            v-else-if="phoneNumber && !isAuth"
            class="tx-content-text"
          >
            <text class="tx-content-text">
              {{ phoneNumber }}
            </text>
          </text>
          <view
            v-if="loginFlag&&lyhMemberLevel"
            class="hly-member-icon"
          >
            <view class="hly-member-img">
              <image :src="`${staticImgs}/lnmp/lyhMember/member-${lyhMemberLevel}.png`" />
            </view>
            <!-- <view v-else class="hly-member-img">
          <image :src="`${staticImgs}/lnmp/lyhMember/member-V0.png`"></image>
        </view> -->
          </view>
        </view>
      </view>
      <view class="cx-des">
        <view
          class="login-bottom-box"
          style="
            margin-top: 47rpx;
            display: flex;
            align-items: center;
            padding-bottom: 0rpx;
          "
        >
          <view style="width: 92%; display: flex; align-items: center">
            <image
              class="sign"
              :src="`${staticImgs}/lnmp/yp-icon.png`"
            />
            <text class="title">
              我的彩铃：
            </text>
            <text
              v-if="!loginFlag"
              class="content"
              @click="navigateToLogin()"
            >
              登录后显示
            </text>
            <text
              v-else
              class="content"
              @click="navigateToEditForAll('cl')"
            >
              {{
                cxMusicContent
              }}
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
          style="
            margin-top: 30rpx;
            padding-bottom: 100rpx;
            display: flex;
            align-items: center;
          "
        >
          <view style="width: 92%; display: flex; align-items: center">
            <image
              class="sign"
              :src="`${staticImgs}/lnmp/sp-icon.png`"
            />
            <text class="title">
              我的视彩：
            </text>
            <text
              v-if="!loginFlag"
              class="content"
              @click="navigateToLogin()"
            >
              登录后显示
            </text>
            <text
              v-else
              class="content"
              @click="navigateToEditForAll('sp')"
            >
              {{
                cxVideoContent
              }}
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

    <!-- 自定义Tabbar -->
    <custom-tabbar
      :tab-bar="tabBar"
      :mid-button="true"
    />
  </view>
</template>

<script>
export default {
  name: "Index",
  data () {
    return {
      tabBar: this.$store.getters.tabbarList,
      staticImgs: this.$staticImgs,
      pointobj: {},
    };
  },
  onLoad () {
    this.pointobj = uni.getMenuButtonBoundingClientRect();
  },
  methods: {
    isLogin () {
      // console.log('点击了登录')
      // uni.setStorageSync('ckH5Data','http://10.4.5.64:8080/liveBroadcast')
      // uni.navigateTo({
      // 	url:'/pagesCommon/webView/diy'
      // })
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
  .custom-tab{
    height: 436rpx;
    width: 100%;
    .custom-tab-title{
      font-weight: 700;
      font-size: 36rpx;
      color: #252A3E;
      width: 100%;
      text-align: center;
    }
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
      font-size: 36rpx;
      color: #fff;
      font-family: PingFang-SC-Bold;

      background: unset;
      vertical-align: middle;
    }

    .tx-content-text {
      // width: 278rpx;
      // height: 26rpx;
      // font-size: 28rpx;
      // font-family: PingFang SC Regular, PingFang SC Regular-Regular;
      // font-weight: 400;
      // text-align: left;
      // color: #ffffff;
      // line-height: 59rpx;

      font-size: 36rpx;
      font-family: PingFang SC Bold, PingFang SC Bold-Bold;
      font-weight: 700;
      text-align: left;
      color: #ffffff;
      line-height: 59rpx;
    }

  .hly-member-icon{
    margin-left: 24rpx;
    .hly-member-img{
      width: 56rpx;
      height: 56rpx;
      image{
        width: 100%;
        height: 100%;
      }
    }
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
  font-weight: bold;
  font-size: 36rpx;
  color: #fff;
  font-family: PingFang-SC-Bold;
  line-height: 36rpx;
  background: unset;
  vertical-align: middle;
  padding-left: 5rpx;
}
.txbox {
  width: 120rpx;
  height: 120rpx;
  background: #fff0ec;
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
</style>
