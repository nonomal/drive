function format(fmt,data = '') {
    let date = null
    if(data == ''){
        date = new Date()
    }else{
        date = new Date(data)
    }
    const o = {
        "Y+": date.getFullYear(),
        "M+": date.getMonth() + 1,     // 月
        "D+": date.getDate(),          // 日
        "h+": date.getHours(),         // 时
        "m+": date.getMinutes(),       // 分
        "s+": date.getSeconds(),       // 秒
        "W": date.getDay()             // 周
    }
    for (var k in o) {
       if (new RegExp("("+ k +")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, () => {
                if (k === 'W') {                                    // 星期几
                    const week = ['日', '一', '二', '三', '四', '五', '六']
                    return week[o[k]]
                } else if (k === 'Y+' || RegExp.$1.length == 1) {    // 年份 or 小于10不加0
                    return o[k]
                } else {
                    return ("00"+ o[k]).substr(("" + o[k]).length)  // 小于10补位0
                }
            })
        }
    }
    return fmt
}


export {
    format
}
// format('星期W')                  // 星期日
// format("YYYY-MM-DD hh:mm:ss")   // 2021-03-21 20:24:32
// format("MM/DD/YYYY hh:mm")      // 03-21-2021 20:24
// format("MM/DD/YYYY hh:mm")      // 03-21-2021 20:24 
// format("YYYY年MM月DD日 hh:mm:ss 星期W") // 2021年03月21日 20:30:14 星期日