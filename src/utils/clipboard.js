export function copy(str) {
    if (!str) return Promise.reject('内容不能为空')
    navigator.clipboard.writeText(str).then(() =>
        this.$notify({ title: "成功", message: "已成功复制到粘贴板！", type: "success" })
    )
        .catch(() =>
            this.$notify({
                title: "失败",
                message: "复制失败!请手动复制",
                type: "error",
            })
        );
}