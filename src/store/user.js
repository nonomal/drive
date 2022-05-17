import { getUserInfo } from '../api/users'
import { getUserUsedDrive } from '../api/file'
const state = {
    userInfo: {},
}
const actions = {
    async getUserInfo({ commit }) {
        let data = (await getUserInfo()).userInfo[0]
        commit('SET_USERINFO', data)
    },
    async getUserDrive({ commit }) {
        let data = (await getUserUsedDrive({ drive_id: state.userInfo.drive_id })).data[0]
        commit('SET_USERINFO_DRIVE', data)
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