export const complementary = async () => {
    let { r, g, b, a } = await averageColor('object')
    return `rgba(${255 - r},${255 - g},${255 - b},${a}`
}

export const averageColor = async (type) => {
    let imageData = await createCanvas()
    if (imageData instanceof ImageData) {
        let length = imageData.data.length
        let count = 0
        let rgb = {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        }
        let data = imageData.data
        for (let i = 0; i < length; i += 4) {
            rgb.r += data[i]
            rgb.g += data[i + 1]
            rgb.b += data[i + 2]
            rgb.a += data[i + 3]
            count++
        }
        rgb.r = Math.floor(rgb.r / count)
        rgb.g = Math.floor(rgb.g / count)
        rgb.b = Math.floor(rgb.b / count)
        rgb.a = Math.floor(rgb.a / count)
        if (type == 'string') return `rgba(${255 - rgb.r},${255 - rgb.g},${255 - rgb.b},${rgb.a}`
        if (type == 'object') return rgb
    }
}


function createCanvas() {
    return new Promise((resolve) => {
        let canvas = document.createElement('canvas'),
            img = document.querySelector('#canvasImg'),
            ctx = canvas.getContext('2d');
        let width = 410,
            height = 600
        canvas.width = width
        canvas.height = height
        img.onload = function () {
            ctx.drawImage(this, 0, 0, width, height)
            resolve(ctx.getImageData(0, 0, width, height))
        }
    })

}

