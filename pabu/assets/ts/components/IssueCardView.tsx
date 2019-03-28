import { createStyles, Theme, Typography, withStyles, Avatar, Tooltip, Link } from "@material-ui/core";
import * as React from 'react';
import { DragDropContext, Draggable, Droppable, DroppableStateSnapshot, DropResult } from "react-beautiful-dnd";
import { IssueByStatusMap, IssueStatus, UserMap, TickingStat } from "../types";
import classNames = require("classnames");
import AccountCircle from '@material-ui/icons/AccountCircle';
import StopWatch from "../containers/StopWatch";
import IssueActionIcons from "./IssueActionIcons";
import { removeKeys } from "../tools";
import IssueViewDialog from "./IssueViewDialog";

const styles = ({ palette, shape, typography }: Theme) => createStyles({
    card: {
        borderRadius: shape.borderRadius,
        backgroundColor: palette.background.default,
        '&:hover': {
            opacity: 0.8,
        },
        boxShadow: '0px 0px 5px rgba(0,0,0,.3)',
    },
    avatar: {
        color: typography.caption.color,
        width: 24,
        height: 24,
    },
});

export type StateProps = {
    issues: IssueByStatusMap,
    users: UserMap,
}

export type DispatchProps = {
    onDragEnd: (result: DropResult, issues: IssueByStatusMap) => void,
}

export type OwnProps = {
    id: number,
    tickingStat: TickingStat,
    onAddNewIssue: (projectId: number) => void,
    onAddNewTime: (projectId: number, issueId: number) => void,
    onDeleteIssue: (projectId: number, issueId: number) => void,
    onUpdateIssue: (projectId: number, issueId: number) => void,
    startTime: (projectId: number, issueId: number) => void,
    stopTime: () => void,
    doneDateFilter: number,
}

type MuiProps = {
    classes: any,
}

type Props = OwnProps & StateProps & DispatchProps & MuiProps;

type State = {
    openedIssueDialogs: Array<number>,
}

class IssueCardView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            openedIssueDialogs: [],
        }
    }

    private openDialog = (id: number) => {
        this.setState({openedIssueDialogs: this.state.openedIssueDialogs.concat([id])})
    }

    private closeDialog = (id: number) => {
        let openedIssueDialogs = this.state.openedIssueDialogs.slice();
        openedIssueDialogs.splice(openedIssueDialogs.indexOf(id), 1);
        this.setState({openedIssueDialogs});
    }

    private isDialogOpen = (id: number) => this.state.openedIssueDialogs.indexOf(id) != -1;

    render () {

        let {issues, onDragEnd, classes, users} = this.props;

        const isDifferentStatus = (status: string, {isDraggingOver, draggingOverWith}: DroppableStateSnapshot): boolean => {
            return isDraggingOver && draggingOverWith && !issues[status].filter(i => i.id == parseInt(draggingOverWith)).length;
        }

        return <div className="card-container">
            <DragDropContext onDragEnd={result => onDragEnd(result, issues)}>{Object.values(IssueStatus).map(s =>
                <div className="card-column" key={s}>
                    <Typography variant="h6" className="card-column-header">{s}</Typography>
                    <Droppable droppableId={s} >{({innerRef, droppableProps, placeholder}, snapshot) => (
                        <div key={s} ref={innerRef} {...droppableProps} className={classNames('droppable', {hovering: isDifferentStatus(s, snapshot)})}>
                            {issues[s].map((i, idx) =>
                            <Draggable draggableId={i.id.toString()} index={idx} key={i.id}>
                                {({innerRef, dragHandleProps, draggableProps}) => (
                                    <div className={classes.card + ' card'} ref={innerRef} {...draggableProps} {...dragHandleProps}>
                                        <div className="header">
                                            <Typography className="title" variant="subtitle1">
                                                <Link onClick={this.openDialog.bind(this, i.id)}>#{i.id}</Link> {i.name}
                                            </Typography>
                                            {users[i.userId].avatar ?
                                                <Avatar className={classes.avatar} src={users[i.userId].avatar}/> :
                                                <AccountCircle className={classes.avatar}/>}
                                        </div>
                                        <div className="footer">
                                            <Typography style={{opacity: 0.6, flexGrow: 1}}>
                                                <StopWatch projectId={i.projectId} issueId={i.id} initialValue={i.timeStat.spent} />
                                            </Typography>
                                            <IssueActionIcons issue={i} {...removeKeys<Props>(this.props, 'classes')} />
                                        </div>
                                    </div>
                                )}
                            </Draggable>)}
                            {placeholder}
                        </div>
                    )}</Droppable>
                </div>
            )}</DragDropContext>
            {Object.values(IssueStatus).map(s => issues[s].map(i => <IssueViewDialog
                key={i.id} issue={i} show={this.isDialogOpen(i.id)} onClose={this.closeDialog.bind(this, i.id)} />))}
        </div>
    }
}

export default withStyles(styles)(IssueCardView);
