export default function setCenter(zoomDom) {
    let { width, height } = zoomDom;
    zoomDom.style.marginLeft = -width / 2 + "px";
    zoomDom.style.marginTop = -height / 2 + "px";
    zoomDom.style.left = "50%";
    zoomDom.style.top = "50%";
}