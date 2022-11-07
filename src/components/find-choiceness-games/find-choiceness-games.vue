<template>
  <view
    v-if="newGamesList.length"
    class="games-box"
  >
    <scroll-view
      class="items-box"
      :scroll-x="true"
      :scroll-left="offSet"
    >
      <view
        v-for="(item, index) in newGamesList"
        :key="index"
        class="games-scroll"
      >
        <view :class="['box', { 'more-margin': newGamesList.length == index + 1 }]">
          <view class="scroll-box">
            <view class="games-scroll-top">
              <view class="game-name">
                {{ item.matchSname }}
              </view>
              <view class="game-time">
                {{
                  handlerTimes(item.matchStartTime)
                }}
              </view>
            </view>
            <view class="games-scroll-bottom">
              <view class="homeTeam-box">
                <view class="homeTeam-box-img">
                  <image :src="item.homeTeam.img" />
                </view>
                <view class="homeTeam-box-name">
                  {{ item.homeTeam.teamName }}
                </view>
              </view>
              <view class="score-box">
                <view
                  v-if="item.matchStatus == 1 || item.matchStatus == 2"
                  class="score-box-score"
                >
                  <span>{{ item.homeScore || 0 }}</span>
                  <span>:</span>
                  <span>{{ item.guestScore || 0 }}</span>
                </view>
                <view
                  v-else-if="item.matchStatus == 3"
                  class="noScore"
                >
                  取消
                </view>
                <view
                  v-else-if="item.matchStatus == 4"
                  class="noScore"
                >
                  延期
                </view>
                <view
                  v-else-if="item.matchStatus == 5"
                  class="noScore"
                >
                  延迟
                </view>
                <view
                  v-else
                  class="noScore"
                >
                  未开始
                </view>
                <view class="score-box-status">
                  <view
                    v-if="item.matchStatus == 1"
                    class="score-box-start"
                  >
                    <image :src="`${staticImgs}/lnmp/hotGames/underway-icon.png`" />
                    <span>进行中</span>
                  </view>
                  <view
                    v-else-if="item.matchStatus == 2"
                    class="score-box-notStart"
                  >
                    已结束
                  </view>

                  <view
                    v-else
                    class="like-box"
                  >
                    <view
                      v-if="
                        item.matchStatus == 3 ||
                          item.matchStatus == 4 ||
                          item.matchStatus == 5
                      "
                      class="score-box-end-none"
                    />
                    <view
                      v-else-if="item.subscribeStatus == 1"
                      class="score-box-end-succese"
                      @click="exitSubGame(item, 1)"
                    >
                      已预约
                    </view>

                    <view
                      v-else-if="item.subscribeStatus == 0"
                      class="score-box-end"
                      @click="subGame(item, 1)"
                    >
                      预约比赛
                    </view>
                  </view>
                </view>
              </view>
              <view class="guestTeam-box">
                <view class="guestTeam-box-img">
                  <image :src="item.guestTeam.img" />
                </view>
                <view class="guestTeam-box-name">
                  {{ item.guestTeam.teamName }}
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="newGamesList.length == index + 1"
            class="white-bg"
          />
          <view
            v-if="newGamesList.length == index + 1"
            class="more-game-box"
          >
            <view
              class="more-game-box-content"
              @click="toMoreGames"
            >
              更多赛程
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { navigateToAny } from "@/utils/tools.js";
export default {

  props: {
    params: {
      type: Object,
      default: () => { },
    },
    offSetNum: {
      type: Number,
      default: undefined,
    },
    newGamesList: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      offSet: 0, // 偏移量
      gameWidth: 0, // 单个赛事  宽度
      staticImgs: this.$staticImgs,
    };
  },

  created () { },
  mounted () {
    this.caculateFooterHeight();
    console.log("this.newGamesList--999", this.newGamesList);
    // this.getOffSet()
  },
  methods: {
    caculateFooterHeight () {
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".games-scroll")
        .boundingClientRect((data) => {
          this.gameWidth = data.width;
          this.getOffSet();
          console.log("得到赛事宽度信息" + JSON.stringify(data));
        })
        .exec();
    },
    exitSubGame (item, type) {
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
      } else {
        this.$emit("exitSubGame", item, type);
      }
    },
    subGame (item, type) {
      if (!uni.getStorageSync("Authorization")) {
        this.$emit("openLoginPopup");
      } else {
        this.$emit("subGame", item, type);
      }
    },
    // 计算偏移量
    getOffSet () {
      console.log("num--", this.offSetNum);
      if (this.offSetNum > 0) {
        this.offSet = this.offSetNum * (this.gameWidth + 9) - (this.gameWidth / 2);
      } else {
        this.offSet = 0;
      }
      const a = (this.gameWidth / 2);
      console.log("this.offSet", this.offSet, "---", this.offSetNum, "-+++", a);
    },

    // 处理时间格式  xxxx-xx-xx hh:mm:ss 转换为 xx月xx日 hh:mm
    handlerTimes (time) {
      const month = time.substring(5, 7);
      const day = time.substring(8, 10);
      const hm = time.substring(11, 16);
      return month + "月" + day + "日" + " " + hm;
    },
    // 点击 更多赛程
    toMoreGames () {
      console.log("go 更多赛程");
      this.$analysis.dispatch("dj_gdsc");
      uni.navigateTo({ url: "/pagesC/liaoNingFind/views/hotGames/index" });
    },

    async navigateToH5 (event) {
      navigateToAny(event);
    },
  },
};
</script>

