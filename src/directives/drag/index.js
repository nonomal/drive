export default [
    'drag', {
        inserted(el) {

            el.onmousedown = function (e) {
                var disx = e.pageX - el.offsetLeft;
                var disy = e.pageY - el.offsetTop;
                document.onmousemove = function (e) {
                    el.style.left = e.pageX - disx + "px";
                    el.style.top = e.pageY - disy + "px";
                    let clientWidth = window.innerWidth - 230;
                    let clientHeight = window.innerHeight - 75;
                    let minLeft = 250;
                    if (parseInt(el.style.left) >= clientWidth)
                        el.style.left = clientWidth + "px";
                    if (parseInt(el.style.top) >= clientHeight)
                        el.style.top = clientHeight + "px";
                    if (parseInt(el.style.left) <= minLeft)
                        el.style.left = minLeft + "px";
                    if (parseInt(el.style.top) <= 0) el.style.top = 0 + "px";
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        }
    }
]