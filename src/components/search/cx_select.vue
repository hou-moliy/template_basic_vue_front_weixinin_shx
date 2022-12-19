<template>
  <view :style="{ paddingTop: '37rpx' }">
    <view class="cx_select">
      <view class="cx_select-left">
        <view class="cx_select_input_view1">
          <view v-if="isFocus == false" class="cx_select_icon_view">
            <image
              class="cx_select_icon"
              :src="`${staticImgs}/shxmp/init/selector_icon.png`"
              mode=""
            />
          </view>
          <view class="cx_select_input_view2">
            <input
              v-model="value"
              style="width: 100%; font-size: 28rpx"
              type="text"
              :placeholder="placeholder"
              value=""
            />
            <view v-show="value" class="delete-box" @click="deleteValue">
              <image
                class="delete-icon"
                :src="`${staticImgs}/shxmp/init/delete.png`"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="select-btn" @click="select(true)">搜索</view>
    </view>
    <!-- 搜索内容为空 -->
    <view v-if="value === ''">
      <view v-if="hotKeyArr.length !== 0" class="cx_select_history">
        <view class="cx_select_history_top">
          <view class="cx_select_history_label">历史搜索</view>
          <view class="cx_select_history_del" @click="clear">
            <image
              class="cx_select_history_del_image"
              :src="`${staticImgs}/shxmp/init/clear-key.png`"
            />
            <view>清空</view>
          </view>
        </view>
        <view class="cx_select_history_view">
          <text
            v-for="(item, index) in hotKeyArr"
            :key="index"
            class="cx_select_history_tip"
            :style="{ width: item.length > 9 ? '260rpx' : '' }"
            @click="clickKey(item)"
          >
            {{ item }}
          </text>
        </view>
      </view>
      <cxHotList
        :hot-select-value="hotSelectValue"
        :cx-music-list="hotSelectValue"
        :hot-list-type="hotListType"
        :total="total"
        @clickKey="goToPlay"
        @getMoreHotList="getMoreHotList('more')"
        @getMusicDetail="getMusicDetail"
        @open="open"
        @login="login"
      />
    </view>
    <!-- 正在搜索 -->
    <view v-else-if="isSelecting">
      <view class="cx_selecting">
        <image
          class="cx_selecting_image"
          :src="`${staticImgs}/shxmp/init/select-loading.gif`"
        />
      </view>
    </view>
    <!-- 搜索了但没有内容 -->
    <view
      v-else-if="isSelectedState && selectList.length === 0"
      style="margin-top: 500rpx"
    >
      <view style="text-align: center">
        <view class="cx_select_noInfo_view1">暂无搜索结果</view>
        <view class="cx_select_noInfo_view2">换个关键词搜搜看吧~</view>
      </view>
    </view>
  </view>
</template>

