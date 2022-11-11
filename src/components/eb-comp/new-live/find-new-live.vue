<template>
  <!-- 最新直播组件 -->
  <view
    v-if="wfList.length"
    class="live-box"
  >
    <view
      v-for="(item,index) in wfList.slice(0,2)"
      :key="index"
      class="living-wrap"
    >
      <livefall-item
        :item="item"
        @openLoginPopup="openLoginPopup"
        @click.native="programaAnalysis(params,item.liveId)"
      />
    </view>
  </view>
</template>

<script>
import liveService from "@/api/live/live.js";
import livefallItem from "../find-live-water-falls/livefallItem.vue";
import {
  programaAnalysis,
} from "@/utils/common.js";
export default {
  name: "FindNewLive",
  components: {
    livefallItem,
  },
  props: {
    params: {
      required: true,
    },
  },
  data () {
    return {
      wfList: [],
      wfParams: {
        pageNum: 1,
        pageSize: 5,
      },
    };
  },
  created () {
    this.getWfList();
  },
  methods: {
    programaAnalysis,
    async getWfList (flag = true) { // flag，true表示刷新或首次加载,false表示加载更多
      const {
        moduleId,
      } = this.params;
      if (!moduleId) return;
      const wfParams = {
        moduleId,
        ...this.wfParams,
      };
      await liveService.getLiveList(wfParams).then(({
        data: res,
      }) => {
        if (res.code === 200) {
          const {
            list,
          } = res.data;
          if (!list.length) return;
          this.wfList = list;
        }
      });
    },
    openLoginPopup () {
      this.$emit("openLoginPopup");
    },
  },
};
</script>

<style lang="scss" scoped>
.live-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.living-wrap + .living-wrap {
  margin-left: 19rpx;
}
</style>
