import * as React from 'react'

export default class LoadingSpinner extends React.Component<{ active: boolean }, null> {
    render() {
        return (
            <span className={"material-icons loading-spinner " + (this.props.active ? '' : 'hidden')}>autorenew</span>
        )
    }
}