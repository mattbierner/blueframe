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

interface ViewerState {
    gif: string
    blueImage: string

    gifImageData: Gif | null
    blueImageData: ImageFrame | null
    blueGif: BlueGif | null
    loadingGif: boolean
    scaleMode: ScaleMode
    exporting: boolean
    error?: string
}

/**
 * Displays an interative scanlined gif with controls. 
 */
class Viewer extends React.Component<null, ViewerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            gif: 'https://media3.giphy.com/media/SEO7ub2q1fORa/giphy.gif',
            blueImage: 'https://braddstudios.files.wordpress.com/2010/11/blue-velvet-0003.jpg',

            gifImageData: null,
            blueImageData: null,
            blueGif: null,

            scaleMode: scaleModes[0],

            loadingGif: false,
            exporting: false
        }
    }

    componentDidMount() {
        this.image_loader(this.state.gif, this.state.blueImage)
    }

    private image_loader(leftGif: string, rightGif: string) {
        this.setState({ loadingGif: true })

        Promise.all([
            leftGif && this.state.gifImageData && this.state.gifImageData.source === leftGif
                ? Promise.resolve(this.state.gifImageData)
                : loadGif(leftGif),
            rightGif && this.state.blueImageData && this.state.blueImageData.source === rightGif
                ? Promise.resolve(this.state.blueImageData)
                : loadImage(rightGif)
        ])
            .then(([leftData, rightData]) => {
                if (leftGif !== this.state.gif || rightGif !== this.state.blueImage)
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
                if (leftGif !== this.state.gif || rightGif !== this.state.blueImage)
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
        this.image_loader(src, this.state.blueImage)
    }

    public shuffle() {
        if (!this.state.blueGif)
            return

        this.setState({
            blueGif: blueize(this.state.gifImageData, this.state.blueImageData)
        })
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
                            searchTitle='Primary Gif'
                            label='primary'
                            source={this.state.gif}
                            onGifSelected={(gif) => this.onGifSelected(gif)} />
                    </div>

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
