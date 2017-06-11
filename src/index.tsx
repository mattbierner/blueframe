import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Gif, ImageFrame, loadGif, loadImage } from './image_loader';
import LabeledSlider from './labeled_slider';
import LoadingSpinner from './loading_spinner';
import GifPlayer from './gif_player';
import exportGif from './gif_export';
import { BlueGif, blueize } from "./blueizer";
import { ScaleMode, scaleModes } from "./gif_renderer";
import GifPicker from "./gif_picker";
import ModeSelector from "./mode_selector";
import { imageSets, ImageSet } from "./image_sets";

interface ViewerState {
    gif: string
    blueImage: string

    gifImageData: Gif | null
    blueImageData: ImageFrame | null
    blueGif: BlueGif | null
    loadingGif: boolean
    scaleMode: ScaleMode
    exporting: boolean

    imageSet: ImageSet

    error?: string
}

class Viewer extends React.Component<null, ViewerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            gif: 'https://media3.giphy.com/media/SEO7ub2q1fORa/giphy.gif',
            blueImage: imageSets[0].getRandomImage(),

            gifImageData: null,
            blueImageData: null,
            blueGif: null,

            scaleMode: scaleModes[0],
            imageSet: imageSets[0],

            loadingGif: false,
            exporting: false
        }
    }

    componentDidMount() {
        this.loadImage(this.state.gif, this.state.blueImage)
    }

    private loadImage(gif: string, blueImage: string) {
        this.setState({ loadingGif: true })

        return Promise.all([
            gif && this.state.gifImageData && this.state.gifImageData.source === gif
                ? Promise.resolve(this.state.gifImageData)
                : loadGif(gif),
            blueImage && this.state.blueImageData && this.state.blueImageData.source === blueImage
                ? Promise.resolve(this.state.blueImageData)
                : loadImage(blueImage)
        ])
            .then(([leftData, rightData]) => {
                if (gif !== this.state.gif || blueImage !== this.state.blueImage)
                    return

                this.setState({
                    gifImageData: leftData,
                    blueImageData: rightData,
                    blueGif: blueize(leftData, rightData),

                    loadingGif: false,
                    error: null
                })
            })
            .catch(e => {
                if (gif !== this.state.gif || blueImage !== this.state.blueImage)
                    return

                console.error(e)
                this.setState({
                    gifImageData: null,
                    blueImageData: null,
                    blueGif: null,

                    loadingGif: false,
                    error: 'Could not load gif'
                })
            });
    }

    private onScaleModeChange(mode: ScaleMode): void {
        this.setState({ scaleMode: mode })
    }

    private onExport() {
        this.setState({ exporting: true })
        exportGif(this.state.blueGif, this.state.scaleMode, this.state).then(blob => {
            this.setState({ exporting: false })
            const url = URL.createObjectURL(blob)
            window.open(url)
        })
    }

    private onGifSelected(src: string) {
        this.setState({ gif: src })
        this.loadImage(src, this.state.blueImage)
    }

    private shuffle() {
        if (!this.state.blueGif)
            return

        const newImage = imageSets[0].getRandomImage()
        this.setState({
            blueImage: newImage
        })
        this.loadImage(this.state.gif, newImage)
    }

    private onImageSetChange() {

    }

    render() {
        return (
            <div className="main container gif-viewer" id="viewer">
                <div className="player-wrapper">
                    <GifPlayer {...this.state} />
                </div>
                <div className="view-controls">
                    <div className='gif-pickers'>
                        <GifPicker
                            searchTitle='Gif'
                            label='gif'
                            source={this.state.gif}
                            onGifSelected={(gif) => this.onGifSelected(gif)} />
                    </div>

                    <ModeSelector
                        title='Image Source'
                        options={imageSets}
                        value={this.state.imageSet}
                        onChange={this.onImageSetChange.bind(this)} />


                    <ModeSelector
                        title='Scale Mode'
                        options={scaleModes}
                        value={this.state.scaleMode}
                        onChange={this.onScaleModeChange.bind(this)} />

                    <div className='shuffle-controls'>
                        <button onClick={this.shuffle.bind(this)}>Shuffle</button>
                    </div>

                    <div className='export-controls'>
                        <button onClick={this.onExport.bind(this)}>Export to gif</button>
                        <div>
                            <LoadingSpinner active={this.state.exporting} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


ReactDOM.render(
    <Viewer />,
    document.getElementById('content'))
