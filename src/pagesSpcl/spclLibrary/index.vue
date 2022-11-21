<template>
  <view class="container">
    <!-- tab栏 -->
    <view class="cur-ring-t">
      <view
        class="cur-ring-t-item"
        :class="navFlag == 'curt' ? 'count' : ''"
        @click="changeNav('curt')"
      >
        当前播放
      </view>
      <view class="line" />
      <view
        class="cur-ring-t-item t-item-r"
        :class="navFlag == 'lyk' ? 'count-lyk' : ''"
        @click="changeNav('lyk')"
      >
        我的闲置
      </view>
    </view>
    <!-- 有数据的时候展示 -->
    <view
      v-if="!loading && videoList.length > 0"
      class="cur-ring-m"
    >
      <view
        v-if="checkShow === true"
        class="cur-ring-m-t"
      >
        <checkbox-group @change="changeVideo">
          <checkbox
            style="transform: scale(0.7)"
            :checked="allFlag.checked"
            :value="allFlag.value"
          />
          <text>
            全选({{ delCls.length }}/{{
              videoList.length > 10 ? 10 : videoList.length
            }})
          </text>
        </checkbox-group>
        <view
          class="mang-txt"
          @click="delDone"
        >
          取消选择
        </view>
      </view>
      <view
        v-else
        class="cur-ring-m-t"
      >
        <view class="count-ring">
          共
          <text style="color: #6B61F5">
            {{ videoList.length }}
          </text>
          首
        </view>
        <view
          v-if="videoList.length > 0"
          class="mang-txt"
          @click="checkShow = true"
        >
          批量管理
        </view>
      </view>
      <!-- <view
        class="cur-ring-m-tips"
        @click="toH5"
      >
        铃音显示不全？点击这里查看全部
      </view> -->
      <view
        class="cur-ring-m-f"
        :class="checkShow ? 'isDelete' : ''"
      >
        <label
          v-for="(videoItem, key) in videoList"
          :key="key"
          class="video-item"
        >
          <view
            v-show="checkShow"
            class="list-checkbox"
            :class="videoItem.checked ? 'list-checked' : ''"
            @click="checkboxChange(videoItem.ringId, key)"
          >
            <text
              v-if="videoItem.checked"
              class="iconfont icon-xuanzhong"
            />
          </view>
          <image
            class="video-item-l"
            mode="aspectFit"
            :src=" videoItem.coverUrl || videoItem.openVCoverUrl || videoItem.openHCoverUrl "
            @click.stop="seeDetail(videoItem)"
          />
          <view
            class="video-info"
            :class="checkShow === true ? 'video-info-del' : ''"
            @click.stop="seeDetail(videoItem)"
          >
            <view class="infot">
              {{
                videoItem.ringName.length > 12
                  ? `${videoItem.ringName.slice(0, 12)}...`
                  : videoItem.ringName
              }}
            </view>
            <view class="infof">
              有效期：{{ videoItem.overdueTime ? videoItem.overdueTime : "" }}
            </view>
          </view>
          <view
            v-show="!checkShow"
            class="video-mang-icon"
            @click.stop="mangEvent(videoItem, navFlag)"
          >
            <image :src="`${staticImgs}/shxmp/init/manag-icon.png`" />
          </view>
        </label>
      </view>
      <!-- 立即删除按钮 -->
      <view
        v-show="checkShow"
        class="del-video-item"
        :class="{'del-active':delActive}"
        @click="delVideoItems"
      >
        <image
          class="del-video-item-image"
          :src="`${staticImgs}/shxmp/init/del-icon.png`"
        />
        <view class="del-video-item-tips">
          立即删除
        </view>
      </view>
    </view>
    <!-- 空白展示 -->
    <NoData
      v-if="!loading && !videoList.length"
      :type="navFlag"
    />
    <!-- 分享，点赞，设置的操作面板 -->
    <clSharePanel
      :panel-show="panelShow"
      :pages-flag="true"
      :current-obj="currentObj"
      @hiddenPanelBtn="hiddenPanelBtn"
      @shareEvent="shareEvent"
      @likeEvent="likeEvent"
      @qxSzEvent="qxSzEvent"
      @szEvent="szEvent"
    />
    <!-- 遮罩 -->
    <view
      v-show="maskShow"
      class="mask"
    />
    <!-- toast弹窗 -->
    <view
      v-show="maskShow"
      class="maskTxt"
    >
      {{ maskTxts }}
    </view>
    <!--
    <view>
      <uni-popup
        ref="popup_open"
        type="dialog"
      >
        <spclCustomPopup
          :custom-flag="customFlag"
          :single="single"
          :islykdel="islykdel"
          :confirm-conent="confirmConentStatus"
          :title="title"
          :content="content"
          @closeEvent="closeEvent"
          @cancelSetting="cancelSetting"
          @settingCurrentPlay="settingCurrentPlay"
          @cancelAlert="cancelAlert"
          @multiCancel="multiCancel"
          @multiCancelRemain="multiCancelRemain"
        />
      </uni-popup>
    </view> -->
  </view>
