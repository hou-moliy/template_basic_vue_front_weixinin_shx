<template>
  <web-view :src="src" />
</template>

<script>
export default {
  name: "WebView",
  onLoad (options) {
    this.src = `${uni.getStorageSync("H5Data")}`;
  },
  data () {
    return {
      src: "",
    };
  },
  methods: {
  },
};
</script>
