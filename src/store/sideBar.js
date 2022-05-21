const state = {
    isCollapse: false,
    routers: [
        {
            path: "/drive/file",
            name: "文件",
            disable: false,
            icon: "el-icon-files",
        },
        {
            path: "/drive/album",
            name: "照片",
            disable: false,
            icon: "el-icon-picture-outline",
        },
        {
            path: "/drive/favorite",
            name: "收藏夹",
            disable: false,
            icon: "el-icon-star-off",
        },
        {
            path: "/drive/userInfo",
            name: "用户中心",
            disable: true,
            icon: "el-icon-user",
        },
    ],
    rules: {
        oldPass: [
            { required: true, message: "密码是必须的", trigger: "blur" },
            {
                min: 8,
                max: 14,
                message: "长度不对哦！长度应在8-14之间",
                trigger: "blur",
            },
        ],
    },
    styleClass: 'el-icon-s-fold'
}
const actions = {}
const mutations = {
    SET_ISCOLLAPSE(state, payload) {
        state.isCollapse = payload
        console.log(payload);
        if (payload) state.styleClass = "el-icon-s-unfold"
        else state.styleClass = "el-icon-s-fold"
    },
}
const getters = {}



export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}