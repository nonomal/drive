export default {
    data() {
        return {
            rules: {
                username: [
                    { required: true, message: "邮箱是必须的", trigger: "blur" },
                    { validator: this.usernameValid, trigger: "blur" },
                ],
                newPassword: [
                    { required: true, message: "密码是必须的", trigger: "blur" },
                    {
                        min: 8,
                        max: 14,
                        message: "长度不对哦！长度应在8-14之间",
                        trigger: "blur",
                    },
                ],
                cPassword: [
                    { required: true, message: "密码是必须的", trigger: "blur" },
                    {
                        min: 8,
                        max: 14,
                        message: "长度不对哦！长度应在8-14之间",
                        trigger: "blur",
                    },
                    {
                        validator: this.cpasswordValid,
                        trigger: "blur",
                    },
                ],
                yanzhengma: [
                    { required: true, message: "验证码是必须的", trigger: "blur" },
                    { type: "number", message: "必须为数字值" },
                ]
            }
        }
    },
    methods: {
        // username验证回调
        usernameValid(rule, value, callback) {
            let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g;
            if (!reg.test(value)) {
                callback(new Error("邮箱格式不正确！"));
            }
            callback();
        },
        //确认密码验证回调
        cpasswordValid(rule, value, callback) {
            if (this.modifyUser.newPassword !== value) {
                callback(new Error("两次密码不相同！"));
            }
            callback();
        },
    }
}