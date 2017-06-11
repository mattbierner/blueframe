const omggif = require('omggif');

const minDelay = 3

export class Frame {
    constructor(
        public readonly delay: number,
        public readonly canvas: HTMLCanvasElement,
        public readonly width: number,
        public readonly height: number
    ) { }

    public withDelay(delay: number): Frame {
        return new Frame(
            delay,
            this.canvas,
            this.width,
            this.height
        )
    }
}

export interface Gif {
    source: string
    width: number
    height: number
    frames: Frame[]
}

export class ImageFrame extends Frame {
    constructor(
        public readonly source: string,
        canvas: HTMLCanvasElement,
        width: number,
        height: number
    ) {
        super(1, canvas, width, height);
    }
}

/**
 * Get a file as binary data.
 */
const loadBinaryData = (url: string): Promise<Uint8Array> => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    const p = new Promise((resolve, reject) => {
        xhr.onload = () => {
            if (xhr.status !== 200)
                return reject(`Could not load: ${url}`);
            const arrayBuffer = xhr.response;
            resolve(new Uint8Array(arrayBuffer));
        };
    });
    xhr.send(null);
    return p;
};
/**
 * Extract metadata and frames from binary gif data.
 */
const decodeGif = (byteArray: Uint8Array, url: string) => {
    const gr = new omggif.GifReader(byteArray);
    return {
        source: url,
        width: gr.width,
        height: gr.height,
        frames: extractGifFrameData(gr)
    }
}

/**
 * Handle IE not supporting new ImageData()
 */
const createImageData = (() => {
    try {
        new ImageData(1, 1);
        return (width: number, height: number) => new ImageData(width, height);
    } catch (e) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        return (width: number, height: number) => ctx.createImageData(width, height);
    }
})();

/**
 * Extract each frame of metadata / frame data (as a canvas) from a gif.
 */
const extractGifFrameData = (reader: any): any[] => {
    const frames = []
    const { width, height } = reader;

    const imageData = createImageData(width, height);
    for (let i = 0, len = reader.numFrames(); i < len; ++i) {
        const info = reader.frameInfo(i);
        info.delay = Math.max(minDelay, info.delay)
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        reader.decodeAndBlitFrameRGBA(i, imageData.data);
        ctx.putImageData(imageData, 0, 0);
        frames.push(new Frame(info.delay, canvas, width, height))
    }
    return frames;
}


export const loadGif = (url: string): Promise<Gif> =>
    loadBinaryData(url).then(data => decodeGif(data, url));

export const loadImage = (url: string): Promise<ImageFrame> =>
    new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = ''
        img.addEventListener('load', () => {
            const width = img.naturalWidth
            const height = img.naturalHeight
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            resolve(new ImageFrame(url, canvas, width, height))
        }, false)
        img.src = url
    })