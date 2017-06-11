import * as React from 'react'


interface ModeSelectorProps<T> {
    title: string
    options: T[]
    value: T
    onChange: (mode: T) => void
}

/**
 * Control for selecting rendering mode.
 */
export default class ModeSelector<T> extends React.Component<ModeSelectorProps<{ name: string, description: string }>, null> {
    private onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const mode = this.props.options.find(x => x.name === e.target.value)
        this.props.onChange(mode);
    }

    render() {
        const modeOptions = this.props.options.map(x =>
            <option value={x.name} key={x.name}>{x.name}</option>)

        return (
            <div className='mode-selector control-group'>
                <span className='control-title'>{this.props.title} </span>
                <select value={this.props.value.name} onChange={this.onChange.bind(this)}>
                    {modeOptions}
                </select>
                <div className='control-description'>{this.props.value.description}</div>
            </div>
        )
    }
}