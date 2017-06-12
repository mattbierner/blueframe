import { Gif, Frame, ImageFrame } from "./image_loader";

export interface BlueGif {
    image: ImageFrame
    blueFrame: number | undefined
    width: number
    height: number
    frames: Frame[]
}

/**
 * Great a blue gif.
 * 
 * Never insert the blueframe as the first frame
 */
export const blueize = (gif: Gif, image: ImageFrame): BlueGif => {
    const frames = Array.from(gif.frames)
    let blueFrame = undefined
    if (gif.frames.length) {
        blueFrame = 1 + Math.floor(Math.random() * gif.frames.length)
        frames.splice(blueFrame, 0, image)
    }
    return {
        image,
        blueFrame,
        frames,
        width: gif.width,
        height: gif.height
    }
}