import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { UserInfo, TickingStat } from '../types';
import { Avatar, Button, Paper, Divider, withStyles, Theme, createStyles } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Popover from '@material-ui/core/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


type Props = {
    userInfo: UserInfo,
    tickingStat: TickingStat,
    onStopTime: () => void,
    onThemeClick: (isDark: boolean) => void,
    isDarkTheme: boolean,
    classes: any,
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
    }
});


class Header extends React.Component<Props, {anchorEl: HTMLElement}> {

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

    render() {
        let {userInfo, onStopTime, tickingStat, onThemeClick, isDarkTheme, classes} = this.props;
        let isOpen = Boolean(this.state.anchorEl);
        return <div style={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" aria-label="Menu">
                        <Avatar src="/static/images/pabu-head.png"/>
                    </IconButton>
                    <Typography variant="h6" color="inherit">
                        Pabu
                    </Typography>
                    <div style={{flexGrow: 1, textAlign: 'center'}}>{
                        tickingStat.ticking ? <Button variant="contained" color="secondary" onClick={onStopTime}>stop time</Button> : null
                    }</div>
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
