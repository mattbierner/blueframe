import { drawForOptions, ScaleMode } from "./gif_renderer";
import { BlueGif } from "./blueizer";

const GifEncoder = require('gif-encoder');

/**
 * 
 */
export default (imageData: BlueGif, scaleMode: ScaleMode, props: any) => {
    const gif = new GifEncoder(imageData.width, imageData.height);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const p = new Promise((resolve) => {
        const parts: any[] = [];
        gif.on('data', (data: any) => parts.push(data));
        gif.on('end', () => {
            const blob = new Blob(parts, { type: 'image/gif' });
            resolve(blob);
        });
    });

    gif.setRepeat(0); // infinite loop
    gif.writeHeader();

    setTimeout(() => {
        for (let i = 0; i < imageData.frames.length; ++i) {
            drawForOptions(canvas, ctx, imageData, scaleMode, Object.assign({ currentFrame: i }, props));
            gif.setDelay(imageData.frames[i].delay * 10);
            gif.addFrame(ctx.getImageData(0, 0, imageData.width, imageData.height).data);
        }
        gif.finish();
    }, 0);
    return p;
};