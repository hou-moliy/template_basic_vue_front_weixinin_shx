<template>
  <view class="container">
    <view class="cur-ring-t">
      <view
        class="cur-ring-t-item"
        :class="navFlag == 'curt' ? 'count' : ''"
        @click="changeNav('curt')"
      >
        当前播放
      </view>
      <view
        class="cur-ring-t-item t-item-r"
        :class="navFlag == 'lyk' ? 'count-lyk' : ''"
        @click="changeNav('lyk')"
      >
        闲置铃音
      </view>
    </view>
    <view v-if="videoLists.length > 0" class="cur-ring-m">
      <view v-if="checkShow === true" class="cur-ring-m-t">
        <checkbox-group @change="changeVideo">
          <checkbox
            style="transform: scale(0.7)"
            :checked="allFlag.checked"
            :value="allFlag.value"
          />
          <text>
            全选({{ delCls.length }}/{{
              videoLists.length > 10 ? 10 : videoLists.length
            }})
          </text>
        </checkbox-group>
        <view class="mang-txt" @click="delDone">取消选择</view>
      </view>
      <view v-else class="cur-ring-m-t">
        <view class="count-ring">
          共
          <text style="color: #ff6f50">
            {{ videoLists.length }}
          </text>
          首
        </view>
        <view v-if="videoLists.length > 0" class="mang-txt" @click="delOpen">
          批量管理
        </view>
      </view>
      <view class="cur-ring-m-tips" @click="toH5">
        铃音显示不全？点击这里查看全部
      </view>
      <view class="cur-ring-m-f" :class="checkShow ? 'isDelete' : ''">
        <label
          v-for="(videoItem, key) in videoLists"
          :key="key"
          class="video-item"
        >
          <view
            v-show="checkShow"
            class="list-checkbox"
            :class="videoItem.checked ? 'list-checked' : ''"
            @click="checkboxChange(videoItem.ringId, key)"
          >
            <text v-if="videoItem.checked" class="iconfont icon-xuanzhong" />
          </view>
          <image
            class="video-item-l"
            mode="aspectFit"
            :src="
              videoItem.coverUrl
                ? videoItem.coverUrl
                : videoItem.openVCoverUrl
                ? videoItem.openVCoverUrl
                : videoItem.openHCoverUrl
            "
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
            class="video-mangicon"
            @click.stop="mangEven(videoItem.ringId, navFlag)"
          >
            <image :src="`${staticImgs}/lnmp/manag-icon.png`" />
          </view>
        </label>
      </view>
      <view v-show="checkShow" class="del-video-item" @click="delVideoItems">
        <image
          class="del-video-item-image"
          :src="`${staticImgs}/lnmp/del-icon.png`"
        />
        <view class="del-video-item-tips">立即删除</view>
      </view>
    </view>
    <!-- 空白展示 -->
    <view v-else-if="isLoad === 'loaded'" class="cur-ring-m">
      <image
        class="no-record"
        :src="`${staticImgs}/lnmp/no-playRec-icon.png`"
      />
      <view v-if="navFlag == 'lyk'" class="no-record-tips1">
        您当前无闲置铃音
      </view>
      <view v-else class="no-record-tips1">您当前未设置播放</view>
      <view class="no-record-tips2">赶快去设置吧~</view>
      <view class="go-to-see" @click="goToCx">去设置</view>
      <view class="go-to-h5" @click="toH5">铃音显示不全？点击这里查看全部</view>
    </view>
    <clSharePanel
      :panel-show="panelShow"
      pages-flag="true"
      :currentObj="currentList"
      @hiddenPanelBtn="hiddenPanelBtn"
      @shareEvent="shareEvent"
      @likeEvent="likeEvent"
      @qxSzEvent="qxSzEvent"
      @szEvent="szEvent"
    />
    <!-- 遮罩 -->
    <view v-show="maskShow" class="mask" />
    <!-- toast弹窗 -->
    <view v-show="maskShow" class="maskTxt">
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
import clSharePanel from "@/components/cl-share-panel/cl-share-panel.vue";
import videoService from "@/api/cx/video.js";
// import spclCustomPopup from "@/components/purchase-popup/spcl-custom-pop.vue";
import miguService from "@/api/migu/migu.js";

