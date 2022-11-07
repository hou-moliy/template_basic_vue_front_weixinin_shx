<template>
  <view class="content">
    <view
      class="tab-container"
      :style="{ background: tabBackground }"
    >
      <view
        class="title"
        style="margin-top: 100rpx"
      >
        彩铃
      </view>
      <view :class="['tab', `tab-${scrollNavStation}`]">
        <scroll-view
          class="scrollView"
          scroll-x
          show-scrollbar="false"
          :scroll-left="scrollLeft"
          scroll-with-animation
          :class="['swiper-nav', tabListLength == 1 ? 'empty-nav' : '',`swiper-nav-${scrollNavStation}`]"
          @scroll="scrollNav"
          @scrolltoupper="scrollNavToupper"
          @scrolltolower="scrollNavTolower"
        >
          <view
            class="tab-box"
            :style="{ 'justify-content': isOutWindow ? '' : 'flex-start' }"
          >
            <view
              v-for="(item, index) in tabList"
              :key="index"
              :class="['tab-item', pageName == item.pageName ? 'on' : '']"
              :data-current="index + 1"
              @click.stop="swichNavDebounce($event, item.pageUrl)"
            >
              <view>
                {{ item.name }}
                <hr
                  :style="{
                    background:
                      pageName == item.pageName
                        ? 'linear-gradient(0deg,#ff6f50 0%, #ff008c 100%);'
                        : '',
                  }"
                  class="tab-item-hr"
                >
              </view>
            </view>
          </view>
        </scroll-view>
        <view
          v-if="scrollNavStation != 'right'"
          class="tab-oper-btn"
          @click="toLastNav"
        >
          <view class="tab-item-xiangyou">
            <view class="tab-item-box" />
            <text class="iconfont icon-xiangyou" />
          </view>
        </view>
      </view>
    </view>

    <view style="margin-top: -21px">
      <swiper
        class="swiper"
        touchable="false"
        :current="swiperTab"
        duration="200"
        :style="{
          height: `${windowHeight - navHeight}px`,
        }"
        @change="swiperChange"
      >
        <swiper-item
          v-for="swipeItem in tabList"
          :key="swipeItem.id"
        >
          <scroll-view
            scroll-y="true"
            :style="{ height: `${windowHeight - navHeight}px` }"
            @scrolltolower="scrolltolower"
            @scroll="swiperContainerScroll"
          >
            <!-- 对应页面模块的注释，重要
            0001 banner模块
            0002 icon模块
            0003 最新直播
            0004 热门推荐
            0005 精选海报
            0006 辽宁特惠
            0007 风景 // 视频彩铃组件
            0008 音频专题
            0009 你会使用5G助手么
            0010 订阅
            0011 直播-直播瀑布流
            0012 搜索
            0013 视频彩铃-all
            0014 音频彩铃-all
            0015 咪咕视频-视频瀑布流
            0016 咪咕图片-咪咕-咪咕视频
            0017 咪咕图片-咪咕圈圈
            0018 小视频-今日推荐
            0019 小视频-精选权益
            0020 小视频-全部视频
            0021 广告位轮播
            0022 热门专题
            0023 咪咕视频左右滑动
            0029 IOP 猜您喜欢
            0030 发现页 内嵌web-view 可配置h5
            0031 新热门专题、可跳转新专题模块
            0032 赛事预约 -->

            <view
              v-for="(pageConfig, pageConfigIndex) in swipeItem.pageConfig"
              :key="pageConfig.moduleFlag"
            >
              <image
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfigIndex === 0 &&
                    pageConfig.moduleFlag !== '0001'
                "
                class="spcl_banner_bg_image"
                :src="swipeItem.headerBgUrl"
              />

              <view v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0001'
                ">
                <find-banner-swiper
                  :params="pageConfig.configV2"
                  @buryBannerId="buryBannerId"
                  @openLoginPopup="openLoginPopup"
                />
              </view>

              <!-- icon图标展示页面 -->

              <view
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0002'
                "
                :style="{ margin: '12rpx 20rpx 0 20rpx' }"
              >
                <find-icon-list
                  :params="pageConfig.configV2"
                  @buryIconListId="buryIconListId"
                  @openLoginPopup="openLoginPopup"
                  @open="open"
                />
              </view>

              <!-- 广告位轮播 -->
              <view v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0021'
                ">
                <findAdvertise
                  :params="pageConfig.configV2"
                  @openLoginPopup="openLoginPopup"
                />
              </view>

              <!-- 最新直播 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0003'
                "
                margin="50rpx 0 30rpx 0"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <find-new-live
                  :params="pageConfig.configV2"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>

              <!-- 热门推荐 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0004'
                "
                :margin="'50rpx 0 30rpx 0'"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <find-ad-structure
                  :params="pageConfig.configV2"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>
              <!-- 可配置跳转 新热门专题 -->
              <find-block
                v-if="pageConfig.moduleFlag === '0031'"
                :padding="'50rpx 4% 30rpx 4%'"
                :params="pageConfig.configV2"
                :block-padding="0"
                @openLoginPopup="openLoginPopup"
              >
                <find-new-hot-topic
                  :params="pageConfig.configV2"
                  :page-load-status="pageLoadStatus"
                  style="width: 100%"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>
              <!-- 精选海报 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0005'
                "
                :margin="'50rpx 0 30rpx 0'"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <find-image-block
                  ref="findMiguPic3"
                  :params="pageConfig.configV2"
                  :is-login="isLogin"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>

              <!-- 辽宁特惠 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0006'
                "
                :margin="'50rpx 0 30rpx 0'"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <find-ad-structure
                  :params="pageConfig.configV2"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>

              <!-- 风景 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0007'
                "
                :margin="'50rpx 0 30rpx 0'"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <view class="scenery-out-wrap">
                  <find-scenery-recommend
                    :params="pageConfig.configV2"
                    :page-load-status="pageLoadStatus"
                    @openLoginPopup="openLoginPopup"
                  />
                </view>
              </find-block>
              <!-- 赛事预约 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0032' &&
                    newGamesList.length
                "
                margin="50rpx 0 30rpx 0"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <find-choiceness-games
                  v-if="newGamesList.length"
                  :params="pageConfig.configV2"
                  :off-set-num="offSetNum"
                  :new-games-list="newGamesList"
                  @openLoginPopup="openLoginPopup"
                  @exitSubGame="exitSubGame"
                  @subGame="subGame"
                />
              </find-block>
              <!-- 咪咕视频彩铃样式   左右滑动 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0023'
                "
                :margin="'50rpx 0 30rpx 0'"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <view class="scenery-out-wrap">
                  <find-migu-recommend
                    :params="pageConfig.configV2"
                    :is-login="loginFlag"
                    @openLoginPopup="openLoginPopup"
                  />
                </view>
              </find-block>

              <!-- 音频专题 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0008'
                "
                :margin="'50rpx 0 30rpx 0'"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <find-ad-structure
                  :params="pageConfig.configV2"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>

              <!-- 你会使用5G助手么 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0009'
                "
                :margin="'50rpx 0 30rpx 0'"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <find-ad-structure
                  :params="pageConfig.configV2"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>
              <!-- 直播中的订阅按钮 -->
              <view
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0010'
                "
                :style="{ margin: '20rpx 0 0 0' }"
              >
                <find-live-subscribe
                  :params="pageConfig.configV2"
                  @openLoginPopup="openLoginPopup"
                />
              </view>
              <!-- 直播 -->
              <view
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0011'
                "
                class="live-tab-wrap"
              >
                <find-live-water-falls
                  ref="findLiveWaterFalls"
                  :params="pageConfig.configV2"
                  :show-more-flag="
                    pageConfigIndex != swipeItem.pageConfig.length - 1 &&
                      pageConfig.configV2.pageName == 'recommend_page'
                  "
                  @openLoginPopup="openLoginPopup"
                />
              </view>

              <!-- 视频彩铃 -->
              <view
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0013'
                "
                style="margin-top: 38rpx"
              >
                <cxVideo
                  :is-login="loginFlag"
                  :special-news="specialNews"
                  :is-load-status="isLoadStatus"
                  :label-list="labelList"
                  :iop-list="iopList"
                  :params="swipeItem.pageConfig"
                  @getIopList="getIopList"
                  @refreshList="refreshList"
                  @refreshLabelList="refreshLabelList"
                  @refreshMoreList="refreshMoreList"
                  @openLoginPopup="openLoginPopup"
                />
              </view>
              <!-- 内嵌 web-view -->
              <view
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0030'
                "
                style="margin-top: 38rpx"
              >
                <find-web-view :params="pageConfig.configV2" />
              </view>
              <!-- 音频彩铃 -->
              <view
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0014'
                "
                style="margin-top: 38rpx"
              >
                <cxMusic
                  :label="cxMusicLabel"
                  :home="this"
                  :music-list-init="cxMusicList"
                  :current-label-tab="currentLabelTab"
                  :is-leave-current-page="isLeaveCurrentPage"
                  @open="open"
                  @swiperChange="swiperChildChange"
                  @login="login"
                />
                <uni-load-more
                  class="loadingicon"
                  icon-size="20"
                  icon-type="circle"
                  :status="isLoadMoreStatus"
                />
              </view>

              <!-- 咪咕视频 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0015'
                "
                margin="58rpx 0 30rpx 0"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <find-migu-video-falls
                  ref="findMiguVideoFalls"
                  margin="40rpx"
                  :is-login="loginFlag"
                  :params="pageConfig.configV2"
                  :show-more-flag="
                    pageConfigIndex != swipeItem.pageConfig.length - 1 &&
                      pageConfig.configV2.pageName == 'recommend_page'
                  "
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>

              <!-- 咪咕图片-咪咕视频 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0016'
                "
                margin="50rpx 0 30rpx 0"
                :params="pageConfig.configV2"
                @openLoginPopup="openLoginPopup"
              >
                <find-image-falls
                  ref="findMiguPic"
                  :params="pageConfig.configV2"
                  :is-login="isLogin"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>
              <!-- 咪咕圈圈 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0017'
                "
                :params="pageConfig.configV2"
                margin="58rpx 0 30rpx 0"
                @openLoginPopup="openLoginPopup"
              >
                <find-image-falls
                  ref="findMiguPic2"
                  :params="pageConfig.configV2"
                  :is-login="isLogin"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>
              <!-- 今日推荐 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0018'
                "
                :params="pageConfig.configV2"
                margin="58rpx 0 30rpx 0"
                @openLoginPopup="openLoginPopup"
              >
                <find-ad-structure
                  :params="pageConfig.configV2"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>

              <!-- 精选权益 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0019'
                "
                :params="pageConfig.configV2"
                margin="50rpx 0 30rpx 0"
                @openLoginPopup="openLoginPopup"
              >
                <find-ad-structure
                  :params="pageConfig.configV2"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>

              <!-- 全部视频 -->
              <find-block
                v-if="
                  pageName == swipeItem.pageName &&
                    pageConfig.moduleFlag === '0020'
                "
                :params="pageConfig.configV2"
                margin="50rpx 0 30rpx 0"
                @openLoginPopup="openLoginPopup"
              >
                <find-short-video-block
                  :params="pageConfig.configV2"
                  @openLoginPopup="openLoginPopup"
                />
              </find-block>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 自定义Tabbar -->
    <custom-tabbar
      :tab-bar="tabBar"
      :mid-button="true"
    />
  </view>
</template>

<script>
import CustomTabbar from "@/components/CustomTabbar/CustomTabbar.vue";
import FindService from "../../api/find/tabAndbanner";
export default {
  name: "Index",
  components: { CustomTabbar },
  data () {
    return {
      tabBar: this.$store.getters.tabbarList,
      tabList: [],
    };
  },
  onLoad () {
    this.getTabList();
  },
  methods: {
    // 获取tabList
    getTabList () {
      FindService.getTab({ tabTarget: "fx" }).then(res => {
        console.log(res);
      });
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
</style>
