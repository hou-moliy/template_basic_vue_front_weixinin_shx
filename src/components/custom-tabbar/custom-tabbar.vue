<template>
  <view class="tab-bar" :style="{ height: tabBarHeight + 'px' }">
    <view
      v-for="(item, index) in tabBar.list"
      :key="index"
      class="tab-bar-item"
      @click="tbs_SwitchTab(item, index)"
    >
      <image class="cover-image" :src="elIconPath(index)" />
      <view
        class="cover-view"
        :style="{
          color: elColor(index),
        }"
      >
        {{ item.text }}
      </view>
    </view>
  </view>
</template>

<script>
const systemInfo = uni.getSystemInfoSync(); // 系统信息
const isiOS = systemInfo.system.indexOf("iOS") > -1; // 判断是否为 iOS

export default {
  props: {
    tabBar: {
      type: Object,
      default: () => { },
    }, // tabBar数据对象
    value: {
      type: [String, Number],
      default: 0,
    },
  },
  data () {
    return {
      tabBarHeight: 0, // tabBar 的高度
      selected: 0, // 当前选择的 tabBar 的 index，从 0 开始
      pageUrl: "",
    };
  },
  computed: {
    elIconPath () {
      return (index) => {
        // 历遍u-tabbar的每一项item时，判断是否传入了pagePath参数，如果传入了
        // 和data中的pageUrl参数对比，如果相等，即可判断当前的item对应当前的tabbar页面，设置高亮图标
        // 采用这个方法，可以无需使用v-model绑定的value值
        const pagePath = this.tabBar.list[index].pagePath;
        // 如果定义了pagePath属性，意味着使用系统自带tabbar方案，否则使用一个页面用几个组件模拟tabbar页面的方案
        // 这两个方案对处理tabbar item的激活与否方式不一样
        if (pagePath) {
          if (pagePath === this.pageUrl || pagePath === "/" + this.pageUrl) {
            return this.tabBar.list[index].selectIconPath;
          } else {
            return this.tabBar.list[index].iconPath;
          }
        } else {
          // 普通方案中，索引等于v-model值时，即为激活项
          return index === this.value ? this.list[index].selectIconPath : this.list[index].iconPath;
        }
      };
    },
    elColor () {
      return (index) => {
        // 判断方法同理于elIconPath
        const pagePath = this.tabBar.list[index].pagePath;
        if (pagePath) {
          if (pagePath === this.pageUrl || pagePath === "/" + this.pageUrl) return this.tabBar.selectedColor;
          else return this.tabBar.color;
        } else {
          return index === this.value ? this.tabBar.selectedColor : this.tabBar.color;
        }
      };
    },
  },
  created () {
    uni.hideTabBar();
    let navigationBarHeight;
    if (!isiOS) {
      this.tabBarHeight = 54; // 非 iOS 系统 tabBar 高度的数字，单位为 px
      navigationBarHeight = 48;
    } else { // ios
      this.tabBarHeight = 48; // iOS 系统 tabBar 高度的数字，单位为 px
      navigationBarHeight = 44;
    }
    this.pagesHeight = systemInfo.safeArea.height - navigationBarHeight - this.tabBarHeight;

    const ret = {};
    ret.tabBarHeight = this.tabBarHeight;
    ret.pagesHeight = this.pagesHeight;
    console.log(ret);
    this.$emit("tabBarCreateEvent", ret);
    // eslint-disable-next-line no-undef
    const pages = getCurrentPages();
    // 页面栈中的最后一个即为项为当前页面，route属性为页面路径
    this.pageUrl = pages[pages.length - 1].route;
  },
  methods: {
    tbs_SwitchTab (item, i) {
      this.selected = i;
      if (item.pagePath !== this.pageUrl) {
        uni.switchTab({ url: item.pagePath });
      } else {
        return;
      }
      this.$emit("tabBarChangeEvent", {
        selected: i,
      });
    },
  },
};
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  height: 98px;
  box-shadow: -1.04px -3.86px 27px 4px rgba(0, 0, 0, 0.06);
  z-index: 999;
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.tab-bar-item .cover-image {
  width: 60rpx;
  height: 60rpx;
}

.tab-bar-item .cover-view {
  font-size: 24rpx;
}
</style>
