
export default async function getImageColor(url, colorType, type) {
    return new Promise((resolve, reject) => {
        fetchImage(url).then(image => {
            let { width, height } = image.getBoundingClientRect()
            let canvasELe = document.createElement('canvas')
            canvasELe.width = width
            canvasELe.height = height
            let ctx = canvasELe.getContext('2d')
            ctx.drawImage(image, 0, 0)
            document.body.appendChild(canvasELe)
            resolve(formatData(ctx.getImageData(0, 0, width, height), colorType, type))
            image.remove()
            image = null;
            canvasELe.remove()
            canvasELe = null
        }).catch(error => {
            reject(error)
        })
    })

}

function fetchImage(url) {
    return new Promise((resolve, reject) => {
        let image = new window.Image()
        image.src = url
        // 设置图片跨域 ，图片的跨域资源请求不需要凭证标志
        image.crossOrigin = 'anonymous'
        document.body.appendChild(image)
        image.onload = resolve.bind(null, image)
        image.onerror = function () {
            reject(new Error(`cannot load image: ${url}`))
            // reject(new Error('uncaught Exception'))
        }
    })
}

function formatData(imageData, colorType, type) {
    if (!(imageData instanceof ImageData)) return Error('params is not instanceof ImageData')
    let imageDataArr = imageData.data,
        imageDataLength = imageDataArr.length,
        pixelCount = imageDataLength / 4
    let imageInfo = { r: 0, g: 0, b: 0 }
    let opposition = { r: 0, g: 0, b: 0 }
    for (let i = 0; i < imageDataLength; i++) {
        if (i % 4 == 0) {
            imageInfo.r += imageDataArr[i]
        }
        if (i % 4 == 1) {
            imageInfo.g += imageDataArr[i]
        }
        if (i % 4 == 2) {
            imageInfo.b += imageDataArr[i]
        }
    }
    for (let key in imageInfo) {
        let result = parseInt(imageInfo[key] / pixelCount)
        imageInfo[key] = result
        if (colorType == "opposition") {
            opposition[key] = 255 - result
        }
    }

    if (type == 'HEX') {
        return {
            mainColor: `rgb(${Object.values(imageInfo).toString()})`,
            oppositionColor: `rgb(${Object.values(opposition).toString()})`
        }
    } else {
        return {
            mainColor: imageInfo
        }
    }

}