<style lang="scss" scoped>
.games-box {
  // margin: 0 30rpx;
  width: 750rpx;
}
.items-box {
  white-space: nowrap;
  width: 100%;
  background-color: #fff;
  .games-scroll {
    width: 404rpx;
    display: inline-block;
    height: 220rpx;
    background-color: #f8fbff;
    margin-left: 18rpx;
    border-radius: 20rpx;
    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20rpx;
      .white-bg {
        width: 18rpx;
        height: 228rpx;
        background-color: #fff;
      }
      .more-game-box {
        // margin-left: 18rpx;
        height: 220rpx;
        width: 60rpx;
        background-color: #f8fbff;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        // margin-right: 10rpx;

        .more-game-box-content {
          width: 26rpx;
          height: 134rpx;
          // background-color: #ff0;
          font-size: 24rpx;
          color: #666666;
          line-height: 33rpx;
          white-space: pre-wrap;
        }
      }
    }
    .more-margin {
      margin-right: 20rpx;
    }
    .scroll-box {
      display: flex;
      flex-direction: column;
      .games-scroll-top {
        height: 30rpx;
        margin: 14rpx 20rpx;
        display: flex;
        font-size: 22rpx;
        align-items: center;
        justify-content: space-between;
        .game-name {
          width: 174rpx;
          color: #999999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .game-time {
          width: 172rpx;
          overflow: hidden;
          color: #333333;
        }
      }
      .games-scroll-bottom {
        margin: 24rpx 20rpx;
        height: 124rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .homeTeam-box,
        .guestTeam-box {
          width: 100rpx;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          .homeTeam-box-img,
          .guestTeam-box-img {
            width: 76rpx;
            height: 76rpx;
            border-radius: 50%;
            image {
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }
          .homeTeam-box-name,
          .guestTeam-box-name {
            font-size: 20rpx;
            text-align: center;
            width: 100rpx;
            color: #666666;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        .guestTeam-box {
          width: 100rpx;
          height: 100%;
        }

        .score-box {
          width: 124rpx;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          .score-box-score {
            width: 100%;
            margin-top: 10rpx;
            height: 48rpx;
            display: flex;
            line-height: 48rpx;
            align-items: center;
            justify-content: center;
            font-size: 34rpx;
            font-weight: bold;
            color: #333333;
          }
          .noScore {
            padding: 2rpx 24rpx;
            margin-top: 15rpx;
            border-radius: 15rpx 6rpx 15rpx 6rpx;
            background-color: #f2f2f2;
            font-weight: 500;
            color: #999999;
            line-height: 28rpx;
            font-size: 20rpx;
          }
          .score-box-status {
            width: 124rpx;
            height: 40rpx;
            display: flex;
            font-size: 20rpx;
            font-weight: bold;
            align-items: center;
            justify-content: center;
            .score-box-notStart {
              background-color: #ececec;
              color: #696969;
              padding: 6rpx 32rpx;
              border-radius: 20rpx;
            }
            .score-box-start {
              background-color: #feebeb;
              color: #ff4557;
              padding: 6rpx 32rpx;
              border-radius: 20rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              image {
                width: 20rpx;
                height: 20rpx;
                margin-right: 8rpx;
              }
            }
            .score-box-end,
            .score-box-end-succese {
              background-color: #e5ebff;
              color: #4d76ff;
              padding: 6rpx 32rpx;
              border-radius: 20rpx;
            }

            .score-box-end-succese {
              background-color: #fff;
              border: 2rpx solid #4d76ff;
            }
            .score-box-end-nonempty {
              padding: 6rpx 32rpx;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
