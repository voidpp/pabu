import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { UserInfo, TickingStat, ProjectMap, IssueMap } from '../types';
import { Avatar, Button, Paper, Divider, withStyles, Theme, createStyles } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Popover from '@material-ui/core/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StopWatch from '../containers/StopWatch';


export type OwnProps = {
    userInfo: UserInfo,
    version: string,
}

export type StateProps = {
    tickingStat: TickingStat,
    isDarkTheme: boolean,
    projects: ProjectMap,
    issues: IssueMap,
}

export type DispatchProps = {
    onStopTime: () => void,
    onThemeClick: (isDark: boolean) => void,
}


const styles = ({ palette, typography }: Theme) => createStyles({
    profileActions: {
        padding: 10,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    avatar: {
        width: 100,
        height: 100,
    },
    profileContent: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
    },
    version: {
        opacity: 0.6,
        paddingLeft: 5,
        fontSize: '0.8em',
    },
    stopButton: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tickingStatContainer: {
        marginLeft: 10,
        opacity: 0.7,
        fontSize: '0.8em',
    },
    projectInfo: {
        maxWidth: 300,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
});


class Header extends React.Component<OwnProps & StateProps & DispatchProps & {classes: any}, {anchorEl: HTMLElement}> {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    handleProfileMenuOpen = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleMenuClose = () => {
        this.setState({anchorEl: null});
    };

    private renderStopButton(): React.ReactNode {
        const {onStopTime, tickingStat, projects, issues, classes} = this.props;
        const entry = tickingStat.entry;
        return <div className={classes.stopButton}>
            <Button variant="contained" color="secondary" onClick={onStopTime}>stop time</Button>
            <div className={classes.tickingStatContainer}>
                <div className={classes.projectInfo}>
                    {projects[entry.projectId].name}{entry.issueId && entry.issueId in issues ? ` / ${issues[entry.issueId].name}` : ''}
                </div>
                <div>
                    <StopWatch projectId={entry.projectId} initialValue={new Date().getTime() / 1000  - entry.start} />
                </div>
            </div>
        </div>
    }

    render() {
        let {userInfo, tickingStat, onThemeClick, isDarkTheme, classes, version} = this.props;
        let isOpen = Boolean(this.state.anchorEl);

        return <div style={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" aria-label="Menu">
                        <Avatar src="/static/images/pabu-head.png"/>
                    </IconButton>
                    <Typography variant="h6" color="inherit">Pabu</Typography>
                    <Typography variant="subtitle2" color="inherit" className={classes.version}>(v{version})</Typography>
                    {tickingStat.ticking ? this.renderStopButton() : <div style={{flexGrow: 1}}/>}
                    <IconButton style={{width: 40, height: 40}} onClick={onThemeClick.bind(this, !isDarkTheme)}>
                        <FontAwesomeIcon icon={{iconName: 'moon', prefix: isDarkTheme ? 'fas' : 'far'}} style={{fontSize: 15}}/>
                    </IconButton>
                    <IconButton
                        aria-owns={isOpen ? 'material-appbar' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleProfileMenuOpen}
                        color="inherit"
                    >
                        {userInfo.picture ?
                            <Avatar style={{width: 35, height: 35}} src={userInfo.picture}/> :
                            <AccountCircle/>
                        }
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Popover
                id="simple-popper"
                open={isOpen}
                anchorEl={this.state.anchorEl}
                onClose={this.handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                >
                <Paper>
                    <div className={classes.profileContent}>
                        <div>
                            {userInfo.picture ?
                                <Avatar className={classes.avatar} src={userInfo.picture}/> :
                                <AccountCircle className={classes.avatar}/>
                            }
                        </div>
                        <div style={{padding: 10}}>
                            <Typography variant="h6">{userInfo.name}</Typography>
                            <Typography>{userInfo.email}</Typography>
                            <Typography>(Provider: {userInfo.providerName})</Typography>
                        </div>
                    </div>
                    <Divider/>
                    <div className={classes.profileActions}>
                        <Button variant="contained" color="secondary" component="a" href="/auth/logout">Logout</Button>
                    </div>
                </Paper>
                </Popover>
        </div>
    }
}

export default withStyles(styles)(Header);
