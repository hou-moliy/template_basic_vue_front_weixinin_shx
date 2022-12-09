<template>
  <view
    class="login-page"
    :style="{
      background: `url(${staticImgs}/shxmp/init/search-bg.png)  no-repeat`,
    }"
  >
    <view
      class="custom-tab"
      :style="{
        paddingTop: pointobj.top + 'px',
        lineHeight: pointobj.height + 'px',
      }"
    >
      <image
        :src="`${staticImgs}/shxmp/init/leftIcon.png`"
        style="width: 34rpx; height: 44rpx"
        @click="getback"
      />
      <view class="custom-tab-title">登录</view>
    </view>
    <view class="top-box">
      <view class="text-header">
        <image class="logo" :src="`${staticImgs}/shxmp/init/music.png`" />
      </view>

      <view class="input-group">
        <view class="input-phone-row">
          <view class="input-row border">
            <image
              class="phone-icon"
              :src="`${staticImgs}/shxmp/init/phone-icon.png`"
            />
            <input
              v-model="phonenumber"
              class="m-input"
              type="number"
              maxlength="11"
              clearable
              placeholder="请输入手机号码"
            />
            <image
              v-if="phonenumber"
              class="phone-icon-del"
              :src="`${staticImgs}/shxmp/init/freeLogin-del-icon.png`"
              @click="delPhone"
            />
          </view>

          <view class="input-row">
            <image
              class="lock-icon"
              :src="`${staticImgs}/shxmp/init/lock-icon.png`"
            />
            <input
              v-model="password"
              class="m-input sms-code-input"
              type="text"
              clearable
              placeholder="请输入验证码"
            />
            <button v-if="times > 0" class="sended-btn" size="mini">
              {{ times }}s
            </button>
            <view v-else class="sms-code-btn" size="mini" @click="sendCode">
              <p>发送验证码</p>
            </view>
          </view>
        </view>

        <view class="check-view">
          <view class="list-checkbox-box" @click="check">
            <view
              class="list-checkbox"
              :class="ischecked ? 'list-checked' : ''"
            >
              <text v-if="ischecked" class="iconfont icon-xuanzhong" />
            </view>
          </view>
          <view class="check-view-conten-text">
            我已阅读并接受
            <view
              style="
                color: #7f77f5;
                text-decoration: underline;
                display: inline-block;
              "
              @click="navigateToPolicy"
            >
              《用户注册协议》
            </view>
          </view>
        </view>

        <view class="sms_login">
          <button class="login-btn" size="mini" @tap="getUserProfile">
            登 录
          </button>
        </view>
      </view>
    </view>
    <view class="bottom-box">
      <view class="wx-login-box">
        <view class="tips-line" />
        <text class="tips-tips1">使用其他登录方式</text>
        <view class="tips-line" style="margin-left: 15rpx" />
      </view>
      <!-- 微信登录 -->
      <view v-if="!ischecked" class="wx-login" @click="noIschecked">
        <image
          class="wx-login-img"
          :src="`${staticImgs}/shxmp/init/weixin-icon.png`"
        />
      </view>
      <button
        v-else
        open-type="getPhoneNumber"
        class="wx-login"
        @getphonenumber="wxLogin($event, 'wx')"
      >
        <image
          class="wx-login-img"
          :src="`${staticImgs}/shxmp/init/weixin-icon.png`"
        />
      </button>
      <text class="wx-text">微信授权一键登录</text>
    </view>

    <!-- toast弹窗 -->
    <view v-show="maskTxtShow" class="maskTxt">
      {{ maskTxts }}
    </view>
    <!-- 遮罩 -->
    <view v-show="maskShow" class="mask" />
  </view>
</template>

