<template>
  <view>
    <ebConfigContainerAsync
      v-if="activityId && pageConfig"
      :page-config-list="pageConfig"
      :activity-id="activityId"
    />
    <!-- 下线通知 -->
    <offline-popup
      v-if="Boolean($store.state.offlinePopup.offlinePopupShow)"
      ref="offlinePopup"
    />
  </view>
</template>

<script>
import ebConfigContainerAsync from "@/components/eb-comp/eb-config-container/eb-config-container-async.vue";
import TemplateService from "../../api/template/index";
export default {
  name: "TemplateConfig",
  components: {
    ebConfigContainerAsync,
  },
  data () {
    return {
      pageName: "",
      activityId: "S2022112447b73",
      templateId: "",
      pageConfig: null,
    };
  },
  onLoad (options) {
    this.activityId = options.activityId;
    this.templateId = options.templateId;
    this.pageName = options.pageName;
    uni.setNavigationBarTitle({
      title: this.pageName,
    });
    this.getPageConfig();
  },
  methods: {
    getPageConfig () {
      TemplateService.getPageConfigByPageName({ pageName: `${this.templateId}_${this.activityId}` }).then(res => {
        if (res.data.code === 200) {
          this.pageConfig = res.data.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
