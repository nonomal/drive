const log = document.getElementById('log')
const videoBox = document.getElementById('vb')
let videoDom = document.querySelector("#vd")
let fullScree = document.querySelector(".fullScree")
let playDom = document.querySelector(".play")
let controlBarDom = document.querySelector(".controlBar")
let aArray = document.querySelectorAll('.video-status i')
let dianDom = document.querySelector(".video-status .controlBar .dian")
let currentTimeDom = document.querySelector(".video-status .currentTime")
let druationDom = document.querySelector(".video-status .druation")
fullScree.addEventListener("click", fullScreeVideo)
playDom.addEventListener("click", videoDomPlay)
videoDom.addEventListener("click", videoDomPlay)
videoBox.addEventListener("mouseover", function () {
    log.style.bottom = "40px"
})
videoBox.addEventListener("mouseout", function () {
    log.style.bottom = "-40px"
})
aArray[2].addEventListener('click', function () {
    if (videoDom.muted) {
        videoDom.muted = false; // 打开声音
    } else {
        videoDom.muted = true; // 关闭声音
    }
})
controlBarDom.addEventListener("click", function (e) {
    let controlBarLength = parseInt(getComputedStyle(controlBarDom)["width"])
    let currentX = e.offsetX
    videoDom.currentTime = (currentX / controlBarLength) * videoDom.duration
})
videoDom.addEventListener('canplaythrough', function (e) {
    console.log('提示视频的元数据已加载')
    let duration = videoDom.duration
    let currentTimes = videoDom.currentTime
    currentTimeDom.innerText = numToMinute(parseInt(currentTimes))
    druationDom.innerText = numToMinute(parseInt(duration));
})
videoDom.addEventListener("timeupdate", function (e) {
    let duration = videoDom.duration
    let currentTimes = videoDom.currentTime
    currentTimeDom.innerText = numToMinute(parseInt(currentTimes))
    druationDom.innerText = numToMinute(parseInt(duration));
    let dianDomWidth = Number((currentTimes / duration).toFixed(2))
    dianDom.style.width = dianDomWidth * 100 + "%"
})
videoDom.addEventListener("pause", function () {

})
videoDom.addEventListener("ended", function () {
    aArray[1].classList.remove("icon-zanting")
    aArray[1].classList.add("icon-bofang")
})

document.addEventListener("keydown", function (e) {
    if (e.keyCode == 32) {
        videoDomPlay()
    }
})
videoDom.addEventListener("play", function () {

})

function debouce(func, delay, immediate) {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;
        if (timer) clearTimeout(time);
        if (immediate) {
            //根据距离上次触发操作的时间是否到达delay来决定是否要现在执行函数
            var doNow = !timer;
            //每一次都重新设置timer，就是要保证每一次执行的至少delay秒后才可以执行
            timer = setTimeout(function () {
                timer = null;
            }, delay);
            //立即执行
            if (doNow) {
                func.apply(context, args);
            }
        } else {
            timer = setTimeout(function () {
                func.apply(context, args);
            }, delay);
        }
    }
}

function throttle(func, delay, parms) {
    var prev = Date.now();
    return function () {
        var context = this;
        var now = Date.now();
        if (now - prev >= delay) {
            func.apply(context, Array(parms));
            prev = Date.now();
        }
    }
}

function fullScreeAutoShowHide(timer) {
    log.style.bottom = "40px"
    videoBox.style.cursor = "default"
    if (timer) {
        clearTimeout(timer)
    }
    console.log(timer)
    timer = setTimeout(function () {
        log.style.bottom = "-40px"
        videoBox.style.cursor = "url('../image/20201213090747690_easyicon_net_32.ico'),auto"
    }, 3000)
}

function fullScreeVideo() {
    let timer;
    if (!checkFull()) {
        // videoBox.setAttribute('class', 'player full-screen')
        videoBox.requestFullscreen()
        if (videoDom.paused) {
            videoDomPlay()
        }
        videoDom.addEventListener("mousemove", throttle(fullScreeAutoShowHide, 1000, timer))
    } else {
        // videoBox.setAttribute('class', 'player')
        document.exitFullscreen() //要用document调用此函数
    }
}

function videoDomPlay() {
    if (videoDom.paused) {
        videoDom.play()
        aArray[1].classList.remove("icon-bofang")
        aArray[1].classList.add("icon-zanting")
    } else {
        videoDom.pause()
        aArray[1].classList.remove("icon-zanting")
        aArray[1].classList.add("icon-bofang")
    }
}

function numToMinute(num) {
    num = Number(num)
    let minute = parseInt(num / 60)
    let second = parseInt(num - minute * 60)
    if (second <= 9) {
        second = "0" + second
    }
    if (minute <= 9) {
        minute = "0" + minute
    }
    if (num > 60 * 60) {
        let hours = parseInt(num / 60 * 60)
        return `${hours}:${minute}:${second}`
    }
    return `${minute}:${second}`
}

function checkFull() {
    var isFull =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement
    if (isFull === undefined) isFull = false
    return isFull
}

function fullScreen(element) {
    var element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}