<script>
import SsoService from "@/api/sso/index.js";
import WxService from "@/api/wx/index.js";
import {
  rsaEncryption,
  rsaDecryption,
} from "@/utils/rsa.js";
export default {
  name: "LoginPage",
  data () {
    return {
      isShowLoginSelecte: false,
      phonenumber: "",
      password: "",
      times: 0,
      maskTxtShow: false,
      maskTxts: "",
      maskShow: false,
      showSmsLoginBox: true, // 是否显示短信登录框
      weixinUrl: this.globalData.weixinUrl,
      portalUrl: this.globalData.portalUrl,
      staticImgs: this.$staticImgs,
      loginFlag: true, // 判断用户是否登录 true
      sendFlag: true, // 判断用户是否发送短信
      wxCode: "",
      ischecked: false,
      detail: {},
      isWxAuthorization: false,
      isWifi: false,
      loginMethods: [], // 登录方式显示数组
      isShowSms: false, // 是否显示短信方式登录
      isShowWx: false, // 是否显示微信方式登录
      isShowYjdl: false, // 是否显示一键登录方式登录
      clickFlag: false,
      pointobj: {},

    };
  },
  onLoad () {
    this.pointobj = uni.getMenuButtonBoundingClientRect();
  },
  onShow () {
    this.wxLoginGetCode();
  },
  methods: {
    getback () {
      uni.navigateBack({ delta: 1 });
    },
    // 跳转用户注册协议
    navigateToPolicy () {
      // console.log(1111)
      uni.navigateTo({
        url: "/pagesCommon/policy/policy",
      });
    },
    // 删除号码
    delPhone () {
      this.phonenumber = "";
    },
    // 点击勾选
    check () {
      // console.log(656)
      this.ischecked = !this.ischecked;
    },
    // 未勾选协议
    noIschecked () {
      if (!this.ischecked) {
        this.$toast("请勾选协议后登录");
        // return
      }
    },
    // 获取动态验证码
    sendCode () {
      // this.$analysis.dispatch('dl_yzm_hqyzm')
      if (this.sendFlag) {
        if (!this.phonenumber) {
          return this.$toast("请输入手机号");
        }
        if (!this.validatePhone(this.phonenumber)) {
          return this.$toast("请输入正确的手机号");
        } else {
          uni.showLoading({
            title: "请稍等...",
            mask: true,
          });
        }
        this.successVerifySendCode();
      }
    },
    // 验证通过后的动态验证码操作
    successVerifySendCode () {
      const param = {
        authType: 2,
        phone: rsaEncryption(this.phonenumber),
      };
      SsoService.getAuthCode(param).then((resp) => {
        this.sendFlag = false;
        uni.hideLoading();
        if (resp.status === 200) {
          this.sendFlag = true;
          if (resp.data.code === 506) {
            return this.$toast("您不是陕西移动手机号码");
          } else if (resp.data.code !== 200) {
            return this.$toast(resp.data.message);
          }
          this.$toast("验证码已发送，请注意查收");
          this.times = 60;
          this.timesInterVal = setInterval(() => {
            if (this.times <= 0) {
              clearInterval(this.timesInterVal);
            }
            this.times = this.times - 1;
          }, 1000);
        } else {
          this.sendFlag = true;
          this.$toast(resp.errMsg);
        }
      });
    },
    // 验证正确手机号
    validatePhone (phoneNumber) {
      const telStr = /^1[3456789]\d{9}$/;
      return telStr.test(phoneNumber);
    },
    // 微信获取code
    wxLoginGetCode () {
      return new Promise((resolve) => {
        uni.login({
          provider: "weixin",
          success: (res) => {
            console.log("code", res);
            this.wxCode = res.code;
            resolve();
          },
        });
      });
    },

    // 手机验证码登录
    getUserProfile (e) {
      this.$loading("请稍等...", true, 0);
      if (!this.phonenumber) return this.$toast("请输入手机号");
      if (this.phonenumber.length !== 11) {
        this.$toast("请输入正确的手机号");
        this.clickFlag = false;
        setTimeout(() => {
          uni.hideLoading();
        }, 2000);
        return;
      }
      if (!this.password) {
        return this.$toast("请输入验证码");
      }

      if (!this.clickFlag) {
        this.clickFlag = true;
        if (!this.ischecked) {
          this.$toast("请勾选协议后登录");
          this.clickFlag = false;
          return;
        }

        // 手机验证码登录
        this.clickFlag = false;
        this.loginByPhone();
      }
    },
    // 验证码登录
    loginByPhone () {
      const that = this;
      // 是否授权
      if (that.detail.userInfo) {
        uni.setStorageSync("isAuth", true);
      } else {
        uni.setStorageSync("isAuth", false);
      }
      if (!this.loginFlag) return;
      if (!this.phonenumber) return this.$toast("请输入手机号");
      if (!this.password) return this.$toast("请输入验证码");
      this.verifiedloginByPhone();
    },
    async verifiedloginByPhone () {
      await this.wxLoginGetCode();
      this.$loading("请稍等", true, 0);
      this.loginFlag = false;
      this.handleloginByPhone();
      const param = {
        code: this.wxCode,
      };
      // 获取openid
      WxService.getWxIds(param)
        .then((res) => {
          uni.setStorageSync("openid", res.data.data.openid);
          uni.setStorageSync("unionid", res.data.data.unionid);
        }).catch(() => {
          uni.hideLoading();
          this.$toast("微信授权失败");
          this.loginFlag = true;
        });
    },
    // 处理验证码登录
    async handleloginByPhone () {
      const param = {
        optype: 1,
        authType: 2,
        phone: rsaEncryption(this.phonenumber),
        password: rsaEncryption(this.password),
      };
      if (this.phonenumber) {
        if (this.validatePhone(this.phonenumber)) {
          const res2 = await SsoService.getLogin(param);
          console.log(res2, "手机短信登录");
          if (res2.data.code === 200) {
            // this.$analysis.dispatch('dl_yzm_dlcg')
            //     // 渠道数据统计

            //     // if (uni.getStorageSync("channelSource")) {
            //     //   analysisService
            //     //     .channelRecord(uni.getStorageSync(
            //     //       "channelSource"))
            //     //     .then((res) => {
            //     //       if (res.data.code == 200 && res.data
            //     //         .data) {
            //     //         uni.removeStorageSync(
            //     //           "channelSource");
            //     //       }
            //     //     });
            //     // }
            this.successLogin(res2);
          } else {
            this.loginFlag = true;
            this.$toast(res2.data.message);
          }
        } else {
          uni.hideLoading();
          this.loginFlag = true;
          this.$toast("请输入中国移动手机号码");
        }
      } else {
        uni.hideLoading();
        this.loginFlag = true;
        this.$toast("请输入11位手机号码");
      }
    },
    // 成功登录
    async successLogin (res) {
      this.loginFlag = true;
      if (res.data.code === 506) {
        uni.hideLoading();
        return this.$toast("您不是陕西移动用户,请输入陕西移动手机号码完成登录");
      } else if (res.data.code !== 200) {
        uni.hideLoading();
        return this.$toast(res.data.message);
      }
      uni.setStorageSync(
        "Authorization",
        `${res.data.data.tokenHead} ${res.data.data.token}`,
      );
      uni.setStorageSync("phone", this.phonenumber);
      if (this.detail.userInfo) {
        uni.setStorageSync("userInfo", this.detail.userInfo);
      }
      // 绑定微信与手机号
      this.bindWxUser();
      // 获取用户视彩开通状态再获取铃音数据
      const spclStatusRes = await this.$store.dispatch("user/getUserSpclStatus");
      if (spclStatusRes) {
        // 获取用户铃音库数据
        this.$store.dispatch("spcl/getUserAllVideoList")
          .then(() => {
            uni.hideLoading();
            // 返回上一级
            uni.navigateBack({ delta: 1 });
          })
          .catch(() => {
            this.$toast("登录成功，获取铃音失败");
            uni.hideLoading();
            // 返回上一级
            uni.navigateBack({ delta: 1 });
          });
      } else {
        uni.hideLoading();
        // 返回上一级
        uni.navigateBack({ delta: 1 });
      }
    },

    // 绑定微信与手机号
    async bindWxUser () {
      const userInfo = uni.getStorageSync("userInfo");
      const param = {
        ...userInfo,
        headimgUrl: userInfo.avatarUrl,
        openId: uni.getStorageSync("openid"),
        unionId: uni.getStorageSync("unionid"),
      };
      await WxService.bindWx(param);
    },
    // 微信登录
    async wxLogin (e, eventId) {
      this.$loading("请稍等...", true, 0);
      await this.wxLoginGetCode();
      console.log("e", e, eventId);
      if (!this.ischecked) {
        this.$toast("请勾选协议后登录");
        return;
      }
      const param = {
        code: this.wxCode,
      };
      const {
        detail,
      } = e;

      if (detail.errMsg && detail.errMsg.indexOf("fail") > -1) {
        uni.hideLoading();
        this.$toast("取消手机号授权，登录失败");
        return;
      }
      const res2 = await WxService.getWxIds(param);
      console.log(res2);
      if (res2.data.code === 200) {
        uni.setStorageSync("openid", res2.data.data.openid);
        uni.setStorageSync("unionid", res2.data.data.unionid);
        const param1 = {
          openId: res2.data.data.openid,
          encryptedData: detail.encryptedData,
          iv: detail.iv,
        };
        const res3 = await WxService.wxuserPhone(param1);
        console.log(res3, "微信手机号授权");
        if (res3.data.code === 200) {
          uni.hideLoading();
          uni.setStorageSync("Authorization",
            `Bearer ${res3.data.token}`);
          // this.$analysis.dispatch('dl_vx_dlcg')
          uni.setStorageSync("phone", rsaDecryption(res3.data.phone));
          this.bindWxUser();
          // 获取用户视彩开通状态再获取铃音数据
          const spclStatusRes = await this.$store.dispatch("user/getUserSpclStatus");
          if (spclStatusRes) {
            // 获取用户铃音库数据
            await this.$store.dispatch("spcl/getUserAllVideoList");
          }
          uni.hideLoading();
          // 返回上一级
          uni.navigateBack({
            delta: 1,
          });
        } else if (res3.data.code === 506) {
          return uni.showToast({
            title: "您不是陕西移动手机号码，请使用陕西移动手机号登录",
            icon: "none",
            duration: 2000,
          });
        } else {
          return this.$toast(res3.data.message);
        }
      } else {
        uni.hideLoading();
        this.$toast("授权登录失败");
      }
    },

  },

};
</script>

