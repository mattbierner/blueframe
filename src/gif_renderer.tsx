import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BlueGif } from "./blueizer";

export interface ScaleMode {
    readonly name: string
    readonly description: string
}

export const scaleToFit: ScaleMode = {
    name: 'Scale to Fit',
    description: 'Scale image to fit within the gif'
}

export const scaleAndCrop: ScaleMode = {
    name: 'Scale and Crop',
    description: 'Scale image proportionally to cover the gif and then crop'
}

export const actualSize: ScaleMode = {
    name: 'Actual Size',
    description: 'Draw image centered in the canvas at its actual size'
}


export const scaleModes = [scaleToFit, scaleAndCrop, actualSize]

export function drawForOptions(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    gif: BlueGif,
    mode: ScaleMode,
    currentFrame: number
) {
    canvas.width = gif.width
    canvas.height = gif.height

    const frame = gif.frames[currentFrame]

    if (mode === scaleToFit) {
        context.drawImage(frame.canvas, 0, 0, canvas.width, canvas.height)
    } else if (mode === scaleAndCrop) {
        const scaleX = gif.width / frame.width
        const scaleY = gif.height / frame.height
        const scale = Math.max(scaleX, scaleY)
        const newWidth = scale * frame.width
        const newHeight = scale * frame.height

        context.drawImage(frame.canvas, (gif.width - newWidth) / 2, (gif.height - newHeight) / 2, newWidth, newHeight)
    } else if (mode === actualSize) {
        context.drawImage(frame.canvas, (gif.width - frame.width) / 2, (gif.height - frame.height) / 2, frame.width, frame.height)
    }
}

interface GifRendererProps {
    gif: BlueGif
    currentFrame: number
    scaleMode: ScaleMode
}

/**
 * Renders a interleaved gif. 
 */
export default class GifRenderer extends React.Component<GifRendererProps, null> {
    _ctx: any;
    _canvas: any;

    componentDidMount() {
        this._canvas = ReactDOM.findDOMNode(this)
        this._ctx = this._canvas.getContext('2d')
        this.drawGifForOptions(this.props.gif, this.props)
    }

    componentWillReceiveProps(newProps: GifRendererProps) {
        this.drawGifForOptions(newProps.gif, newProps)
    }

    drawGifForOptions(imageData: any, props: GifRendererProps) {
        if (imageData) {
            drawForOptions(this._canvas, this._ctx, imageData, props.scaleMode, props.currentFrame)
        }
    }

    render() {
        return (<canvas className="gif-canvas" width="0" height="0" />)
    }
}
