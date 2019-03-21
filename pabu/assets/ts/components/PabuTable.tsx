
import * as React from 'react';
import { PabuModel, TableRowDesriptor } from '../types';
import { Table, TableHead, TableCell, TableBody, TableRow, IconButton, Theme, createStyles, withStyles, TablePagination, TableFooter, TableSortLabel } from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = ({ palette, typography }: Theme) => createStyles({
    icon: {
        width: 35,
        height: 35,
    },
    controlCell: {
        textAlign: 'center',
    }
});

type Props = {
    rows: Array<PabuModel>,
    classes: any,
    rowDescriptors: Array<TableRowDesriptor>,
    onDelete?: (row: PabuModel, context?: any) => void,
    controllCellHeader?: React.ReactNode,
    controllCellFactory?: (row: PabuModel) => React.Component,
    context?: any,
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

class PabuTable extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            page: 0,
            rowsPerPage: 5,
            order: 'desc',
            orderBy: 'start',
        }
    }

    private getRows(): Array<PabuModel> {
        const { rows } = this.props;
        const { page, rowsPerPage, order, orderBy } = this.state;
        rows.sort(sort.bind(null, orderBy, order == 'asc'));
        return rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    }

    private handleHeaderClick = (fieldName: string) => {
        if (this.state.orderBy == fieldName)
            this.setState({order: this.state.order == 'asc' ? 'desc' : 'asc'})
        else
            this.setState({orderBy: fieldName})
    }

    render() {
        const { rows, classes, onDelete, rowDescriptors, controllCellHeader, controllCellFactory, context } = this.props;

        return <Table>
            <TableHead>
                <TableRow>
                    {rowDescriptors.map(field => <TableCell key={field.name}>
                        <TableSortLabel
                            active={field.name == this.state.orderBy}
                            direction={this.state.order}
                            onClick={this.handleHeaderClick.bind(this, field.name)}
                        >
                            {field.label}
                        </TableSortLabel>
                    </TableCell>)}
                    <TableCell className={classes.controlCell}>{controllCellHeader}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>{
                this.getRows().map(row => <TableRow key={row.id}>
                    {rowDescriptors.map(field => <TableCell key={field.name}>{field.formatter(row[field.name], row)}</TableCell>)}
                    <TableCell className={classes.controlCell}>
                        {controllCellFactory ? controllCellFactory(row) :
                            (onDelete ? <IconButton className={classes.icon} onClick={onDelete.bind(this, row, context)}>
                                <FontAwesomeIcon icon="trash" style={{ fontSize: 12 }} />
                            </IconButton> : null)
                        }
                    </TableCell>
                </TableRow>)
            }</TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        count={rows.length}
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

export default withStyles(createStyles(styles))(PabuTable);
