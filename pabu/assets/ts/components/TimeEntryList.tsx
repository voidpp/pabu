
import * as React from 'react';
import { IssueMap, ExpandedTimeEntry } from '../types';
import { Table, TableHead, TableCell, TableBody, TableRow, IconButton, Theme, createStyles, withStyles, TablePagination, TableFooter, TableSortLabel } from '@material-ui/core';

import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = ({ palette, typography }: Theme) => createStyles({
    icon: {
        width: 35,
        height: 35,
    },
});

type Props = {
    entries: Array<ExpandedTimeEntry>,
    issues: IssueMap,
    classes: any,
    onDelete: (id: number, projectId: number) => void,
}

type State = {
    page: number,
    rowsPerPage: number,
    orderBy: string,
    order: "asc" | "desc",
}

function sort(orderBy: string, isAsc: boolean, a, b) {
    let res: number;
    if (b[orderBy] < a[orderBy])
        res = 1;
    else if (b[orderBy] > a[orderBy])
        res = -1;
    else
        res = 0;
    return isAsc ? res : -res;
}

const headerFields = [
    {name: 'start', label: 'Start', formatter: v => moment.unix(v).format('YYYY-MM-DD HH:mm')},
    {name: 'spentHours', label: 'Length', formatter: (v: number) => {
        const hours = v/3600;
        if (hours >= 1)
            return `${hours.toFixed(1)} hours`
        return (v/60).toFixed(2) + ' minutes'
    }},
    {name: 'issueName', label: 'Issue', formatter: v => v},
    {name: 'userName', label: 'User', formatter: v => v},
]

class TimeEntryList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            page: 0,
            rowsPerPage: 5,
            order: 'desc',
            orderBy: 'start',
        }
    }

    private getEntries(): Array<ExpandedTimeEntry> {
        const { entries } = this.props;
        const { page, rowsPerPage, order, orderBy } = this.state;
        entries.sort(sort.bind(null, orderBy, order == 'asc'));
        return entries.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    }

    private handleHeaderClick = (fieldName: string) => {
        if (this.state.orderBy == fieldName)
            this.setState({order: this.state.order == 'asc' ? 'desc' : 'asc'})
        else
            this.setState({orderBy: fieldName})
    }

    render() {
        const { entries, classes, onDelete } = this.props;

        return <Table>
            <TableHead>
                <TableRow>
                    {headerFields.map(field => <TableCell>
                        <TableSortLabel
                            active={field.name == this.state.orderBy}
                            direction={this.state.order}
                            onClick={this.handleHeaderClick.bind(this, field.name)}
                        >
                            {field.label}
                        </TableSortLabel>
                    </TableCell>)}
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>{
                this.getEntries().map(entry => <TableRow key={entry.id}>
                    {headerFields.map(field => <TableCell>{field.formatter(entry[field.name])}</TableCell>)}
                    <TableCell>
                        <IconButton className={classes.icon} onClick={onDelete.bind(this, entry.id, entry.projectId)}>
                            <FontAwesomeIcon icon="trash" style={{ fontSize: 12 }} />
                        </IconButton>
                    </TableCell>
                </TableRow>)
            }</TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        count={entries.length}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        onChangePage={(ev, page) => this.setState({ page })}
                        onChangeRowsPerPage={ev => this.setState({ rowsPerPage: parseInt(ev.target.value) })}
                    />
                </TableRow>
            </TableFooter>
        </Table>
    }
}

export default withStyles(createStyles(styles))(TimeEntryList);
