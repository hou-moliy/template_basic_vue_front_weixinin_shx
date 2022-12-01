<template>
	<view :class='["uni-popup-dialog",isOpen?"uni-popup-dialog-open":""]'>
		<view v-if="isOpen" class="uni-dialog-top_view">
			<image class="uni-dialog-top_image" :src="`${staticImgs}/lnmp/vip_open_yp.png`"></image>
		</view>
		<view class='uni-dialog-top'>
			<view class="uni-dialog-title">
				<text class="uni-dialog-title-text" :class="['uni-popup__'+dialogType]">{{title}}</text>
			</view>
			<view :class='["uni-dialog-content",isOpen?"uni-dialog-content-open":""]'>
				<text :class='["uni-dialog-content-text",isOpen?"uni-dialog-content-text-open":""]' v-if="mode === 'base'">{{content}}</text>
				<input v-else class="uni-dialog-input" v-model="val" type="text" :placeholder="placeholder" :focus="focus">
			</view>
		</view>
		<view v-if="single" class="uni-dialog-button-group">
			<view class="uni-dialog-button" @click="onOk">
				<text class="uni-dialog-button-text uni-button-color">{{confirmConent}}</text>
			</view>
		</view>
		<view class="uni-dialog-button-group" v-else>
			<view class="uni-dialog-button" @click="close">
				<text class="uni-dialog-button-text">取消</text>
			</view>
			<view class="uni-dialog-button uni-border-left" @click="onOk">
				<text class="uni-dialog-button-text uni-button-color">{{confirmConent}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	/**
	 * PopUp 弹出层-对话框样式
	 * @description 弹出层-对话框样式
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
	 * @property {String} value input 模式下的默认值
	 * @property {String} placeholder input 模式下输入提示
	 * @property {String} type = [success|warning|info|error] 主题样式
	 *  @value success 成功
	 * 	@value warning 提示
	 * 	@value info 消息
	 * 	@value error 错误
	 * @property {String} mode = [base|input] 模式、
	 * 	@value base 基础对话框
	 * 	@value input 可输入对话框
	 * @property {String} content 对话框内容
	 * @property {Boolean} beforeClose 是否拦截取消事件
	 * @event {Function} confirm 点击确认按钮触发
	 * @event {Function} close 点击取消按钮触发
	 */

	export default {
		name: "uniPopupLoginTips",
		props: {
			value: {
				type: [String, Number],
				default: ''
			},
			placeholder: {
				type: [String, Number],
				default: '请输入内容'
			},
			/**
			 * 对话框主题 success/warning/info/error	  默认 success
			 */
			type: {
				type: String,
				default: 'error'
			},
			/**
			 * 对话框模式 base/input
			 */
			mode: {
				type: String,
				default: 'base'
			},
			/**
			 * 对话框标题
			 */
			title: {
				type: String,
				default: '提示'
			},
			/**
			 * 对话框内容
			 */
			content: {
				type: String,
				default: ''
			},
			/**
			 * 对话框内容
			 */
			confirmConent: {
				type: String,
				default: "确定"
			},
			/**
			 * 拦截取消事件 ，如果拦截取消事件，必须监听close事件，执行 done()
			 */
			beforeClose: {
				type: Boolean,
				default: false
			},
			/**
			 * 是否是开通弹窗
			 */
			isOpen: {
				type: Boolean,
				default: false
			},
			/**
			 * 是否是开通弹窗
			 */
			openType: {
				type: String,
				default: ""
			},
			single: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dialogType: 'error',
				focus: false,
				val: "",
				staticImgs: this.$staticImgs,
			}
		},
		inject: ['popup'],
		watch: {
			type(val) {
				this.dialogType = val
			},
			mode(val) {
				if (val === 'input') {
					this.dialogType = 'info'
				}
			},
			value(val) {
				this.val = val
			}
		},
		created() {
			// 对话框遮罩不可点击
			this.popup.mkclick = false
			if (this.mode === 'input') {
				this.dialogType = 'info'
				this.val = this.value
			} else {
				this.dialogType = this.type
			}
		},
		mounted() {
			this.focus = true
		},
		methods: {
			/**
			 * 点击确认按钮
			 */
			onOk() {
				this.$emit('confirm', () => {
					this.popup.close()
					if (this.mode === 'input') this.val = this.value
				}, this.mode === 'input' ? this.val : '')
			},
			/**
			 * 点击取消按钮
			 */
			close() {
				if (this.beforeClose) {
					this.$emit('close', () => {
						this.popup.close()
					})
					return
				}
				this.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-popup-dialog {
		width: 560rpx;
		border-radius: 20rpx;
		background-color: #fff;
		height: 327rpx;
	}

	.uni-popup-dialog-open {
		height: 500rpx;
	}

	.uni-dialog-top {
		height: 236rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.uni-dialog-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 15px;
		padding-bottom: 5px;
	}

	.uni-dialog-title-text {
		font-size: 36rpx;
		font-family: PingFang SC Bold, PingFang SC Bold-Bold;
		font-weight: 700;
		text-align: center;
		color: #333333;
	}

	.uni-dialog-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 5px 15px 15px 15px;
	}

	.uni-dialog-content-text {
		font-size: 14px;
		color: #6e6e6e;
	}

	.uni-dialog-content-text-open {
		font-size: 26rpx;
		font-family: PingFang SC Medium, PingFang SC Medium-Medium;
		font-weight: 500;
		text-align: center;
		color: #999999;
		width: 443rpx;
	}

	.uni-dialog-button-group {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		border-top-color: #f5f5f5;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-dialog-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */

		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 88rpx;
	}

	.uni-border-left {
		border-left-color: #f0f0f0;
		border-left-style: solid;
		border-left-width: 1px;
	}

	.uni-dialog-button-text {
		font-size: 30rpx;
		font-family: PingFang SC Medium, PingFang SC Medium-Medium;
		font-weight: 500;
		color: #999999;
	}

	.uni-button-color {
		font-family: PingFang SC Bold, PingFang SC Bold-Bold;
		font-weight: 700;
		background: #FF6829;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;

	}

	.uni-dialog-input {
		flex: 1;
		font-size: 14px;
	}

	.uni-popup__success {
		color: $uni-color-success;
	}

	.uni-popup__warn {
		color: $uni-color-warning;
	}

	.uni-popup__error {
		color: $uni-color-error;
	}

	.uni-popup__info {
		// color: #909399;
		color: black;
		font-weight: bold;
	}

	.uni-dialog-top_view {
		height: 171rpx;
		background-image: linear-gradient(#fbdda5, #eac488);
		padding-top: 0rpx;
		display: flex;
		justify-content: center;
		border-radius: 20rpx 20rpx 25% 25%;
	}

	.uni-dialog-top_image {
		width: 182rpx;
		height: 125rpx;
		display: block;
		padding-top: 46rpx;
	}
</style>
