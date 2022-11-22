<template>
  <view class="login-page">
    <view class="top-box">
      <view class="text-header">
        <image
          class="logo"
          :src="`${staticImgs}/shxmp/init/music.png`"
        />
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
            >
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
            >
            <button
              v-if="times > 0"
              class="sended-btn"
              size="mini"
            >
              {{ times }}s
            </button>
            <view
              v-else
              class="sms-code-btn"
              size="mini"
              @click="sendCode"
            >
              <p>获取验证码</p>
            </view>
          </view>
        </view>

        <view class="check-view">
          <view
            class="list-checkbox-box"
            @click="check"
          >
            <view
              class="list-checkbox"
              :class="ischecked ? 'list-checked' : ''"
            >
              <text
                v-if="ischecked"
                class="iconfont icon-xuanzhong"
              />
            </view>
          </view>
          <view class="check-view-conten-text">
            我已阅读并同意
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
          <button
            class="login-btn"
            size="mini"
            :class="{ active: phonenumber }"
            @tap="getUserProfile"
          >
            登 录
          </button>
        </view>
      </view>
    </view>
    <view class="bottom-box">
      <view class="wx-login-box">
        <view class="tips-line" />
        <text class="tips-tips1">
          其他方式登录
        </text>
        <view
          class="tips-line"
          style="margin-left: 15rpx"
        />
      </view>
      <!-- 微信登录 -->
      <button
        v-if="!ischecked"
        class="wx-login"
        @click="noIschecked"
      >
        <image
          class="wx-login-img"
          :src="`${staticImgs}/shxmp/init/weixin-icon.png`"
        />
      </button>
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
      <text class="wx-text">
        微信授权一键登录
      </text>
    </view>
    <!-- toast弹窗 -->
    <view
      v-show="maskTxtShow"
      class="maskTxt"
    >
      {{ maskTxts }}
    </view>
    <!-- 遮罩 -->
    <view
      v-show="maskShow"
      class="mask"
    />
  </view>
</template>

