import { createStyles, Theme, Typography, withStyles, Avatar, Tooltip } from "@material-ui/core";
import * as React from 'react';
import { DragDropContext, Draggable, Droppable, DroppableStateSnapshot, DropResult } from "react-beautiful-dnd";
import { IssueByStatusMap, IssueStatus, UserMap } from "../types";
import classNames = require("classnames");
import AccountCircle from '@material-ui/icons/AccountCircle';
import StopWatch from "../containers/StopWatch";

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
}

type MuiProps = {
    classes: any,
}

export default withStyles(styles)(React.memo((props: OwnProps & StateProps & DispatchProps & MuiProps) => {

    let {issues, onDragEnd, classes, users} = props;

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
                                    <div className="card-header">
                                        <Tooltip title={i.name}>
                                            <Typography variant="subtitle1" style={{
                                                whiteSpace: 'nowrap',
                                                maxWidth: 260,
                                                textOverflow: 'ellipis',
                                                overflow: 'hidden',
                                            }}>
                                                #{i.id} {i.name}
                                            </Typography>
                                        </Tooltip>
                                        <Typography style={{opacity: 0.6, flexGrow: 1}}>
                                            <StopWatch projectId={i.projectId} issueId={i.id} initialValue={i.timeStat.spent} />
                                        </Typography>
                                        <div>
                                            {/* controls */}
                                        </div>
                                    </div>
                                    <Tooltip title={users[i.userId].name}>
                                    {users[i.userId].avatar ?
                                        <Avatar className={classes.avatar} src={users[i.userId].avatar}/> :
                                        <AccountCircle className={classes.avatar}/>}
                                    </Tooltip>
                                </div>
                            )}
                        </Draggable>)}
                        {placeholder}
                    </div>
                )}</Droppable>
            </div>
        )}</DragDropContext>
    </div>

}))