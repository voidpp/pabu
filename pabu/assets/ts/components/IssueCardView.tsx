import { createStyles, Theme, Typography, withStyles } from "@material-ui/core";
import * as React from 'react';
import { DragDropContext, Draggable, Droppable, DroppableStateSnapshot, DropResult } from "react-beautiful-dnd";
import { IssueByStatusMap, IssueStatus } from "../types";
import classNames = require("classnames");

const styles = ({ palette, typography }: Theme) => createStyles({
    card: {
        height: 100,
        marginBottom: 10,
        padding: 10,
        backgroundColor: palette.background.default,
        borderRadius: 5,
    },
});

export type StateProps = {
    issues: IssueByStatusMap,
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

    let {issues, onDragEnd, classes} = props;

    const isDifferentStatus = (status: string, {isDraggingOver, draggingOverWith}: DroppableStateSnapshot): boolean => {
        return isDraggingOver && draggingOverWith && !issues[status].filter(i => i.id == parseInt(draggingOverWith)).length;
    }

    return <div className="card-container">
        <DragDropContext onDragEnd={result => onDragEnd(result, issues)}>{Object.values(IssueStatus).map(s =>
            <div className="card-column" key={s}>
                <Typography variant="h6" className="card-header">{s}</Typography>
                <Droppable droppableId={s} >{({innerRef, droppableProps, placeholder}, droppableSnapshot) => (
                    <div key={s} ref={innerRef} {...droppableProps}
                         className={classNames('droppable', {hovering: isDifferentStatus(s, droppableSnapshot)})}
                    >
                        {issues[s].map((i, idx) =>
                        <Draggable draggableId={i.id.toString()} index={idx} key={i.id}>
                            {({innerRef, dragHandleProps, draggableProps}, snapshot) => (
                                <div className={classes.card} ref={innerRef} {...draggableProps} {...dragHandleProps}
                                    //  style={{...draggableProps.style, visibility: isDifferentStatus(s, droppableSnapshot) ? 'hidden' : 'initial'}}
                                     >
                                    <Typography variant="h6">{i.name} (#{i.id})</Typography>
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
