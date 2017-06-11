import { Gif, Frame, ImageFrame } from "./image_loader";

export interface BlueGif {
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
    if (gif.frames.length) {
        const targetFrame = 1 + Math.floor(Math.random() * gif.frames.length)
        frames.splice(targetFrame, 0, image)
    }
    return {
        width: gif.width,
        height: gif.height,
        frames: frames
    }
}