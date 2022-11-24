<template>
  <view>
    <ebConfigContainerAsync
      v-if="pageConfig"
      :page-config-list="pageConfig"
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
import TemplateServce from "../../api/template/index";
export default {
  name: "TemplateConfig",
  components: {
    ebConfigContainerAsync,
  },
  data () {
    return {
      pageName: "",
      activityId: "",
      templateId: "",
      pageConfig: null,
    };
  },
  onLoad (options) {
    this.activityId = options.activityId;
    this.templateId = options.templateId;
    this.pageName = options.pageName;
    this.getPageConfig();
  },
  methods: {
    getPageConfig () {
      TemplateServce.getPageConfigByPageName({ pageName: `${this.templateId}_${this.activityId}` }).then(res => {
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