<style>
page {
  height: 100%;
  padding-bottom: 79rpx;
  box-sizing: border-box;
}
</style>
<style lang="scss" scoped>
.custom-tab {
  display: flex;
  align-items: center;
  padding: 44rpx 4% 0 4%;
  .custom-tab-title {
    flex: 1;
    text-align: center;
    font-weight: 700;
  }
}
uni-page-body,
uni-page-refresh {
  height: 100%;
}
.login-page {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
}
.center-box {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.top-box {
  width: 100%;

  .input-group {
    width: 83%;
    margin: 124rpx auto 36rpx auto;

    input {
      width: 60%;
      font-size: 28rpx;
      height: 60upx;
    }
  }
}

.bottom-box {
  width: 100%;
  text-align: center;

  .wx-login-box {
    .tips-line {
      display: inline-block;
      width: 108rpx;
      height: 2rpx;
      background: #d6d6d6;
      vertical-align: middle;
    }

    .tips-tips1 {
      margin-left: 15rpx;
      display: inline-block;
      font-size: 28rpx;
      font-family: PingFang SC Regular, PingFang SC Regular-Regular;
      font-weight: 400;
      text-align: center;
      color: #999999;
      line-height: 36rpx;
      letter-spacing: 1rpx;
    }
  }

  .wx-login {
    width: 100rpx;
    height: 100rpx;
    margin: 0 auto;
    margin-top: 48rpx;
    margin-bottom: 27rpx;
    background-color: #fff;
    padding-left: 0;
    padding-right: 0;

    .wx-login-img {
      width: 100rpx;
      height: 100rpx;
      vertical-align: middle;
    }
  }

  .wx-text {
    font-size: 28rpx;
    font-family: PingFang SC Regular, PingFang SC Regular-Regular;
    color: #2e3346;
  }
}

button::after {
  border: none;
}

.sms_login {
  margin-top: 80rpx;

  .login-btn {
    width: 628rpx;
    height: 98rpx;
    border-radius: 49rpx;
    font-size: 36rpx;
    font-family: PingFang SC Medium, PingFang SC Medium-Medium;
    font-weight: bold;
    text-align: center;
    color: #ffffff;
    line-height: 98rpx;
    background: linear-gradient(to right, #9e79ff 0%, #e180e5 65%);
    box-shadow: 0rpx 9rpx 10rpx 0rpx rgba(179, 123, 245, 0.3);
  }
}

.sms-code-input {
  display: inline-block;
}

.sended-btn {
  position: absolute;
  right: 0;
  top: 16rpx;
  display: inline-block;
  width: 150rpx;
  height: 53rpx;
  background: #c6c5c8;
  border-radius: 14rpx;
  text-align: center;
  line-height: 49rpx;
  font-size: 30rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-weight: 500;
  color: #fff;
  border-radius: 26px;
}

.sms-code-btn {
  position: absolute;
  right: 0;
  top: 14rpx;
  display: inline-block;
  width: 161rpx;
  margin-left: 40rpx;
  border-radius: 14rpx;
  background: #6b61f5;
  height: 54rpx;
  font-size: 24rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  line-height: 54rpx;

  p {
    width: 100%;
    color: #fff;
  }
}

.m-input {
  padding: 10upx;
  display: inline-block;
  vertical-align: middle;
}

.input-row {
  margin-bottom: 10upx;
  position: relative;
  margin-top: 20rpx;
  border-bottom: 2rpx solid rgba(198, 197, 200, 0.5);

  .lock-icon {
    display: inline-block;
    width: 35rpx;
    height: 33rpx;
    vertical-align: middle;
  }

  .phone-icon {
    vertical-align: middle;
    display: inline-block;
    width: 35rpx;
    height: 36rpx;
  }

  .phone-icon-del {
    position: absolute;
    width: 36rpx;
    height: 36rpx;
    top: 24rpx;
    right: 7rpx;
  }
}

.text-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    width: 179rpx;
    height: 230rpx;
    // margin-bottom: 40rpx;
  }
}

.mask {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  // opacity: 0.5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
}

.maskTxt {
  position: fixed;
  background: black;
  opacity: 0.7;
  z-index: 1002;
  color: white;
  top: 45%;
  left: 20%;
  width: 60%;
  height: 70rpx;
  text-align: center;
  line-height: 70rpx;
  font-size: 28rpx;
  border-radius: 70rpx;
}

.check-view {
  display: flex;
  margin: 43rpx auto 0rpx 0rpx;
}

.iconfont {
  font-size: 30rpx;
  color: #6b61f5;
}

.list-checkbox-box {
  flex-shrink: 0;
  padding-left: 0rpx;
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
  margin-top: 2rpx;
}

.list-checked {
  border: none;
  width: 30rpx;
  height: 30rpx;
}

.check-view-conten-text {
  display: inline-block;
  font-size: 24rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-weight: 500;
  color: #333333;
}
</style>