export default {
  components: {
    clSharePanel,
    // spclCustomPopup,
  },
  data() {
    return {
      staticImgs: this.$staticImgs,
      navFlag: "curt",
      currentClickId: "",
      ringIdAllArray: [],
      ringIdCurrentSetinggArray: [],
      videoSettingList: [],
      // count: 8,
      videoLists: [],
      ckIconImg: `${this.globalData.staticImgs}/mp/xy-icon.png`,
      checkShow: false,
      allFlag: {
        value: "cb",
        checked: false,
      },
      maskShow: false,
      maskTxts: "请勾选删除的铃音",
      panelShow: true,
      delCls: [],
      stFlag: true,
      currentid: 0,
      currentList: {},
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
      allIdList: [],
      isLoad: "loaded",
      customFlag: false,
      single: false,
      confirmConentStatus: "",
      title: "",
      content: "",
      islykdel: "",
      currentSettingId: "",
      AddRingId: "",
      currentVideoIdList: [],
      isRequestOver: true,
      hiddenVideoList: [],
    };
  },
  onLoad(options) {
    if (options.navflag) {
      this.navFlag = options.navflag;
    }
  },
  onShow() {
    this.getVideoListByMigu();
  },
  onReachBottom(e) {},

  methods: {
    // 初始化数据
    init() {
      const userData = uni.getStorageSync("userData");
      this.navFlag = "curt";
      this.checkShow = false;
      this.allFlag = {
        value: "cb",
        checked: false,
      };
      this.delCls = [];
      this.ringIdAllArray = [];
      this.ringIdCurrentSetinggArray = [];
      this.videoLists = [];
      const userDataWithTimeFixed = uni.getStorageSync("userData");
      const allVideoListWithTimeFixed = userDataWithTimeFixed[0].vrbtResponse;
      allVideoListWithTimeFixed.map(item => {
        if (item.overdueTime) {
          return item.overdueTime.slice(0, 10);
        } else {
          return null;
        }
      });
      userDataWithTimeFixed[0].vrbtResponse = allVideoListWithTimeFixed;
      uni.setStorageSync("userData", userDataWithTimeFixed);
      if (userData[0]) {
        this.isLoad = "loading";
        uni.showLoading({
          title: "加载中...",
        });
        uni.hideLoading();
        this.getVideoListById();
      }
    },

    checkAuthorization() {
      if (uni.getStorageSync("Authorization")) {
        return true;
      }
      return false;
    },
    // 获取咪咕视频
    getVideoListByMigu() {
      uni.showLoading({
        title: "请求中...",
        mask: true,
      });
      miguService.getsplykInfo().then(response => {
        if (response.data.code == 200) {
          miguService
            .getsplykCurrentInfo()
            .then(res => {
              if (res.data.code == 200) {
                if (res.data.data && response.data.data) {
                  const userData = uni.getStorageSync("userData");
                  userData[0].vrbtResponse = response.data.data;
                  userData[0].vrbtSettingRes = res.data.data.contentIds;
                  userData[0].settingIdRes = res.data.data.settingId;
                  uni.setStorageSync("userData", userData);
                } else if (response.data.data) {
                  const userData = uni.getStorageSync("userData");
                  userData[0].vrbtResponse = response.data.data;
                  userData[0].vrbtSettingRes = [];
                  userData[0].settingIdRes = "";
                  uni.setStorageSync("userData", userData);
                } else {
                  const userData = uni.getStorageSync("userData");
                  userData[0].vrbtResponse = [];
                  userData[0].vrbtSettingRes = [];
                  userData[0].settingIdRes = "";
                  uni.setStorageSync("userData", userData);
                }
              }
              this.init();
              uni.hideLoading();
              // this.updateUserInfo()
            })
            .catch(() => {
              this.init();
            });
        } else {
          uni.hideLoading();
          uni.showToast({
            title: "数据请求失败，请退出重试～",
            icon: "none",
            duration: 2000,
          });
        }
      });
    },
    getVideoListById(flag) {
      this.isRequestOver = true;
      const allVideoIdList = uni.getStorageSync("userData")[0].vrbtResponse;
      this.currentVideoIdList =
        uni.getStorageSync("userData")[0].vrbtSettingRes;
      this.allIdList = allVideoIdList;
      // this.videoLists = newList;
      this.videoSettingList = allVideoIdList.filter(item => {
        return (
          this.currentVideoIdList.findIndex(
            v => v == item.ringId && item.hidden != 1,
          ) > -1
        );
      });
      // 勾选管理初始化
      for (let i = 0; i < this.videoSettingList.length; i++) {
        this.videoSettingList[i].checked = false;
      }
      for (let i = 0; i < allVideoIdList.length; i++) {
        allVideoIdList[i].checked = false;
      }
      this.checkShow = false;
      this.$set(this.allFlag, "checked", false);
      this.delCls = [];
      // 排序处理
      const newArray = [];
      for (let i = 0; i < this.currentVideoIdList.length; i++) {
        newArray.push(
          this.videoSettingList.find(
            item => item.ringId == this.currentVideoIdList[i],
          ),
        );
      }
      this.videoSettingList = newArray.filter(item => item);
      if (flag === "updateAvailable") {
        // 真删除闲置刷新
        let idlevideoLists = [];
        if (this.allIdList) {
          idlevideoLists = this.allIdList.filter(item => {
            return (
              this.videoSettingList.findIndex(v => v.ringId == item.ringId) ==
                -1 && item.hidden != 1
            );
          });
        }
        this.videoLists = idlevideoLists;
      } else {
        // 刷新当前播放
        this.videoLists = this.videoSettingList;
      }
      let hiddenVideoListTemp = [];
      hiddenVideoListTemp = allVideoIdList.filter(item => {
        return (
          this.currentVideoIdList.findIndex(
            v => v == item.ringId && item.hidden == 1,
          ) > -1
        );
      });
      // console.log('hiddenVideoListTemp', hiddenVideoListTemp)
      for (let i = 0; i < hiddenVideoListTemp.length; i++) {
        this.hiddenVideoList.push(hiddenVideoListTemp[i].ringId);
      }
      this.isLoad = "loaded";
      // console.log('hiddenVideoList', this.hiddenVideoList)
      // console.log('videoSettingList', this.videoSettingList)
    },
    changeNav(info) {
      this.delDone();
      if (this.isLoad == "loading") {
        return;
      }
      if (info == "lyk") {
        let idlevideoLists = [];
        // console.log('this.allIdList', this.allIdList)
        // console.log('this.videoSettingList', this.videoSettingList)
        if (this.allIdList) {
          idlevideoLists = this.allIdList.filter(item => {
            return (
              this.videoSettingList.findIndex(v => v.ringId == item.ringId) ==
                -1 && item.hidden != 1
            );
          });
        }
        // console.log('idlevideoLists', idlevideoLists)
        this.videoLists = idlevideoLists;
      } else {
        this.videoLists = this.videoSettingList;
      }
      this.navFlag = info;
      this.checkShow = false;
      this.$set(this.allFlag, "checked", false);
      this.delCls = [];
    },
    checkboxChange(ringId, index) {
      // 取消
      if (this.videoLists[index].checked) {
        this.$set(this.videoLists[index], "checked", false);
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
          this.$set(this.videoLists[index], "checked", true);
        }
      }
      // 没有了
      if (
        this.delCls.length === 10 ||
        this.delCls.length === this.videoLists.length
      ) {
        this.$set(this.allFlag, "checked", true);
      } else if (this.delCls.length !== this.videoLists.length) {
        this.$set(this.allFlag, "checked", false);
      }
    },
    // 全选、反选
    changeVideo(e) {
      // console.log(e);
      this.videoLists.map(item => this.$set(item, "checked", false));
      if (e.detail.value.length == 0) {
        this.delCls = [];
        this.$set(this.allFlag, "checked", false);
      } else {
        if (this.delCls.length > 9) {
          return;
        }
        this.delCls = [];
        // 全选，前十个
        this.videoLists.map((item, index) => {
          if (index < 10) {
            this.$set(item, "checked", true);
            this.delCls.push(item.ringId);
          }
        });
        this.$set(this.allFlag, "checked", true);
      }
    },
    /* 删除视频彩铃 */
    delVideoItems() {
      // console.log('6666')
      if (!this.isRequestOver) {
        return false;
      }
      // console.log(778)
      this.isRequestOver = false;
      uni.removeStorageSync("afterDelCurrentVedioList");
      const settingId = uni.getStorageSync("userData")[0].settingIdRes;
      if (this.delCls.length > 0) {
        if (this.navFlag === "curt") {
          const spDelList = this.currentVideoIdList.filter(
            v => this.delCls.findIndex(item => item == v) == -1,
          );
          // console.log('spDelList', spDelList)
          // console.log('this.delCls', this.delCls)
          uni.setStorageSync("spDelList", spDelList);
          uni.setStorageSync("navFlag", "curt");
          // console.log('this.hiddenVideoList', this.hiddenVideoList)
          if (this.hiddenVideoList.length > 0) {
            // console.log('1')
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
        } else {
          uni.setStorageSync("spDelList", this.delCls);
          uni.setStorageSync("navFlag", "lyk");
          miguService.delMultiVideo(this.delCls).then(res => {
            if (res.data.code == 200) {
              // console.log('res.data.data', res.data.data)
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
        }
      } else {
        uni.showToast({
          title: "请勾选删除的铃音",
          icon: "none",
          duration: 2000,
        });
      }
    },
    delOpen() {
      this.checkShow = true;
    },
    // 跳转到对应h5页面
    toH5() {
      uni.setStorageSync(
        "ckH5Data",
        "https://y.migu.cn/app/v3/zt/2019/ring-library/index.html",
      );
      uni.navigateTo({
        url: "/pagesCommon/webView/ckWebview",
      });
    },
    // 取消勾选
    delDone() {
      this.$set(this.allFlag, "checked", false);
      this.videoLists.filter(r => {
        r.checked = false;
      });
      this.delCls = [];
      this.checkShow = false;
    },
    mangEven(ringId, navFlag) {
      console.log("this.videoLists", this.videoLists);
      this.currentClickId = ringId;
      const listItem = this.videoLists.findIndex(item => item.ringId == ringId);
      this.currentList = this.videoLists[listItem];
      if (navFlag === "curt") {
        this.currentList.szValue = 0; // 取消当前播放
      } else {
        const curtFlag = this.currentLists.findIndex(
          item => item.ringId == ringId,
        );
        if (curtFlag >= 0) {
          // 在当前播放列表存在
          this.currentList.szValue = 1; // 已设置
        } else {
          this.currentList.szValue = 2; // 设置为彩铃
        }
      }

      this.panelShow = true;
      // console.log("xxx");
      // console.log(this.currentList);
    },
    hiddenPanelBtn() {
      // this.$analysis.dispatch('cl_share_cacel', '视频彩铃');
      this.panelShow = false;
    },

    navigateToPages(path) {
      const logFlag = this.checkAuthorization();
      if (logFlag == true) {
        uni.navigateTo({
          url: path,
        });
      } else {
        this.$refs.popup_login.open();
      }
    },
    goToCx() {
      uni.setStorageSync("fxPageName", "ln_spcl_index");
      uni.setStorageSync("userCyMsg", "sp");
      uni.switchTab({
        url: "/pages/liaoNingFind/views/index",
      });
    },
    // 分享
    shareEvent(ringId) {
      if (uni.getStorageSync("Authorization")) {
        // 把当前面板关了
        this.panelShow = false;
        this.navigateToPages("/pagesCommon/share/shareVideo?videoId=" + ringId);
      } else {
      }
    },
    // 点赞
    likeEvent(ringId, flag) {
      // 取消点赞
      let data = {
        ringId,
        target: "dz",
        opType: 1,
      };
      if (flag) {
        data = {
          ringId,
          target: "dz",
          opType: 0,
        };
      }
      videoService.getSpclUserBehavior(data).then(res => {
        if (res.data.code === 200) {
          if (res.data.data) {
            if (flag) {
              uni.showToast({
                title: "取消点赞成功",
                icon: "none",
                duration: 2000,
              });
              const temp = this.currentList;
              temp.extraInfo.like = false;
              temp.extraInfo.likeCount -= 1;
              this.$set(this.currentList, temp);
              // 取消点赞当前内容的更新

              this.updateLike(false, ringId);
              // 更新更多精彩数据
              const tempMoreVideoList = this.$store.state.moreVideoList;
              const currentIndex = tempMoreVideoList.findIndex(
                item => ringId === item.ringId,
              );
              if (currentIndex > -1) {
                tempMoreVideoList[currentIndex].extraInfo.likeCount -= 1;
                tempMoreVideoList[currentIndex].extraInfo.like = false;
                this.$store.commit("getMoreVideoList", tempMoreVideoList);
              }
            } else {
              uni.showToast({
                title: "点赞成功",
                icon: "none",
                duration: 2000,
              });
              const temp = this.currentList;
              temp.extraInfo.like = true;
              temp.extraInfo.likeCount += 1;
              this.$set(this.currentList, temp);
              this.updateLike(true, ringId);

              // 更新更多精彩数据
              const tempMoreVideoList = this.$store.state.moreVideoList;
              const currentIndex = tempMoreVideoList.findIndex(
                item => ringId === item.ringId,
              );
              if (currentIndex > -1) {
                tempMoreVideoList[currentIndex].extraInfo.likeCount += 1;
                tempMoreVideoList[currentIndex].extraInfo.like = true;
                this.$store.commit("getMoreVideoList", tempMoreVideoList);
              }
            }
          } else {
            uni.showToast({
              title: "您已点赞,请勿重复操作",
              icon: "none",
              duration: 2000,
            });
          }
        } else {
          uni.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000,
          });
        }
      });
    },
    // 全局更新最新的
    updateLike(flag, ringId) {
      const vrbtResponseTemp = uni.getStorageSync("userData");
      const indexTemp = vrbtResponseTemp[0].vrbtResponse.findIndex(
        item => item.ringId == ringId,
      );
      vrbtResponseTemp[0].vrbtResponse[indexTemp].extraInfo.like = flag;
      uni.setStorageSync("userData", vrbtResponseTemp);
      if (flag) {
        vrbtResponseTemp[0].vrbtResponse[indexTemp].extraInfo.likeCount += 1;
      } else {
        vrbtResponseTemp[0].vrbtResponse[indexTemp].extraInfo.likeCount -= 1;
      }
      uni.setStorageSync("userData", vrbtResponseTemp);
    },
    szEvent(ringId) {
      this.AddRingId = ringId;
      const listItem = this.videoLists.findIndex(
        item => item.ringId == this.currentClickId,
      );
      const videoMsg = this.videoLists[listItem];
      this.$refs.popup_open.open();
      this.customFlag = true;
      this.title = "您正在设置";
      this.content = ["确认要把", videoMsg.ringName, "设置为当前播放吗?"];
      this.confirmConentStatus = "确认";
      this.single = false;
      this.islykdel = "settingCurrent";
    },
    qxSzEvent() {
      const listItem = this.videoLists.findIndex(
        item => item.ringId == this.currentClickId,
      );
      const videoMsg = this.videoLists[listItem];
      this.$refs.popup_open.open();
      this.customFlag = true;
      this.title = "您正在操作";
      this.content = ["确认要把", videoMsg.ringName, "取消当前播放吗?"];
      this.confirmConentStatus = "确认";
      this.single = false;
      this.islykdel = "cancelSetting";
    },

    // 闲置页面响应
    async settingCurrentPlay() {
      const listItem = this.videoLists.findIndex(
        item => item.ringId == this.currentClickId,
      );
      const videoMsg = this.videoLists[listItem];
      uni.setStorageSync("bindVideoMsg", videoMsg);
      const currentClickIdArray = [];
      for (let i = 0; i < this.videoSettingList.length; i++) {
        currentClickIdArray.push(this.videoSettingList[i].ringId);
      }
      currentClickIdArray.unshift(this.currentClickId);
      uni.setStorageSync("currentClickSPId", currentClickIdArray);
      uni.setStorageSync("currentClickSPStatus", 1);
      this.panelShow = false;
      const settingId = uni.getStorageSync("userData")[0].settingIdRes;
      const userData = uni.getStorageSync("userData");
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
                userData[0].vrbtSettingRes = currentClickIdArray;
                uni.setStorageSync("userData", userData);
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
                userData[0].vrbtSettingRes = currentClickIdArray;
                uni.setStorageSync("userData", userData);
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
              userData[0].settingIdRes = res.data.data;
              userData[0].vrbtSettingRes = contentId;
              uni.setStorageSync("userData", userData);
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
    cancelSetting() {
      // console.log("qxSzEvent");
      const listItem = this.videoLists.findIndex(
        item => item.ringId == this.currentClickId,
      );
      const videoMsg = this.videoLists[listItem];
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
      const settingId = uni.getStorageSync("userData")[0].settingIdRes;
      const userData = uni.getStorageSync("userData");
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
              userData[0].vrbtSettingRes = delCurrentClickIdConcatArray;
              uni.setStorageSync("userData", userData);
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
                userData[0].vrbtSettingRes = [];
                userData[0].settingIdRes = "";
                uni.setStorageSync("userData", userData);
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
                userData[0].vrbtSettingRes = delCurrentClickIdConcatArray;
                uni.setStorageSync("userData", userData);
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
    closeEvent() {
      this.$refs.popup_open.close();
      this.customFlag = false;
      this.islykdel = "";
    },
    // 删除后刷新列表
    cancelAlert() {
      // 返回值
      const userData = uni.getStorageSync("userData");
      const allVideoIdList = userData[0].vrbtResponse;
      const newVrbtResponse = allVideoIdList.filter(v => {
        return this.delCls.findIndex(item => item == v.ringId) == -1;
      });
      userData[0].vrbtResponse = newVrbtResponse;
      uni.setStorageSync("userData", userData);
      this.getVideoListById("updateAvailable");
      this.closeEvent();
    },
    multiCancel() {
      const userData = uni.getStorageSync("userData");
      userData[0].vrbtSettingRes = [];
      userData[0].settingIdRes = "";
      uni.setStorageSync("userData", userData);
      this.getVideoListById();
      this.closeEvent();
    },
    multiCancelRemain() {
      const spDelList = this.currentVideoIdList.filter(
        v => this.delCls.findIndex(item => item == v) == -1,
      );
      const userData = uni.getStorageSync("userData");
      userData[0].vrbtSettingRes = spDelList;
      uni.setStorageSync("userData", userData);
      this.getVideoListById();
      this.closeEvent();
    },
    // 预览
    seeDetail(seeDetail) {
      // console.log(seeDetail);
      // uni.setStorageSync('videoList', [seeDetail]);
      this.$store.commit("getVideoList", this.videoLists);
      console.log(this.videoLists, "this.videoLists");
      uni.navigateTo({
        url: "/pages/cxVideo/cxVideoPlay?id=" + seeDetail.ringId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .cur-ring-t {
    width: 90%;
    margin-left: 5%;
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;

    .cur-ring-t-item {
      width: 45%;
      font-size: 30rpx;
      font-weight: 400;
      color: #999999;
      line-height: 36rpx;
      position: relative;
      text-align: right;
      letter-spacing: 1rpx;
    }

    .t-item-r {
      text-align: left;
    }

    .count,
    .count-lyk {
      font-weight: bold;
      color: #ff6f50;

      &:after {
        content: "";
        position: absolute;
        bottom: -16rpx;
        top: auto;
        right: 26rpx;
        height: 6rpx;
        width: 55rpx;
        background: #ff6f50;
        border-radius: 3rpx;
      }
    }

    .count-lyk {
      &:after {
        left: 50rpx;
      }
    }
  }

  .cur-ring-m {
    // width: 90%;
    // margin-left: 5%;
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

    .go-to-see {
      text-align: center;
      margin-top: 40rpx;
      width: 260rpx;
      height: 80rpx;
      background: linear-gradient(90deg, #ff6f50 54%, #ff008c 90%);
      border-radius: 10rpx;
      margin-left: 245rpx;
      font-size: 30rpx;
      font-family: PingFang SC Medium, PingFang SC Medium-Medium;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      letter-spacing: 0rpx;
      line-height: 80rpx;
    }
    .go-to-h5 {
      margin: 0 auto;
      margin-top: 38rpx;
      width: 361rpx;
      height: 26rpx;
      font-size: 24rpx;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-decoration: underline;
      text-align: center;
      color: #3fc2fc;
    }

    .cur-ring-m-t {
      display: flex;
      justify-content: space-between;
      color: rgba(51, 51, 51, 1);
      font-size: 24rpx;
      font-weight: 400;
      // width: 750rpx;
      height: 64rpx;
      background: #fef6e6;
      padding: 0 20rpx;
      margin-bottom: 16rpx;

      checkbox-group {
        display: flex;
        align-items: center;
        // padding-left: 30rpx;

        text {
          margin-left: 5rpx;
        }
      }

      .count-ring {
        height: 26rpx;
        font-size: 28rpx;
        font-family: PingFang SC Medium, PingFang SC Medium-Medium;
        font-weight: 500;
        text-align: left;
        color: #333333;
        line-height: 26rpx;
        padding: 19rpx 0;
      }

      .mang-txt {
        height: 23rpx;
        font-size: 24rpx;
        font-family: PingFang SC Regular, PingFang SC Regular-Regular;
        font-weight: 400;
        text-align: right;
        color: #666666;
        line-height: 26rpx;
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
      padding: 0 30rpx 30rpx 30rpx;

      // width: 688rpx;
      // margin-left: 24rpx;
      // padding: 0 30rpx 130rpx 30rpx;
      checkbox-group {
        padding: 0 30rpx 150rpx 30rpx;
      }

      .video-item {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        margin-top: 30rpx;

        .list-checkbox {
          margin-right: 25rpx;

          z-index: 10;
          background-color: #fff;
          border-radius: 50%;
          text-align: center;
          line-height: 30rpx;
          width: 29rpx;
          height: 29rpx;
          border: 1rpx solid #a6a6a6;

          .iconfont {
            font-size: 30rpx;
            color: #ff6953;
          }
        }

        .list-checked {
          border: none;
          width: 30rpx;
          height: 30rpx;
        }

        // checkbox {
        // 	margin-right: 25rpx;
        // }

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

        // .video-info-del {
        // 	width: 505rpx;
        // }

        .video-info-ckbox {
          width: 62%;
        }

        .video-mangicon {
          image {
            width: 40rpx;
            height: 40rpx;
            vertical-align: top;
          }
        }
      }
    }

    .isDelete {
      padding: 0 30rpx 160rpx 30rpx;
    }

    .del-video-item {
      background: #f7f8fb;
      position: fixed;
      bottom: 0;
      padding: 20rpx 0;
      width: 100%;
      text-align: center;
      z-index: 99;

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
  }

  /* .cur-ring-f{
			position: fixed;
			bottom: 0;
			background: #ffffff;
			width: 100%;
			font-size: 25rpx;
			z-index: 1003;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			.panel-view{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 94%;
				margin-left: 3%;
				text-align: center;
				color: #999999;
				padding-top: 50rpx;
				.panel-item{
					width: 25%;
					image{
						width: 88rpx;
						height: 88rpx;
					}
					view{
						margin-top: 14rpx;
					}
				}
				.share-wx{
					button{
						display: inline;
						padding: 0;
						font-size: 25rpx;
						line-height: normal;
						border-radius: 0;
						background: #ffffff;
						color: #999999;
					}
				}

			}
			.f-line{
				width: 100%;
				background: #e5e5e5;
				height: 1rpx;
				margin-top: 46rpx;
			}
			.f-btn{
				color: #333333;
				text-align: center;
				font-size: 26rpx;
				margin-top: 35rpx;
				padding-bottom: 25rpx;
			}
		} */
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
