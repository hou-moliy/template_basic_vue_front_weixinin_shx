<template>
  <view v-if="hotSelectValue.length > 0">
    <view class="cx_select_hot">
      <view class="cx_select_hot_label">
        <image
          class="cx_select_hot_titleIcon"
          :src="`${staticImgs}/shxmp/init/hotIcon.png`"
        />
        <text>热搜榜单</text>
      </view>
      <view class="cx_select_hot_box">
        <view v-if="hotListType == 'video'" class="cx_select_hot_view">
          <view
            v-for="(item, index) in hotSelectValue"
            :key="index"
            class="cx_select_hot_list"
            :data-url="'/pagesSpcl/clVideo/clVideoPlay?id=' + item.ringId"
            @click="clickKey($event, item)"
          >
            <view class="cx_select_hot_item">
              <image
                v-if="index == '0'"
                class="cx_select_hot_numIcon"
                :src="`${staticImgs}/shxmp/init/firstIcon.png`"
              />
              <image
                v-else-if="index == '1'"
                class="cx_select_hot_numIcon"
                :src="`${staticImgs}/shxmp/init/secondIcon.png`"
              />
              <image
                v-else-if="index == '2'"
                class="cx_select_hot_numIcon"
                :src="`${staticImgs}/shxmp/init/thirdIcon.png`"
              />
              <view v-else class="cx_select_hot_numText">
                {{ index >= 9 ? "" : 0 }}{{ index + 1 }}
              </view>
              <view class="cx_select_hot_tip">
                {{
                  item.ringRename
                    ? item.ringRename.length > 15
                      ? `${item.ringRename.slice(0, 18)}...`
                      : item.ringRename
                    : item.ringName.length > 15
                    ? `${item.ringName.slice(0, 18)}...`
                    : item.ringName
                }}
              </view>
              <image class="cx_select_hot_textIcon" :src="item.icon" />
            </view>
          </view>
          <view
            v-if="hotSelectValue.length != total"
            class="cx_select_hot_item_more"
          >
            <view class="cx_select_hot_item_moreBox" @click="getMoreHotList">
              <text>展开更多</text>
              <image
                class="cx_select_hot_item_moreIcon"
                :src="`${staticImgs}/shxmp/init/iconDown.png`"
              />
            </view>
          </view>
        </view>
        <view v-if="hotListType == 'music'" class="cx_select_hot_view">
          <view
            v-for="(item, index) in cxMusicList"
            :key="index"
            class="cx_select_hot_list"
          >
            <view class="cx_select_hot_item">
              <view class="cx_select_hot_numIcon_box">
                <image
                  v-if="index == '0'"
                  class="cx_select_hot_numIcon"
                  :src="`${staticImgs}/shxmp/init/firstIcon.png`"
                />
                <image
                  v-else-if="index == '1'"
                  class="cx_select_hot_numIcon"
                  :src="`${staticImgs}/shxmp/init/secondIcon.png`"
                />
                <image
                  v-else-if="index == '2'"
                  class="cx_select_hot_numIcon"
                  :src="`${staticImgs}/shxmp/init/thirdIcon.png`"
                />
                <view v-else class="cx_select_hot_numText">
                  {{ index + 1 }}
                </view>
              </view>
              <view class="ypcl_box">
                <view class="ypcl_col_catagory_left">
                  <image
                    v-if="currentMusic == `${index}` && !isPauseMusic"
                    class="ypcl_col_catagory_left_image"
                    :src="`${staticImgs}/shxmp/init/playing_icon.png`"
                    @click="pauseMusic(index)"
                  />
                  <image
                    v-else-if="currentMusic == `${index}` && isPauseMusic"
                    class="ypcl_col_catagory_left_image"
                    :src="`${staticImgs}/shxmp/init/pause_icon.png`"
                    @click="playMusic(index)"
                  />
                  <image
                    v-else
                    class="ypcl_col_catagory_left_image"
                    :src="`${staticImgs}/shxmp/init/play_icon.png`"
                    @click="playMusic(index, item)"
                  />
                </view>
                <view class="ypcl_col_catagory_content">
                  <view class="ypcl_col_catagory_content_name">
                    {{ item.ringRename ? item.ringRename : item.ringName }}
                  </view>
                  <view class="ypcl_col_catagory_content_bottom">
                    <text class="ypcl_col_catagory_content_author">
                      {{ item.ringSinger }}
                    </text>
                    <text class="ypcl_col_catagory_content_orders">
                      {{ item.purchaseCount }}次订购
                    </text>
                  </view>
                </view>
                <view class="ypcl_col_catagory_right">
                  <view
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                  >
                    <view class="ypcl_col_catagory_right_2">
                      <image
                        class="ypcl_col_catagory_right_2_image"
                        :src="`${staticImgs}/shxmp/init/set_icon.png`"
                        @click="navigateToSetting(item)"
                      />
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="hotSelectValue.length != total"
            class="cx_select_hot_item_more"
          >
            <view class="cx_select_hot_item_moreBox" @click="getMoreHotList">
              <text>展开更多</text>
              <image
                class="cx_select_hot_item_moreIcon"
                :src="`${staticImgs}/shxmp/init/iconDown.png`"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ClService from "@/api/cl/index.js";
