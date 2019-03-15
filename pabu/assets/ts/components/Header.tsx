import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { UserInfo, TickingStat } from '../types';
import { Avatar, Button, Switch } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Popover from '@material-ui/core/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


type Props = {
    userInfo: UserInfo,
    tickingStat: TickingStat,
    onStopTime: () => void,
    onThemeClick: () => void,
    isDarkTheme: boolean,
}

export default class Header extends React.Component<Props, {anchorEl: HTMLElement}> {

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
        let {userInfo, onStopTime, tickingStat, onThemeClick, isDarkTheme} = this.props;
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
                    <IconButton style={{width: 40, height: 40}} onClick={onThemeClick}>
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
                <div className="profile-popover-content">
                    <div>
                        {userInfo.picture ?
                            <Avatar className="avatar" src={userInfo.picture}/> :
                            <AccountCircle className="avatar"/>
                        }
                    </div>
                    <div className="info-container">
                        <div className="name">{userInfo.name}</div>
                        <div className="email">{userInfo.email}</div>
                        <div className="provider">(Provider: {userInfo.providerName})</div>
                        <div className="summary"></div>
                    </div>
                </div>
                <div className="profile-popover-actions">
                    <Button variant="contained" color="secondary" component="a" href="/auth/logout">Logout</Button>
                </div>
                </Popover>
        </div>
    }
}