</template>

<script>
import clSharePanel from "../components/cl-share-panel/index.vue";
import NoData from "../components/no-data/index.vue";
// import spclCustomPopup from "@/components/purchase-popup/spcl-custom-pop.vue";
import miguService from "@/api/migu/migu.js";

export default {
  name: "SpclLibrary",
  components: {
    clSharePanel,
    NoData,
    // spclCustomPopup,
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      navFlag: "curt", // tab栏
      currentClickId: "",
      ringIdAllArray: [],
      ringIdCurrentSetinggArray: [],
      // count: 8,
      ckIconImg: `${this.globalData.staticImgs}/mp/xy-icon.png`,
      checkShow: false,
      allFlag: {
        value: "cb",
        checked: false,
      },
      maskShow: false,
      maskTxts: "请勾选删除的铃音",
      panelShow: false, // 控制更多操作展示
      delCls: [],
      stFlag: true,
      currentid: 0,
      currentObj: {}, // 当前操作的铃音对象
      currentLists: [],
      userName: "您的好友",
      status: "more",
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "加载中.....",
        contentnomore: "没有更多数据啦",
      },
      page: 1,
      pageSize: 10,
      videoList: [], // 展示的数据
      allIdList: [], // 用户的所有铃音，id数组
      allVideoList: [], // 用户的所有铃音，对象数组
      loading: true, // 数据请求中
      currentVideoIdList: [], // 当前播放铃音，id数组
      videoSettingList: [], // 当前播放铃音，对象数组

      isLoad: "loaded",
      customFlag: false,
      single: false,
      confirmConentStatus: "",
      title: "",
      content: "",
      islykdel: "",
      currentSettingId: "",
      AddRingId: "",
      isRequestOver: true,
      hiddenVideoList: [],
    };
  },
  onLoad (options) {
    if (options.navflag) {
      this.navFlag = options.navflag;
    }
  },
  onShow () {
    // 获取用户的所有铃音数据
    this.$store.dispatch("spcl/getUserAllVideoList").then(() => {
      this.initData();
      this.loading = false;
    });
  },
  onReachBottom (e) { },
  computed: {
    delActive () {
      return this.checkShow && this.delCls.length > 0;
    },
  },
  methods: {
    // 初始化数据
    initData () {
      this.navFlag = "curt";
      this.checkShow = false;
      this.allFlag = {
        value: "cb",
        checked: false,
      };
      this.delCls = [];
      this.ringIdAllArray = [];
      this.ringIdCurrentSetinggArray = [];
      this.videoList = [];
      const userSpclDataWithTimeFixed = JSON.parse(uni.getStorageSync("userSpclData"));
      const allVideoListWithTimeFixed = userSpclDataWithTimeFixed?.vrbtResponse ?? [];
      allVideoListWithTimeFixed.map(item => {
        if (item.overdueTime) {
          return item.overdueTime.slice(0, 10);
        } else {
          return null;
        }
      });
      userSpclDataWithTimeFixed.vrbtResponse = allVideoListWithTimeFixed;
      uni.setStorageSync("userSpclData", userSpclDataWithTimeFixed);
      if (userSpclDataWithTimeFixed) {
        this.$loading("加载中...");
        this.getVideoListById();
      }
    },
    // 根据
    getVideoListById (flag) {
      this.allVideoList = uni.getStorageSync("userSpclData").vrbtResponse;
      this.currentVideoIdList = uni.getStorageSync("userSpclData").vrbtSettingRes;
      // 获取当前播放的对象数组
      this.videoSettingList = this.allVideoList.filter(item => {
        return (
          this.currentVideoIdList.findIndex(
            v => v === item.ringId && item.hidden !== 1,
          ) > -1
        );
      });
      // 勾选管理初始化
      for (let i = 0; i < this.videoSettingList.length; i++) {
        this.videoSettingList[i].checked = false;
      }
      for (let i = 0; i < this.allVideoList.length; i++) {
        this.allVideoList[i].checked = false;
      }
      this.checkShow = false;
      this.$set(this.allFlag, "checked", false);
      this.delCls = [];
      // 排序处理
      const newArray = [];
      for (let i = 0; i < this.currentVideoIdList.length; i++) {
        newArray.push(
          this.videoSettingList.find(
            item => item.ringId === this.currentVideoIdList[i],
          ),
        );
      }
      this.videoSettingList = [...newArray];
      if (flag === "updateAvailable") {
        // 真删除闲置刷新
        let idlevideoList = [];
        if (this.allVideoList) { // 用户的所有铃音
          idlevideoList = this.allVideoList.filter(item => {
            return (
              this.videoSettingList.findIndex(v => v.ringId === item.ringId) ===
              -1 && item.hidden !== 1
            );
          });
        }
        this.videoList = idlevideoList;
      } else {
        // 刷新当前播放
        this.videoList = this.videoSettingList;
      }
      let hiddenVideoListTemp = [];
      hiddenVideoListTemp = this.allVideoList.filter(item => {
        return (
          this.currentVideoIdList.findIndex(
            v => v == item.ringId && item.hidden == 1,
          ) > -1
        );
      });
      for (let i = 0; i < hiddenVideoListTemp.length; i++) {
        this.hiddenVideoList.push(hiddenVideoListTemp[i].ringId);
      }
    },
    // 切换Tab栏
    changeNav (info) {
      this.navFlag = info;
      if (info === "lyk") { // 闲置铃音
        let idleVideoList = [];
        if (this.allVideoList) {
          idleVideoList = this.allVideoList.filter(item => {
            return (this.videoSettingList.findIndex(v => (v.ringId == item.ringId)) == -1 && item.hidden != 1);
          });
        }
        this.videoList = idleVideoList;
      } else { // 当前播放铃音
        this.videoList = this.videoSettingList;
      }
    },
    // 每个铃音的选择
    checkboxChange (ringId, index) {
      // 取消
      if (this.videoList[index].checked) {
        this.$set(this.videoList[index], "checked", false);
        this.delCls.splice(this.delCls.indexOf(ringId), 1);
      } else {
        // 选中
        if (this.delCls.length > 9) {
          uni.showToast({
            title: "最多勾选10个视频彩铃哦～",
            icon: "none",
            duration: 2000,
          });
        } else {
          this.delCls.push(ringId);
          this.$set(this.videoList[index], "checked", true);
        }
      }
      // 没有了
      if (
        this.delCls.length === 10 ||
        this.delCls.length === this.videoList.length
      ) {
        this.$set(this.allFlag, "checked", true);
      } else if (this.delCls.length !== this.videoList.length) {
        this.$set(this.allFlag, "checked", false);
      }
    },
    // 全选、反选
    changeVideo (e) {
      this.videoList.map(item => this.$set(item, "checked", false));
      if (e.detail.value.length === 0) {
        this.delCls = [];
        this.$set(this.allFlag, "checked", false);
      } else {
        this.delCls = [];
        // 全选，前十个
        this.videoList.forEach((item, index) => {
          if (index < 10) {
            this.$set(item, "checked", true);
            this.delCls.push(item.ringId);
          }
        });
        this.$set(this.allFlag, "checked", true);
      }
    },
    // 删除视频彩铃
    delVideoItems () {
      if (this.delCls.length <= 0) return this.$toast("请勾选删除的铃音");
      if (!this.isRequestOver) {
        return false;
      }
      this.isRequestOver = false;
      uni.removeStorageSync("afterDelCurrentVedioList");
      const settingId = uni.getStorageSync("userSpclData").settingIdRes;

      if (this.navFlag === "curt") { // 当前播放页面
        this.handleDelCurt();
      } else { // 我的闲置页面
        this.handleDelXz();
      }
    },
    // 当前播放页面的删除
    handleDelCurt () {
      const spDelList = this.currentVideoIdList.filter(
        v => this.delCls.findIndex(item => item == v) == -1,
      );
      uni.setStorageSync("spDelList", spDelList);
      uni.setStorageSync("navFlag", "curt");
      if (this.hiddenVideoList.length > 0) {
        spDelList.concat(this.hiddenVideoList);
        miguService
          .modifySpcl({
            contentIDs: spDelList,
            settingID: settingId,
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$refs.popup_open.open();
              this.customFlag = true;
              this.title = "操作成功";
              this.content = [
                "您成功将",
                `${this.delCls.length}首`,
                "视频彩铃取消当前播放",
              ];
              this.confirmConentStatus = "确定";
              this.single = true;
              this.islykdel = "multiCancelRemain";
              setTimeout(() => {
                this.isRequestOver = true;
              }, 1000);
            } else {
              this.$refs.popup_open.open();
              this.customFlag = true;
              this.title = "操作失败";
              this.content = [
                `${this.delCls.length}首`,
                "视频彩铃取消当前播放失败",
              ];
              this.confirmConentStatus = "确定";
              this.single = true;
              this.islykdel = "fail";
              setTimeout(() => {
                this.isRequestOver = true;
              }, 1000);
            }
          });
      } else {
        if (spDelList.length == 0) {
          // console.log('2')
          miguService
            .canMultiVideo({
              settingId,
            })
            .then(res => {
              if (res.data.code == 200) {
                // debugger
                this.$refs.popup_open.open();
                this.customFlag = true;
                this.title = "操作成功";
                this.content = [
                  "您成功将",
                  `${this.delCls.length}首`,
                  "视频彩铃取消当前播放",
                ];
                this.confirmConentStatus = "确定";
                this.single = true;
                this.islykdel = "multiCancel";
                setTimeout(() => {
                  this.isRequestOver = true;
                }, 1000);
              } else {
                this.$refs.popup_open.open();
                this.customFlag = true;
                this.title = "操作失败";
                this.content = [
                  `${this.delCls.length}首`,
                  "视频彩铃取消当前播放失败",
                ];
                this.confirmConentStatus = "确定";
                this.single = true;
                this.islykdel = "fail";
                setTimeout(() => {
                  this.isRequestOver = true;
                }, 1000);
              }
            });
        } else {
          miguService
            .modifySpcl({
              contentIDs: spDelList,
              settingID: settingId,
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$refs.popup_open.open();
                this.customFlag = true;
                this.title = "操作成功";
                this.content = [
                  "您成功将",
                  `${this.delCls.length}首`,
                  "视频彩铃取消当前播放",
                ];
                this.confirmConentStatus = "确定";
                this.single = true;
                this.islykdel = "multiCancelRemain";
                setTimeout(() => {
                  this.isRequestOver = true;
                }, 1000);
              } else {
                this.$refs.popup_open.open();
                this.customFlag = true;
                this.title = "操作失败";
                this.content = [
                  `${this.delCls.length}首`,
                  "视频彩铃取消当前播放失败",
                ];
                this.confirmConentStatus = "确定";
                this.single = true;
                this.islykdel = "fail";
                setTimeout(() => {
                  this.isRequestOver = true;
                }, 1000);
              }
            });
        }
      }
    },
    // 我的闲置页面的删除
    handleDelXz () {
      uni.setStorageSync("spDelList", this.delCls);
      uni.setStorageSync("navFlag", "lyk");
      miguService.delMultiVideo(this.delCls).then(res => {
        if (res.data.code == 200) {
          if (res.data.data.fail === 0) {
            this.$refs.popup_open.open();
            this.customFlag = true;
            this.title = "删除成功";
            this.content = [
              "您成功删除",
              `${res.data.data.success}首`,
              "视频彩铃",
            ];
            this.confirmConentStatus = "确定";
            this.single = true;
            this.islykdel = "cancelAlert";
            setTimeout(() => {
              this.isRequestOver = true;
            }, 1000);
          } else if (res.data.data.success === 0) {
            this.$refs.popup_open.open();
            this.customFlag = true;
            this.title = "删除失败";
            this.content = [`${res.data.data.fail}首`, "视频彩铃删除失败"];
            this.confirmConentStatus = "确定";
            this.single = true;
            this.islykdel = "fail";
            setTimeout(() => {
              this.isRequestOver = true;
            }, 1000);
          } else {
            this.$refs.popup_open.open();
            this.customFlag = true;
            this.title = "删除失败";
            this.content =
                "您有" +
                res.data.data.success +
                "首视频彩铃删除成功" +
                res.data.data.fail +
                "首删除失败";
            this.confirmConentStatus = "确定";
            this.single = true;
            this.islykdel = "cancelAlert";
            setTimeout(() => {
              this.isRequestOver = true;
            }, 1000);
          }
        } else {
          uni.showToast({
            title: res.data.mag,
            icon: "none",
            duration: 2000,
          });
          setTimeout(() => {
            this.isRequestOver = true;
          }, 1000);
        }
      });
    },
    // 跳转到对应h5页面
    toH5 () {
      uni.setStorageSync(
        "ckH5Data",
        "https://y.migu.cn/app/v3/zt/2019/ring-library/index.html",
      );
      uni.navigateTo({
        url: "/pagesCommon/webView/ckWebview",
      });
    },
    // 取消勾选
    delDone () {
      this.$set(this.allFlag, "checked", false);
      this.videoList.forEach(element => {
        element.checked = false;
      });
      this.delCls = [];
      this.checkShow = false;
    },
    // 点击更多操作icon，展示操作面板
    mangEvent (ringObj, navFlag) {
      this.currentObj = ringObj;
      if (navFlag === "curt") { // 当前播放页面
        this.currentObj.szValue = 0;
      } else { // 我的闲置页面
        const curtFlag = this.currentLists.findIndex(
          item => item.ringId === this.currentObj.ringId,
        );
        if (curtFlag >= 0) {
          // 在当前播放列表存在
          this.currentObj.szValue = 1; // 已设置
        } else {
          this.currentObj.szValue = 2; // 设置为彩铃
        }
      }
      this.panelShow = true;
    },
    // 点击取消关闭操作面板
    hiddenPanelBtn () {
      this.panelShow = false;
    },
    // 页面跳转
    navigateToPages (url) {
      if (uni.getStorageSync("Authorization")) {
        uni.navigateTo({
          url,
        });
      } else {
        // 提示登录
        this.$refs.popup_login.open();
      }
    },
    // 分享
    shareEvent (ringId) {
      if (uni.getStorageSync("Authorization")) {
        // 把当前面板关了
        this.panelShow = false;
        this.navigateToPages(`/pagesCommon/share/shareVideo?videoId=${ringId}&shareType=1`);
      }
    },
    // 点赞
    likeEvent (ringId, flag) { // flag true 取消点赞， false新增点赞
      const data = {
        ringId,
        target: "dz",
        opType: flag ? 0 : 1,
      };
      this.$store.dispatch("spcl/handleSpclUserOperate", data).then(res => {
        if (res.code === 200) {
          this.handleUpdateLike(flag);
        } else {
          this.$toast(res.message);
        }
      });
    },
    // 处理点赞数据更新
    handleUpdateLike (flag) { // flag true 取消点赞， false新增点赞
      this.currentObj.extraInfo.like = !flag;
      if (flag) {
        this.currentObj.extraInfo.likeCount--;
        this.$toast("取消点赞成功");
      } else {
        this.currentObj.extraInfo.likeCount++;
        this.$toast("点赞成功");
      }
    },
    // 全局更新最新的
    updateLike (flag, ringId) {
      const vrbtResponseTemp = uni.getStorageSync("userSpclData");
      const indexTemp = vrbtResponseTemp[0].vrbtResponse.findIndex(
        item => item.ringId == ringId,
      );
      vrbtResponseTemp[0].vrbtResponse[indexTemp].extraInfo.like = flag;
      uni.setStorageSync("userSpclData", vrbtResponseTemp);
      if (flag) {
        vrbtResponseTemp[0].vrbtResponse[indexTemp].extraInfo.likeCount += 1;
      } else {
        vrbtResponseTemp[0].vrbtResponse[indexTemp].extraInfo.likeCount -= 1;
      }
      uni.setStorageSync("userSpclData", vrbtResponseTemp);
    },
    szEvent (ringId) {
      this.AddRingId = ringId;
      const listItem = this.videoList.findIndex(
        item => item.ringId == this.currentClickId,
      );
      const videoMsg = this.videoList[listItem];
      this.$refs.popup_open.open();
      this.customFlag = true;
      this.title = "您正在设置";
      this.content = ["确认要把", videoMsg.ringName, "设置为当前播放吗?"];
      this.confirmConentStatus = "确认";
      this.single = false;
      this.islykdel = "settingCurrent";
    },
    // 取消设置视频彩铃
    qxSzEvent (ringId) {
      // 展示取消设置弹窗
      console.log(`确认要把, ${this.currentObj.ringName}, 取消当前播放吗?`);
    },

    // 闲置页面响应
    async settingCurrentPlay () {
      const listItem = this.videoList.findIndex(
        item => item.ringId === this.currentClickId,
      );
      const videoMsg = this.videoList[listItem];
      uni.setStorageSync("bindVideoMsg", videoMsg);
      const currentClickIdArray = [];
      for (let i = 0; i < this.videoSettingList.length; i++) {
        currentClickIdArray.push(this.videoSettingList[i].ringId);
      }
      currentClickIdArray.unshift(this.currentClickId);
      uni.setStorageSync("currentClickSPId", currentClickIdArray);
      uni.setStorageSync("currentClickSPStatus", 1);
      this.panelShow = false;
      const settingId = uni.getStorageSync("userSpclData").settingIdRes;
      const userSpclData = uni.getStorageSync("userSpclData");
      if (settingId) {
        if (this.hiddenVideoList.length > 0) {
          currentClickIdArray.concat(this.hiddenVideoList);
          miguService
            .modifySpcl({
              contentIDs: currentClickIdArray,
              settingID: settingId,
            })
            .then(res => {
              if (res.data.code == 200) {
                // console.log('设为当前1', res)
                userSpclData.vrbtSettingRes = currentClickIdArray;
                uni.setStorageSync("userSpclData", userSpclData);
                this.getVideoListById("updateAvailable");
                uni.showToast({
                  title: "设置当前播放成功",
                  icon: "none",
                  duration: 2000,
                });
              } else {
                uni.showToast({
                  title: res.data.message,
                  icon: "none",
                  duration: 2000,
                });
              }
            });
        } else {
          miguService
            .modifySpcl({
              contentIDs: currentClickIdArray,
              settingID: settingId,
            })
            .then(res => {
              if (res.data.code == 200) {
                // console.log('设为当前2', res)
                userSpclData.vrbtSettingRes = currentClickIdArray;
                uni.setStorageSync("userSpclData", userSpclData);
                this.getVideoListById("updateAvailable");
                uni.showToast({
                  title: "设置当前播放成功",
                  icon: "none",
                  duration: 2000,
                });
              } else {
                uni.showToast({
                  title: res.data.message,
                  icon: "none",
                  duration: 2000,
                });
              }
            });
        }
      } else {
        const contentId = [];
        contentId.push(this.AddRingId);
        miguService
          .setCurrentSpcl({
            contentIDs: contentId,
          })
          .then(res => {
            if (res.data.code === 200) {
              userSpclData.settingIdRes = res.data.data;
              userSpclData.vrbtSettingRes = contentId;
              uni.setStorageSync("userSpclData", userSpclData);
              // console.log('设为当前3', res)
              this.getVideoListById("updateAvailable");
              uni.showToast({
                title: "设置当前播放成功",
                icon: "none",
                duration: 2000,
              });
            } else {
              uni.showToast({
                title: res.data.message,
                icon: "none",
                duration: 2000,
              });
            }
          });
      }
      // })
      this.closeEvent();
    },

    // 取消当前播放确认
    cancelSetting () {
      // console.log("qxSzEvent");
      const listItem = this.videoList.findIndex(
        item => item.ringId == this.currentClickId,
      );
      const videoMsg = this.videoList[listItem];
      uni.setStorageSync("bindVideoMsg", videoMsg);
      const currentClickIdArray = [];
      for (let i = 0; i < this.videoSettingList.length; i++) {
        currentClickIdArray.push(this.videoSettingList[i].ringId);
      }
      const delCurrentClickIdArray = currentClickIdArray.filter(
        v => v != this.currentClickId,
      );
      this.panelShow = false;
      uni.setStorageSync("currentClickSPId", delCurrentClickIdArray);
      uni.setStorageSync("currentClickSPStatus", 0);
      const settingId = uni.getStorageSync("userSpclData").settingIdRes;
      const userSpclData = uni.getStorageSync("userSpclData");
      const delCurrentClickIdConcatArray = delCurrentClickIdArray.concat(
        this.hiddenVideoList,
      );
      if (this.hiddenVideoList.length > 0) {
        miguService
          .modifySpcl({
            contentIDs: delCurrentClickIdConcatArray,
            settingID: settingId,
          })
          .then(res => {
            if (res.data.code == 200) {
              // console.log('取消当前1', res)
              userSpclData.vrbtSettingRes = delCurrentClickIdConcatArray;
              uni.setStorageSync("userSpclData", userSpclData);
              this.getVideoListById();
              uni.showToast({
                title: "取消当前播放成功",
                icon: "none",
                duration: 2000,
              });
            }
          });
      } else {
        if (delCurrentClickIdConcatArray.length == 0) {
          miguService
            .canMultiVideo({
              settingId,
            })
            .then(res => {
              if (res.data.code == 200) {
                userSpclData.vrbtSettingRes = [];
                userSpclData.settingIdRes = "";
                uni.setStorageSync("userSpclData", userSpclData);
                this.getVideoListById();
                uni.showToast({
                  title: "取消当前播放成功",
                  icon: "none",
                  duration: 2000,
                });
              }
            });
        } else {
          miguService
            .modifySpcl({
              contentIDs: delCurrentClickIdConcatArray,
              settingID: settingId,
            })
            .then(res => {
              if (res.data.code == 200) {
                // console.log('取消当前3', res)
                userSpclData.vrbtSettingRes = delCurrentClickIdConcatArray;
                uni.setStorageSync("userSpclData", userSpclData);
                this.getVideoListById();
                uni.showToast({
                  title: "取消当前播放成功",
                  icon: "none",
                  duration: 2000,
                });
              }
            });
        }
      }
      this.navFlag = "curt";
      this.closeEvent();
    },
    closeEvent () {
      this.$refs.popup_open.close();
      this.customFlag = false;
      this.islykdel = "";
    },
    // 删除后刷新列表
    cancelAlert () {
      // 返回值
      const userSpclData = uni.getStorageSync("userSpclData");
      const allVideoIdList = userSpclData.vrbtResponse;
      const newVrbtResponse = allVideoIdList.filter(v => {
        return this.delCls.findIndex(item => item == v.ringId) == -1;
      });
      userSpclData.vrbtResponse = newVrbtResponse;
      uni.setStorageSync("userSpclData", userSpclData);
      this.getVideoListById("updateAvailable");
      this.closeEvent();
    },
    multiCancel () {
      const userSpclData = uni.getStorageSync("userSpclData");
      userSpclData.vrbtSettingRes = [];
      userSpclData.settingIdRes = "";
      uni.setStorageSync("userSpclData", userSpclData);
      this.getVideoListById();
      this.closeEvent();
    },
    multiCancelRemain () {
      const spDelList = this.currentVideoIdList.filter(
        v => this.delCls.findIndex(item => item == v) == -1,
      );
      const userSpclData = uni.getStorageSync("userSpclData");
      userSpclData.vrbtSettingRes = spDelList;
      uni.setStorageSync("userSpclData", userSpclData);
      this.getVideoListById();
      this.closeEvent();
    },
    // 预览
    seeDetail (seeDetail) {
      // console.log(seeDetail);
      // uni.setStorageSync('videoList', [seeDetail]);
      this.$store.commit("getVideoList", this.videoList);
      console.log(this.videoList, "this.videoList");
      uni.navigateTo({
        url: "/pages/cxVideo/cxVideoPlay?id=" + seeDetail.ringId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {

  // tab栏样式
  .cur-ring-t {
    width: 90%;
    margin-left: 5%;
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;

    .cur-ring-t-item {
      width: 45%;
      position: relative;
      text-align: right;
      letter-spacing: 1rpx;
      font-size: 32rpx;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      color: #666666;
      line-height: 36rpx;
    }

    .line {
      width: 1rpx;
      height: 30rpx;
      background: #e5e5e5;
    }
    .t-item-r {
      text-align: left;
    }

    .count,
    .count-lyk {
      font-weight: bold;
      color: #252a3e;
      &:after {
        content: "";
        position: absolute;
        bottom: -16rpx;
        top: auto;
        right: 26rpx;
        height: 6rpx;
        width: 52rpx;
        background: linear-gradient(-90deg, #ff83d9 0%, #9e79ff 100%);
        border-radius: 3rpx;
      }
    }

    .count-lyk {
      &:after {
        left: 50rpx;
      }
    }
  }

  // 有数据时候的样式
  .cur-ring-m {
    margin-top: 30rpx;
    .no-record {
      width: 410rpx;
      height: 184rpx;
      margin-left: 170rpx;
      margin-top: 267rpx;
    }

    .no-record-tips1 {
      height: 34rpx;
      line-height: 34rpx;
      font-size: 36rpx;
      font-family: PingFang SC Medium, PingFang SC Medium-Medium;
      font-weight: 500;
      text-align: center;
      color: #666666;
      margin-top: 91rpx;
    }

    .no-record-tips2 {
      margin-top: 21rpx;
      height: 26rpx;
      line-height: 26rpx;
      font-size: 28rpx;
      font-family: PingFang SC Regular, PingFang SC Regular-Regular;
      font-weight: 400;
      text-align: center;
      color: #999999;
    }

    .cur-ring-m-t {
      font-weight: 400;
      display: flex;
      justify-content: space-between;
      align-items:center;
      color: rgba(51, 51, 51, 1);
      font-size: 24rpx;
      height: 64rpx;
      background:#F8F6FF;
      padding: 0 20rpx;
      margin-bottom: 16rpx;

      checkbox-group {
        display: flex;
        align-items: center;

        text {
          margin-left: 5rpx;
        }
      }

      .count-ring {
        font-size: 28rpx;
        font-family: PingFang SC Medium, PingFang SC Medium-Medium;
        font-weight: 500;
        text-align: left;
        color: #222222;
      }

      .mang-txt {
        font-size: 26rpx;
        font-family: PingFang SC Regular, PingFang SC Regular-Regular;
        font-weight: 400;
        text-align: right;
        color: #666666;
        padding: 19rpx 0;
      }
    }
    .cur-ring-m-tips {
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-decoration: underline;
      text-align: right;
      color: #3fc2fc;
      padding-right: 30rpx;
    }

    .cur-ring-m-f {
      padding: 0 32rpx;
      box-sizing: border-box;
      checkbox-group {
        padding: 0 30rpx 150rpx 30rpx;
         box-sizing: border-box;
      }

      .video-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 30rpx;

        .list-checkbox {
          width: 30rpx;
          height: 30rpx;
          margin-right: 20rpx;
          z-index: 10;
          background: #ffffff;
          border: 2rpx solid #a6a6a6;
          border-radius: 50%;
          text-align: center;
          line-height: 30rpx;

          .iconfont {
            font-size: 30rpx;
            color: #8B6CF0;
          }
        }

        .list-checked {
          border: none;
          width: 30rpx;
          height: 30rpx;
        }
        .video-item-index {
          width: 32rpx;
          font-size: 28rpx;
          font-family: PingFang SC Medium, PingFang SC Medium-Medium;
          font-weight: 500;
          text-align: left;
          color: #666666;
        }

        .ckIcon-btn {
          width: 24rpx;
          height: 24rpx;
        }

        .video-item-l {
          flex-shrink: 0;
          width: 109rpx;
          height: 109rpx;
          border-radius: 10rpx;
          background: rgba(0, 0, 0, 1);
        }

        .video-info {
          text-align: left;
          width: 500rpx;
          margin-left: 28rpx;

          .infot {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 30rpx;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
          }

          .infof {
            margin-top: 20rpx;
            font-size: 24rpx;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
        }
        .video-info-ckbox {
          width: 62%;
        }

        .video-mang-icon {
          width: 30rpx;
          height: 33rpx;
          line-height: 33rpx;
          text-align: center;

          image {
            width: 7rpx;
            height: 33rpx;
            vertical-align: top;
          }
        }
      }
    }

    .isDelete {
      padding: 0 32rpx 160rpx;
    }

    .del-video-item {
      width: 100%;
      height: 120rpx;
      line-height:120rpx;
      position: fixed;
      bottom: 0;
      text-align: center;
      z-index: 99;
      background: #C6C5C8;

      .del-video-item-image {
        width: 37rpx;
        height: 35rpx;
      }

      .del-video-item-tips {
        font-size: 24rpx;
        font-family: PingFang SC Medium, PingFang SC Medium-Medium;
        font-weight: 500;
        text-align: center;
        color: #999999;
        margin-top: 12rpx;
      }
    }
    .del-active {
      background: #e94b60;
    }
  }

  // 蒙层样式
  .mask {
    position: fixed;
    background: rgba(0, 0, 0, 1);
    opacity: 0;
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
    left: 15%;
    width: 70%;
    height: 100rpx;
    text-align: center;
    line-height: 95rpx;
    font-size: 30rpx;
  }

  .mask-foot {
    opacity: 0.5;
  }
}
</style>
