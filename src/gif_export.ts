import { drawForOptions, ScaleMode } from "./gif_renderer"
import { BlueGif } from "./blueizer"
import { loadImage } from "./image_loader"

const GifEncoder = require('gif-encoder')


const saveGif = (imageData: BlueGif, scaleMode: ScaleMode) => {
    const gif = new GifEncoder(imageData.width, imageData.height)

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const p = new Promise((resolve) => {
        const parts: any[] = []
        gif.on('data', (data: any) => parts.push(data))
        gif.on('end', () => {
            const blob = new Blob(parts, { type: 'image/gif' })
            resolve(blob)
        })
    })

    gif.setRepeat(0) // infinite loop
    gif.writeHeader()

    setTimeout(() => {
        for (let i = 0; i < imageData.frames.length; ++i) {
            drawForOptions(canvas, ctx, imageData, scaleMode, i)
            gif.addFrame(ctx.getImageData(0, 0, imageData.width, imageData.height).data)
            gif.setDelay(imageData.frames[i].delay * 10)
        }
        gif.finish()
    }, 0)
    return p
}

export default (imageData: BlueGif, scaleMode: ScaleMode) => {
    if (isNaN(imageData.blueFrame)) {
        return saveGif(imageData, scaleMode)
    }

    // Load image using coors
    return loadImage('https://crossorigin.me/' + imageData.image.source, true).then(image => {
        const frames = imageData.frames.concat()
        frames[imageData.blueFrame] = image
        const blueGif: BlueGif = {
            image,
            frames,
            blueFrame: imageData.blueFrame,
            width: imageData.width,
            height: imageData.height
        }
        return saveGif(blueGif, scaleMode)
    })
}