const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.loop = true;
export default {
  name: "CxHotList",
  props: {
    hotSelectValue: {
      type: Array,
      default: () => [],
    },
    cxMusicList: {
      type: Array,
      default: () => [],
      deep: true,
      immediate: true,
    },
    currentTab: {
      type: Number,
      default: -1,
    },
    pageName: {
      type: String,
      default: "",
    },
    hotListType: {
      type: String,
      default: "",
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      staticImgs: this.$staticImgs,
      playStatus: "play",
      currentMusic: -1,
      isPauseMusic: false,
      musicHeadUrl: this.globalData.musicUrl,
      animation: {},
      animationData: {},
    };
  },
  watch: {
    cxMusicList (nVal, oVal) {
      if (nVal !== oVal) {
        this.isPauseMusic = false;
        this.playStatus = "play";
      }
    },
  },
  mounted () {
    uni.$on("stopMusic", () => {
      this.currentMusic = -1;
      innerAudioContext.stop();
    });
  },
  methods: {
    clickKey (e, item) {
      const tempArr = [];
      tempArr.push(item);
      console.log(item, "item");
      this.$analysis.dispatch("video_search_hot_list_count  ", `${item.ringId}`);
      this.$store.commit("spcl/M_changeVideoList", tempArr);
      this.$emit("clickKey");
      uni.navigateTo({
        url: e.currentTarget.dataset.url,
      });
    },
    getMoreHotList () {
      this.$emit("getMoreHotList");
    },
    leave () {
      this.currentMusic = -1;
      innerAudioContext.stop();
    },
    navigateToSetting (item) {
    },
    playMusic (i, item) {
      if (item) {
        this.$analysis.dispatch("fxypcl_ss_rsbd_id", `${item.id}`);
      }
      ClService.userPlayMusic({
        ringId: this.cxMusicList[i].ringId,
        target: "bf",
        opType: 1,
      });
      if (this.currentMusic === i) {
        innerAudioContext.play();
        this.currentMusic = i;
        this.isPauseMusic = false;
      } else {
        innerAudioContext.stop();
        innerAudioContext.src = `${this.musicHeadUrl}${this.cxMusicList[i].auditionUrl}`;
        innerAudioContext.play();
        this.currentMusic = i;
        this.isPauseMusic = false;
      }
      this.$emit("getMusicId", this.cxMusicList[i].ringId);
    },
    pauseMusic () {
      innerAudioContext.pause();
      this.isPauseMusic = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.cx_select_hot {
  margin-bottom: 30rpx;
}

.cx_select_hot_label {
  margin-top: 20rpx;
  margin-left: 30rpx;
  font-size: 30rpx;
  font-family: PingFang SC, PingFang SC-Bold, sans-serif;
  font-weight: 700;
  text-align: left;
  color: #222222;
  line-height: 59rpx;
  margin-bottom: 20rpx;
}

.cx_select_hot_titleIcon {
  width: 38rpx;
  height: 38rpx;
  vertical-align: middle;
  margin-right: 13rpx;
}

.cx_select_hot_box {
  display: flex;
  justify-content: center;
  // flex-direction: column;

  .cx_select_hot_view {
    display: flex;
    flex-direction: column;
    width: 686rpx;
    // height: 750rpx;
    padding-bottom: 50rpx;
    background: linear-gradient(39deg, #f8f6ff 0%, #ffffff 100%);
    border-radius: 20rpx;
    // box-shadow: 0 0 18rpx 0 rgba(0, 0, 0, 0.08);

    .cx_select_hot_list {
      display: flex;
      margin: 30rpx 36rpx 0 36rpx;

      .cx_select_hot_item {
        display: flex;
        align-items: center;

        .cx_select_hot_tip {
          height: 36rpx;
          font-size: 26rpx;
          font-family: PingFang SC, PingFang SC-Bold, sans-serif;
          text-align: left;
          color: #333333;
          line-height: 36rpx;
          margin: 0 10rpx 0 35rpx;
        }
      }
    }
  }
}

.cx_select_hot_numIcon_box {
  display: flex;
  align-items: center;
}

.cx_select_hot_numIcon {
  width: 29rpx;
  height: 23rpx;
  vertical-align: middle;
}
.cx_select_hot_numText {
  width: 30rpx;
  height: 36rpx;
  font-size: 26rpx;
  font-family: PingFang SC, PingFang SC-Bold, sans-serif;

  color: #999;
  line-height: 36rpx;
  text-align: center;
}
.cx_select_hot_textIcon {
  width: 50rpx;
  height: 24rpx;
  margin: auto 0;
}

.cx_select_hot_item_more {
  font-size: 26rpx;
  font-family: PingFang SC, PingFang SC-Medium, sans-serif;
  font-weight: 500;
  text-align: left;
  color: #999999;
  line-height: 36rpx;
  // text-align: center;
  margin-top: 40rpx;
  display: flex;
  justify-content: center;

  .cx_select_hot_item_moreBox {
    display: inline-block;
  }
}

.cx_select_hot_item_moreIcon {
  width: 23rpx;
  height: 14rpx;
  margin-left: 10rpx;
}

.ypcl_box {
  display: flex;
  margin-left: 21rpx;
}

.ypcl_col_catagory_index {
  color: #666666;
  // font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  font-family: "Helvetica Neue", sans-serif;
  width: 100rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // font-weight: 500;
}

.ypcl_col_catagory_content {
  margin-left: 29rpx;
  width: 430rpx;
  margin-right: 22rpx;
}

.ypcl_col_catagory_content_name {
  width: 433rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 32rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium, sans-serif;
  font-weight: 500;
  text-align: left;
  color: #333333;
  margin-bottom: 10rpx;
}

.ypcl_col_catagory_content_bottom {
  display: flex;
  width: 464rpx;
}

.ypcl_col_catagory_content_author {
  display: inline-block;
  // width: 120rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 24rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium, sans-serif;
  font-weight: 350;
  text-align: left;
  color: #999999;
  margin-right: 31rpx;
}

.ypcl_col_catagory_content_orders {
  display: inline-block;
  width: 150rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 22rpx;
  font-family: PingFang SC Medium, PingFang SC Medium-Medium, sans-serif;
  font-weight: 350;
  text-align: left;
  color: #999999;
}

.ypcl_col_catagory_left {
  width: 48rpx;
  display: flex;
  align-items: center;
  // height: 48rpx;
  // margin-right: 35rpx;
}

.ypcl_col_catagory_left_image {
  width: 48rpx;
  height: 48rpx;
  display: block;
}

.ypcl_col_catagory_right {
  display: flex;
  align-items: center;
}

.ypcl_col_catagory_right_2 {
  width: 48rpx;
  // height: 48rpx;
}

.ypcl_col_catagory_right_2_image {
  width: 36rpx;
  height: 36rpx;
  display: block;
}
</style>
