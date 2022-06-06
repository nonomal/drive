import { getFileTotal } from '../api/file'
import app from '../main'
const state = {
    parent_file_id: "root",
    video_info: null,
    isOpen: false,
    favorite: 'file',
    currentPage: 1,
    fileTotal: 0,
    totalPage: 1,
    pageLimit: 50,
    routers: [{ file_name: '首页', path: 'root' }],
}
const actions = {
    async getFileTotle({ commit }, data) {
        try {
            let { status, message, total } = await getFileTotal(data)
            if (status == 200) commit('SET_FILE_TOTAL', total)
            else app.$message.error(message)
            // eslint-disable-next-line no-empty
        } catch (error) { }

    }
}
const mutations = {
    SET_FILE_TOTAL(state, payload) {
        state.fileTotal = payload
        state.totalPage = Math.ceil(payload / state.pageLimit)
    },
    SET_PAGE_DATA(state, payload) {
        state.currentPage = payload
    },
    SET_CURRENT_PAGE(state, payload) {
        state.currentPage = payload
    },
    SET_PARENT_FILE_ID(state, payload) {
        state.parent_file_id = payload
    },
    SET_VIDEO_INFO(state, payload) {
        state.video_info = payload
    },
    SET_IS_OPEN(state, payload) {
        state.isOpen = payload
    },
    SET_ROUTER(state, payload) {
        let temp = state.routers.pop()
        if (!temp.file_name.includes('结果')) {
            state.routers.push(temp)
            temp = null
        }
        state.routers.push(payload)
    },
    REMOVE_ROUTER(state, payload) {
        state.routers.splice(payload, 100)
    },
    SET_FAVORITE(state, payload) {
        state.favorite = payload
    },
}
const getters = {
}



export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}