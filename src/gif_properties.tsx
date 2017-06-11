
import * as React from 'react'
import { BlueGif } from "./blueizer";
import { Gif } from "./image_loader";

/**
 * Property of a gif.
 */
class GifProperty extends React.Component<{ value: string | number, label: string }, null> {
    render() {
        return (
            <div className="property">
                <span className="key">{this.props.label}</span>: <span className="value">{this.props.value}</span>
            </div>
        )
    }
}

/**
 * Set of metadata displayed about a gif.
 */
export default class GifProperties extends React.Component<{ gif: BlueGif | Gif }, null> {
    render() {
        return (
            <div className="gif-properties">
                <GifProperty label="Frames" value={this.props.gif && this.props.gif.frames ? this.props.gif.frames.length : ''} />
                <GifProperty label="Width" value={this.props.gif ? this.props.gif.width : ''} />
                <GifProperty label="Height" value={this.props.gif ? this.props.gif.height : ''} />
            </div>
        );
    }
}