<script>
import * as axios from "@/api/index.js";
import loginService from "@/api/my/my.js";
import miguService from "@/api/migu/migu.js";
// import analysisService from '@/api/analysis/analysis.js'
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

      // sim卡一键登录
      isSimLogin: false,
      simPhoneNum: "",
      wxPopupInfo: "已成功获取您的微信头像、昵称，点击“立即登录”继续登录",
      isShowWXBtn: true, // 是否展示wx验证按钮

    };
  },

  onShow () {
    this.wxLoginGetCode();
  },
  methods: {

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
      // console.log('加密',rsaEncryption(this.phonenumber))

      const param = {
        authType: 2,
        phone: rsaEncryption(this.phonenumber),
      };
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
        loginService.getAuthCodeLn(param).then((resp) => {
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
      }
    },
    // 验证正确手机号
    validatePhone (phoneNumber) {
      const telStr = /^1[3456789]\d{9}$/;
      if (!telStr.test(phoneNumber)) {
        return false;
      }
      return true;
    },
    // 微信获取code
    wxLoginGetCode () {
      uni.login({
        provider: "weixin",
        success: (res) => {
          console.log("code", res);
          this.wxCode = res.code;
        },
      });
    },

    // 手机验证码登录
    getUserProfile (e) {
      this.$loading("请稍等...");
      if (!this.phonenumber) {
        return this.$toast("请输入手机号");
      }

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
    async loginByPhone () {
      const that = this;
      // 是否授权
      if (that.detail.userInfo) {
        uni.setStorageSync("isAuth", true);
      } else {
        uni.setStorageSync("isAuth", false);
      }

      if (!this.loginFlag) {
        return;
      }
      if (!this.phonenumber) {
        return this.$toast("请输入手机号");
      }
      if (!this.password) {
        return this.$toast("请输入验证码");
      }
      await this.wxLoginGetCode();
      this.$loading("请稍等...");
      const param = {
        code: this.wxCode,
      };
      this.loginFlag = false;

      // 验证码登录
      uni.request({
        url: `${this.globalData.weixinUrl}/wx/user/${this.globalData.appId}/login`, // 根据code获取sessionkey
        data: param,
        method: "GET",
        success: (res2) => {
          console.log("短信登录res2", res2);
          uni.setStorageSync("openid", res2.data.openid);
          uni.setStorageSync("unionid", res2.data.unionid);
          const param = {
            optype: 1,
            authType: 2,
            phone: rsaEncryption(this.phonenumber),
            password: rsaEncryption(this.password),
          };
          if (this.phonenumber) {
            if (this.validatePhone(this.phonenumber)) {
              uni.request({
                url: `${this.globalData.portalUrl}/sso/loginLn`,
                data: param,
                method: "POST",
                success: (res) => {
                  // this.$analysis.dispatch('dl_yzm_dlcg')
                  // 渠道数据统计

                  // if (uni.getStorageSync("channelSource")) {
                  //   analysisService
                  //     .channelRecord(uni.getStorageSync(
                  //       "channelSource"))
                  //     .then((res) => {
                  //       if (res.data.code == 200 && res.data
                  //         .data) {
                  //         uni.removeStorageSync(
                  //           "channelSource");
                  //       }
                  //     });
                  // }
                  this.successLogin(res);
                },
                fail: () => {
                  this.loginFlag = true;
                  this.$toast("登录失败，请重试");
                },
              });
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
        fail: (err) => {
          console.error("授权登录失败：" + JSON.stringify(err));
          uni.hideLoading();
          this.$toast("微信授权失败");
          this.loginFlag = true;
        },
      });
    },
    // 成功登录
    successLogin (res) {
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
      // 获取用户铃音库数据
      this.$store.dispatch("spcl/getUserAllVideoList");
      // 查询用户是否开启ai换铃
      // this.checkPortalUser()
      // 跳转webJS获取铃音数据
      // this.getWebJsLingYingData()
      // 返回上一级
      uni.navigateBack({ delta: 1 });
      uni.setStorageSync("loadClData", true);
    },
    // 绑定微信与手机号
    bindWxUser () {
      const userInfo = uni.getStorageSync("userInfo");
      const param = {
        ...userInfo,
        headimgUrl: userInfo.avatarUrl,
        openId: uni.getStorageSync("openid"),
        phone: uni.getStorageSync("phone"),
        unionId: uni.getStorageSync("unionid"),
      };
      axios
        .post(`${this.globalData.weixinUrl}/wechat/bind`, param)
        .then((res) => {

        });
    },
    // 微信登录
    async wxLogin (e, eventId) {
      await this.wxLoginGetCode();
      console.log("e", e, eventId);
      // 管理获取手机号弹窗
      // switch (eventId) {
      //   case 'wx': // 微信登录
      //     this.$analysis.dispatch('dl_vx')
      //     break
      //   default:
      //     break
      // }
      if (!this.ischecked) {
        this.$toast("请勾选协议后登录");
        return;
      }

      const param = {
        code: this.wxCode,
      };
      // const info = uni.getStorageSync('infoRes')
      const {
        detail,
      } = e;

      if (detail.errMsg && detail.errMsg.indexOf("fail") > -1) {
        uni.hideLoading();
        this.$toast("取消手机号授权，登录失败");
        return;
      }

      uni.request({
        url: `${this.globalData.weixinUrl}/wx/user/${this.globalData.appId}/login`, // 根据code获取sessionkey
        data: param,
        method: "GET",
        success: (res2) => {
          uni.setStorageSync("openid", res2.data.openid);
          console.log("微信一键登录res2", res2);
          const param1 = {
            openId: res2.data.openid,
            encryptedData: detail.encryptedData,
            iv: detail.iv,
            // rawData: '22',
            // signature: '123',
          };
          uni.request({
            url: `${this.globalData.weixinUrl}/wx/user/${this.globalData.appId}/phone/v2`, // 获取手机号
            data: param1,
            method: "GET",
            success: (res3) => {
              console.log("res3", res3);
              if (res3.statusCode === 200) {
                // console.log(369)
                if (res3.data.code === 506) {
                  return uni.showToast({
                    title: "您不是陕西移动手机号码，请使用陕西移动手机号登录",
                    icon: "none",
                    duration: 2000,
                  });
                } else if (res3.data.code !== 200) {
                  return this.showToast(res3.data.message);
                }
                uni.setStorageSync("Authorization",
                  `Bearer ${res3.data.token}`);
                // this.$analysis.dispatch('dl_vx_dlcg')
                console.log("phone", res3.data.phone);
                console.log("rsaDecryption", rsaDecryption(res3.data
                  .phone));
                uni.setStorageSync("phone", rsaDecryption(res3.data.phone));
                uni.setStorageSync("loadClData", true);
                uni.setStorageSync("userData", [{
                  crbtResponse: [],
                  vrbtResponse: [],
                  crbtSettingRes: [],
                  vrbtSettingRes: [],
                  seetingIdRes: "",
                  crbtContentId: "",
                }]);
                // 渠道数据统计
                // if (uni.getStorageSync('channelSource')) {
                //   analysisService
                //     .channelRecord(uni.getStorageSync('channelSource'))
                //     .then((res) => {
                //       if (res.data.code == 200 && res.data.data) {
                //         uni.removeStorageSync('channelSource')
                //       }
                //     })
                // }
                this.bindWxUser();
                // 获取用户铃音库数据
                this.$store.dispatch("spcl/getUserAllVideoList");
                // 返回上一级
                uni.navigateBack({
                  delta: 1,
                });
              }
              uni.hideLoading();
            },
          });
        },
        fail: (err) => {
          console.error("授权登录失败：" + JSON.stringify(err));
          uni.hideLoading();
          this.showToast("授权登录失败");
        },
      });
    },

  },

};
</script>

<style lang="scss" scoped>
page {
height: 100%;
}

  uni-page-body,
  uni-page-refresh {
    height: 100%;
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

    .login-page {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      min-height: 100%;
    }
  }

  .bottom-box {
    position: fixed;
    bottom: 79rpx;
    width: 100%;
    text-align: center;

    .wx-login-box {
      .tips-line {
        display: inline-block;
        width: 108rpx;
        height: 2rpx;
        background: #d6d6d6;
        // margin-left: 149rpx;
        vertical-align: middle;
      }

      .tips-tips1 {
        // vertical-align: middle;
        margin-left: 15rpx;
        display: inline-block;
        height: 23rpx;
        font-size: 28rpx;
        font-family: PingFang SC Regular, PingFang SC Regular-Regular;
        font-weight: 400;
        text-align: center;
        color: #c5c5c5;
        line-height: 36rpx;
        letter-spacing: 1rpx;
      }
    }

    .wx-login {
      margin-top: 40rpx;
      margin-bottom: 20rpx;
      width: 100%;

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
      background: #d2d2d2;

      &.active {
        background: linear-gradient(to right, #9e79ff 0%, #e180e5 65%);
        box-shadow: 0rpx 9rpx 10rpx 0rpx rgba(255, 111, 80, 0.28);
      }
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
    background: #f2f2f2;
    border-radius: 4rpx;
    text-align: center;
    line-height: 49rpx;
    font-size: 30rpx;
    font-family: PingFang SC Medium, PingFang SC Medium-Medium;
    font-weight: 500;
    color: #666666;
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
    padding-top: 114rpx;
    // margin-left: 264rpx;
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
