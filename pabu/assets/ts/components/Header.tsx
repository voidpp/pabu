import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { UserInfo } from '../types';
import { Avatar, Button } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Popover from '@material-ui/core/Popover';


export default class Header extends React.Component<{userInfo: UserInfo}, {anchorEl: HTMLElement}> {

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
        let userInfo = this.props.userInfo;
        let isOpen = Boolean(this.state.anchorEl);
        return <div style={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" aria-label="Menu">
                        <Avatar src="/static/images/pabu-head.png"/>
                    </IconButton>
                    <Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
                        Pabu
                    </Typography>
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
