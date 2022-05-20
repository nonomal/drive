import { getUserInfo } from '../api/users'
import { getUserUsedDrive } from '../api/file'
import app from '../main'
const state = {
    userInfo: {},
}
const actions = {
    async getUserInfo({ commit }) {
        let { userInfo, status, message } = (await getUserInfo())
        if (status == 200) commit('SET_USERINFO', userInfo[0])
        else app.$message.error(message)
    },
    async getUserDrive({ commit }) {
        let { data, status, message } = (await getUserUsedDrive({ drive_id: state.userInfo.drive_id }))
        if (status == 200) commit('SET_USERINFO_DRIVE', data[0])
        else app.$message.error(message)
    }
}
const mutations = {
    SET_USERINFO(state, data) {
        state.userInfo = data
    },
    SET_USERINFO_DRIVE(state, { drive_used, drive_size }) {
        state.userInfo['drive_used'] = drive_used
        state.userInfo['drive_size'] = drive_size
    }
}
const getters = {
    getUserInfo() {
        return state.userInfo
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}