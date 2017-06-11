import * as React from 'react';
import * as ReactDOM from 'react-dom';

import LabeledSlider from './labeled_slider';
import LoadingSpinner from './loading_spinner';
import GifRenderer, { ScaleMode } from './gif_renderer';
import { Gif } from "./image_loader";
import { BlueGif } from "./blueizer";
import GifProperties from "./gif_properties";


interface GifPlayerProps {
    blueGif: BlueGif | null
    loadingGif: boolean
    scaleMode: ScaleMode
}

interface GifPlayerState {
    currentFrame: number
    playing: boolean
    loop: boolean
}

/**
 * Playback controls for scanlined gif.
 */
export default class GifPlayer extends React.Component<GifPlayerProps, GifPlayerState> {
    constructor(props: GifPlayerProps) {
        super(props)
        this.state = {
            currentFrame: 0,
            playing: false,
            loop: true
        }
    }

    componentWillReceiveProps(newProps: GifPlayerProps) {
        if (this.props.blueGif !== newProps.blueGif) {
            this.setState({
                currentFrame: 0,
                playing: true // autoplay
            });
            this.scheduleNextFrame(newProps.blueGif, 0, true);
        }
    }

    onToggle() {
        this.setState({ playing: !this.state.playing });

        if (!this.state.playing) {
            this.scheduleNextFrame(this.props.blueGif, 0, true);
        }
    }

    getNumFrames() {
        if (!this.props.blueGif)
            return 0;
        return this.props.blueGif.frames.length;
    }

    scheduleNextFrame(leftImageData: BlueGif, delay: number, forcePlay?: boolean) {
        if (!forcePlay && !this.state.playing)
            return;

        const start = Date.now();
        setTimeout(() => {
            if (!this.props.blueGif || this.props.blueGif !== leftImageData)
                return;

            let nextFrame = (this.state.currentFrame + 1);
            if (nextFrame >= this.getNumFrames() && !this.state.loop) {
                this.setState({ playing: false });
                return;
            }

            nextFrame %= this.getNumFrames();

            const interval = ((this.props.blueGif.frames[nextFrame].delay || 1) * 10)
            const elapsed = (Date.now() - start);
            const next = Math.max(0, interval - (elapsed - delay));
            this.setState({
                currentFrame: nextFrame
            });
            this.scheduleNextFrame(leftImageData, next);
        }, delay);
    }

    private onSliderChange(e: any) {
        const frame = +e.target.value % this.getNumFrames();
        this.setState({ currentFrame: frame });
    }

    private onReplay() {
        this.setState({ currentFrame: 0 });
    }

    private nextFrame() {
        this.setState({
            currentFrame: (this.state.currentFrame + 1) % this.props.blueGif.frames.length
        })
    }

    private previousFrame() {
        this.setState({
            currentFrame: this.state.currentFrame - 1 < 0
                ? this.props.blueGif.frames.length - 1
                : (this.state.currentFrame - 1) % this.props.blueGif.frames.length
        })
    }

    render() {
        return (
            <div className="gif-figure">
                <GifRenderer
                    gif={this.props.blueGif}
                    currentFrame={this.state.currentFrame}
                    scaleMode={this.props.scaleMode} />
                <div className="content-wrapper">
                    <GifProperties gif={this.props.blueGif} />
                </div>
                <div>
                    <LoadingSpinner active={this.props.loadingGif} />
                </div>
                <div className="playback-controls content-wrapper">
                    <LabeledSlider className="playback-tracker"
                        min={0}
                        max={this.getNumFrames() - 1}
                        value={this.state.currentFrame}
                        onChange={this.onSliderChange.bind(this)} />

                    <div className="buttons">
                        <button
                            title="Restart"
                            className="material-icons"
                            onClick={this.onReplay.bind(this)}>replay</button>
                        <button
                            className="material-icons"
                            onClick={this.onToggle.bind(this)}>{this.state.playing ? 'pause' : 'play_arrow'}</button>
                        <button
                            className="material-icons"
                            onClick={this.previousFrame.bind(this)}>skip_previous</button>
                        <button
                            className="material-icons"
                            onClick={this.nextFrame.bind(this)}>skip_next</button>
                    </div>
                </div>
            </div>
        )
    }
}
