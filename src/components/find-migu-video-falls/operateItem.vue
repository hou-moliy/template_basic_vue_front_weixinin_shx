<template>
	<view class="recommend-wrap" @click="jumpToPage">
		<image :src="item.url" mode=""></image>
	</view>
</template>

<script>
	import {
		navigateByEventType
	} from "@/utils/common.js"
	export default {
		name: 'OperateItem',
		data() {
			return {}
		},
		props: {
			item: {
				type: Object,
				default: () => {}
			}
		},
		methods: {
			handleH5() {
				console.log('调用跳转到h5')
			},
			async jumpToPage() {
				await this.$store.dispatch('getCustomorderList',`runAd_${this.item.videoId}`)
				if (this.$store.state.offlinePopup.loginShow) {
					this.$emit("openLoginPopup");
					return
				}
				if(this.$store.state.offlinePopup.offlineFlag){
					return
				}
				navigateByEventType(this.item,()=>{this.handleH5()})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.recommend-wrap {
		height: 160rpx;
		// background: #f2f2f2;
		border-radius: 10rpx;
		margin-bottom: 25rpx;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;

		image {
			width: 100%;
			height: 100%;
			border-radius: 10rpx;
		}

	}
</style>
