import * as React from 'react';
import { withStyles, Theme, createStyles } from "@material-ui/core";
import { connect } from 'react-redux';
import { ThunkDispatcher, Store, TickingStat } from '../types';
import { formatDuration, formatStopwatchDuration } from '../tools';


const styles = ({ palette, typography }: Theme) => createStyles({

});

type Props = {
    classes: any,
    tickingStat: TickingStat,
    initialValue: number,
    projectId: number,
    issueId?: number,
}

type State = {
    value: number,
    timerId: NodeJS.Timeout,
    started: number,
}

class StopWatch extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            value: this.props.initialValue,
            timerId: null,
            started: 0,
        }
    }

    componentWillReceiveProps(props: Props) {
        this.setState({value: props.initialValue});
        if (this.isTicking(props))
            this.startTicking()
        else
            this.stopTicking()
    }

    private isTicking(props: Props = this.props): boolean {
        const {projectId, issueId, tickingStat} = props;

        if (!tickingStat.ticking)
            return false;

        if (!tickingStat.entry)
            return false;

        if (tickingStat.entry.projectId != projectId)
            return false;

        if (issueId && tickingStat.entry.issueId != issueId)
            return false;

        return true;
    }

    private stopTicking = () => {
        clearInterval(this.state.timerId)
    }

    private startTicking = () => {
        this.stopTicking();
        const timerId = setInterval(() => {
            const now = new Date().getTime()/1000;
            const elapsed = now - this.state.started;
            this.setState({value: this.state.value + elapsed, started: now});
        }, 1000);
        this.setState({timerId, started: new Date().getTime()/1000})
    }

    componentDidMount() {
        if (this.isTicking())
            this.startTicking()
    }

    componentWillUnmount() {
        this.stopTicking()
    }

    render() {
        const value = this.state.value;
        return <span>{this.isTicking() ? formatStopwatchDuration(value) : formatDuration(value)}</span>
    }
}

function mapStateToProps(state: Store) {
    const { tickingStat } = state;
    return {
        tickingStat
    }
}

export default withStyles(styles)(connect(mapStateToProps)(StopWatch));
