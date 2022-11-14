import analysis from '@/utils/analysis.js'
import windowService from "@/api/window/index.js"

export default {
	state: {
		offlinePopupShow: false,
		offlineFlag: false,
		startTime: "",
		endTime: "",
		strategyType: false,
		dialogCancellable: false,
		loginShow: false
	},
	mutations: {
		SET_OFFLINEPOPUPSHOW (state, data) {
			state.offlinePopupShow = data
		},
		SET_OFFLINEFLAG (state, data) {
			state.offlineFlag = data
		},
		SET_STARTTIME (state, data) {
			state.startTime = data
		},
		SET_ENDTIME (state, data) {
			state.endTime = data
		},
		SET_STRATEGYTYPE (state, data) {
			state.strategyType = data
		},
		SET_DIALOGCANCELLABLE (state, data) {
			state.dialogCancellable = data
		},
		SET_LOGINSHOW (state, data) {
			state.loginShow = data
		}
	},
	actions: {
		// 查询是否下线
		getCustomorderList ({ commit }, payload) {
			if (!uni.getStorageSync('pageDownDialog')) {
				windowService.getWindowList({ serviceId: 'pageDownDialog' })
					.then((res) => {
						uni.setStorageSync('pageDownDialog', res.data.data)
					})
			}
			commit("SET_OFFLINEFLAG", false)
			commit("SET_OFFLINEPOPUPSHOW", false)
			commit('SET_LOGINSHOW', false)
			return (
				windowService.getPageStatus({ targetId: payload })
					.then(res => {
						if (res.data.code == 200) {
							res.data.data.forEach(item => {
								if ((item.strategyType == 3 && item.limited == true) && !uni.getStorageSync("Authorization")) {
									commit('SET_LOGINSHOW', true)
									commit("SET_OFFLINEFLAG", false)
									commit("SET_OFFLINEPOPUPSHOW", false)
								} else if ((item.strategyType == 2 || item.strategyType == 1) && item.limited == true) {
									analysis.dispatch('onPageStatusDown', payload)
									commit("SET_OFFLINEPOPUPSHOW", true)
									commit("SET_OFFLINEFLAG", true)
									commit("SET_STARTTIME", item.data.startTime)
									commit("SET_ENDTIME", item.data.endTime)
									commit("SET_STRATEGYTYPE", item.data.strategyType)
									commit("SET_DIALOGCANCELLABLE", item.data.dialogCancellable)
								}
							});
						} else {
							commit("SET_OFFLINEFLAG", false)
							commit("SET_OFFLINEPOPUPSHOW", false)
							commit('SET_LOGINSHOW', false)
						}
						// return true
					})
			)
		},
	}
}