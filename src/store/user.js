import { getUserInfo } from '../api/users'
import { getUserUsedDrive } from '../api/file'
import catchError from '../utils/catchError'
import app from '../main'
const state = {
    userInfo: {},
}
const actions = {
    async getUserInfo({ commit }) {
        let [err, { userInfo, status, message }] = (await catchError(getUserInfo()))
        if (err) app.$message.error(err)
        if (status == 200) commit('SET_USERINFO', userInfo[0])
        else app.$message.error(message)

    },
    async getUserDrive({ commit }) {
        let [err, { data, status, message }] = (await catchError(getUserUsedDrive({ drive_id: state.userInfo.drive_id })))
        if (err) app.$message.error(err)
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
    getUserInfo(state) {
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