<script>
import ClService from "@/api/cl/index.js";
import SpclService from "@/api/spcl/index.js";
import cxHotList from "./cx_hot_list.vue";
export default {
  components: { cxHotList },
  props: {
    defaultValue: {
      type: String,
      default: "",
    },
    defaultPageName: {
      type: String,
      default: "",
    },
    hotListType: {
      type: String,
      default: "",
    },
    pageStatusLoad: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      isFocus: false,
      value: "",
      placeholder: "",
      pageName: "",
      isSelecting: false, // 正在搜索
      isSelectedState: false, // 是否搜索过
      selectList: [],
      hotKeyArr: [],
      hotSelectValue: [],
      pageNum: 1,
      total: 0,
      videoList: [],
    };
  },
  watch: {
    value (val) {
      if (val === "") {
        this.isSelecting = false; // 正在搜索
        this.isSelectedState = false; // 是否搜索过
        this.selectList = [];
        uni.$emit("setSearchList", []);
        this.$emit("setSearchList", []);
      }
    },
    pageStatusLoad (val) {
      console.log(val, "pageStatusLoad");
      if (this.pageStatusLoad === "onShow") {
        // 获取视频彩铃热搜
        SpclService.spclHotKey({ type: 3 }).then(resp => {
          if (resp.data.code === 200 && resp.data.data.list.length > 0) {
            this.hotSelectValue = resp.data.data.list.slice(0, 10);
            this.videoList = resp.data.data.list;
            this.total = resp.data.data.total;
            console.log(this.total);
          }
        });
      }
    },
  },
  mounted () {
    this.getMoreHotList();
  },
  methods: {
    goToPlay () {
      this.$emit("hotKeyGoToPlay", true);
    },
    clickKey (item) {
      this.value = item;
      this.select();
    },
    // 清除历史记录
    clear () {
      this.hotKeyArr = [];
      if (this.pageName === "video") {
        uni.setStorageSync("videoHotKeyArr", this.hotKeyArr);
        this.$analysis.dispatch("video_search_history_delete_count ");
      } else {
        uni.setStorageSync("musicHotKeyArr", this.hotKeyArr);
      }
    },
    // 删除搜索
    deleteValue () {
      this.value = "";
      this.isFocus = false;
      this.isSelectedState = false;
      this.placeholder = "";
    },
    getHistory (hotKeyType) {
      if (uni.getStorageSync(hotKeyType).indexOf(this.value) === -1) {
        let tempArr = uni.getStorageSync(hotKeyType);
        if (tempArr.length > 19) {
          tempArr.pop();
          uni.setStorageSync(hotKeyType, tempArr);
        }

        tempArr.unshift(this.value);
        tempArr = tempArr.splice(0, 8);
        uni.setStorageSync(hotKeyType, tempArr);
      } else {
        let tempArr = uni.getStorageSync(hotKeyType);
        tempArr.splice(tempArr.indexOf(this.value), 1);
        tempArr.unshift(this.value);
        tempArr = tempArr.splice(0, 8);
        uni.setStorageSync(hotKeyType, tempArr);
      }
    },
    select (isClick) {
      uni.$emit("stopMusic");
      if (this.value.trim() === "" && isClick) {
        return this.$toast("请输入搜索内容");
      }
      this.selectList = [];
      uni.$emit("setSearchList", []);
      this.$emit("setSearchList", []);

      this.isSelecting = true;
      if (this.pageName === "video") {
        // 视频彩铃搜索
        this.videoSearch();
      } else {
        // 音频搜索
        this.musicSearch();
      }
    },
    // 视频彩铃搜索
    videoSearch () {
      const that = this;
      // 历史记录
      this.getHistory("videoHotKeyArr");
      this.hotKeyArr = uni.getStorageSync("videoHotKeyArr");
      this.isSelecting = true;
      uni.$emit("setSearchList", this.selectList);
      SpclService.spclSearch({
        searchKey: this.value,
      }).then((resp) => {
        that.isSelecting = false;
        that.isSelectedState = true;

        if (resp.data.code === 200) {
          const tempList = resp.data.data;
          if (!tempList.length) {
            this.selectList = tempList;
            return uni.$emit("setSearchList", this.selectList);
          }
          // 分享和喜欢数据格式化
          if (uni.getStorageSync("Authorization") && uni.getStorageSync("userSpclData")[0] && uni.getStorageSync("userSpclData")[
            0].vrbtResponse) {
            const isBuyList = uni.getStorageSync("userSpclData")[0].vrbtResponse;
            for (const key of tempList) {
              const isBuy = isBuyList.filter(item => key.ringId === item.ringId);
              if (isBuy[0]) {
                key.isBuyVideo = true;
              }
            }
          }
          this.selectList = tempList;
          uni.$emit("setSearchList", this.selectList);
        } else {
          return this.$toast(resp.data.message);
        }
      });
    },
    // 音频搜索
    musicSearch () {
      const that = this;
      this.getHistory("musicHotKeyArr");
      this.hotKeyArr = uni.getStorageSync("musicHotKeyArr");
      ClService.search({
        searchKey: this.value,
      }).then((resp) => {
        that.isSelecting = false;
        that.isSelectedState = true;
        // 分享和喜欢数据格式化
        if (resp.data.code === 200) {
          const tempList = resp.data.data;
          if (!tempList.length) {
            this.selectList = tempList;
            return uni.$emit("setSearchList", this.selectList);
          }
          if (uni.getStorageSync("Authorization") && uni.getStorageSync("userSpclData")[0] && uni.getStorageSync("userSpclData")[
            0].crbtResponse) {
            const isBuyList = uni.getStorageSync("userSpclData")[0].crbtResponse;
            for (const key of tempList) {
              const isBuy = isBuyList.filter(item => key.ringId === item.toneID);
              if (isBuy[0]) {
                key.isBuyMusic = true;
              }
            }
          }
          this.selectList = tempList;
          that.$emit("setSearchList", this.selectList);
        } else {
          return this.$toast(resp.data.message);
        }
      });
    },
    getMoreHotList (type) {
      this.placeholder = this.defaultValue;
      this.pageName = this.defaultPageName;
      if (type === "more" && this.pageName === "video") {
        this.hotSelectValue = this.videoList;
      } else {
        if (this.pageName === "video") {
          this.videogetMoreHotList();
        } else {
          this.musicgetMoreHotList(type);
        }
      }
    },
    // 视彩热搜榜单展开更多
    videogetMoreHotList () {
      if (!uni.getStorageSync("videoHotKeyArr")) {
        uni.setStorageSync("videoHotKeyArr", []);
      }
      this.hotKeyArr = uni.getStorageSync("videoHotKeyArr");
      SpclService.spclHotKey({ type: 3 }).then(resp => {
        if (resp.data.code === 200 && resp.data.data.list.length > 0) {
          this.hotSelectValue = resp.data.data.list.slice(0, 10);
          this.videoList = resp.data.data.list;
          this.total = resp.data.data.total;
        }
      });
    },
    // 音频热搜榜单展开更多
    musicgetMoreHotList (type) {
      if (!uni.getStorageSync("musicHotKeyArr")) {
        uni.setStorageSync("musicHotKeyArr", []);
      }
      if (type === "more") {
        this.pageNum++;
      }
      this.hotKeyArr = uni.getStorageSync("musicHotKeyArr");
      ClService.hotSearch({ pageNum: this.pageNum, pageSize: 10, type: 4 }).then(resp => {
        if (resp.data.code === 200 && resp.data.data.list.length > 0) {
          this.hotSelectValue = this.hotSelectValue.concat(resp.data.data.list);
          this.total = resp.data.data.total;
        }
      });
    },
    getMusicDetail (item) {
      this.$emit("getMusicDetail", item);
    },
    open (item) {
      this.$emit("open", item);
    },
    login (item) {
      this.$emit("login", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.cx_select {
  display: flex;
  align-items: center;
  margin: 0rpx 4% 80rpx 4%;
}
.cx_select .select-btn {
  font-size: 32rpx;
  font-family: PingFang SC Bold, PingFang SC Bold-Bold;
  font-weight: 700;
  text-align: left;
  line-height: 36rpx;
  margin-left: 18rpx;
  background-image: linear-gradient(to right, #9e79ff, #ff83d9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cx_select_input_view1 {
  width: 600rpx;
  height: 74rpx;
  background: #fff;
  border-radius: 37rpx;
  align-items: center;
  display: flex;
  align-items: center;
}

.cx_select_input_view2 {
  // margin-left: 25rpx;
  width: 100%;
  padding: 0 0 0 25rpx;
  display: flex;
  align-items: center;
}

.delete-box {
  height: 70rpx;
  width: 90rpx;
  // display: flex;
  // align-items: center;
  // justify-content: center;
}

.delete-icon {
  width: 29rpx;
  height: 29rpx;
  // z-index: 1;
  margin-left: 25rpx;
  margin-top: 20rpx;
}

.cx_select_icon_view {
  margin-left: 30rpx;
}

.cx_select_icon {
  width: 30rpx;
  height: 30rpx;
  display: block;
}

.cx_select_hot {
  margin-bottom: 30rpx;
}

.cx_select_hot_label {
  font-size: 36rpx;
  font-family: PingFang SC Bold, PingFang SC Bold-Bold;
  font-weight: 700;
  text-align: left;
  color: #000000;
  margin: 0 7% 24rpx 4%;
}

.cx_select_hot_view {
  display: flex;
  word-wrap: break-word;
  flex-wrap: wrap;
  padding-right: 53rpx;
}

.cx_select_hot_tip {
  height: 58rpx;
  border: 1rpx solid #c6c5c8;
  border-radius: 30rpx;
  display: inline-block;
  padding-left: 29rpx;
  padding-right: 26rpx;
  margin-bottom: 20rpx;
  margin-left: 32rpx;
  line-height: 58rpx;
  font-size: 24rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-weight: 500;
  text-align: center;
  color: #666666;
}

.cx_select_history_top {
  margin: 0 7% 31rpx 4%;
  display: flex;
  justify-content: space-between;
}

.cx_select_history_del {
  display: flex;
  font-size: 24rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-weight: 500;
  text-align: left;
  color: #999999;
  align-items: center;
}

.cx_select_history_del_image {
  width: 19rpx;
  height: 23rpx;
  display: block;
  margin-right: 8rpx;
}

.cx_select_history_label {
  font-size: 30rpx;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  text-align: left;
  color: #000000;
}

.cx_select_history_view {
  display: flex;
  word-wrap: break-word;
  flex-wrap: wrap;
  padding-right: 53rpx;
}

.cx_select_history_tip {
  height: 58rpx;
  border: 1px solid rgba(182, 161, 249, 0.3);
  background-color: #fff;
  border-radius: 29rpx;
  display: inline-block;
  padding-left: 29rpx;
  padding-right: 26rpx;
  margin-bottom: 20rpx;
  margin-left: 32rpx;
  line-height: 58rpx;
  font-size: 24rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-weight: 500;
  text-align: center;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cx_select_noInfo {
  margin: 277rpx 170rpx 89rpx 170rpx;
  width: 410rpx;
  height: 184rpx;
}

.cx_select_noInfo_view1 {
  font-size: 32rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-weight: 500;
  text-align: center;
  color: #222222;
  margin-bottom: 20rpx;
}

.cx_select_noInfo_view2 {
  font-size: 26rpx;
  font-family: PingFang SC Regular, PingFang SC Regular-Regular;
  font-weight: 400;
  text-align: center;
  color: #999999;
}

.cx_selecting {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 360rpx;

  image {
    width: 100rpx;
    height: 60rpx;
  }
}
</style>
