import * as React from 'react';

import Dashboard from '../containers/Dashboard';
import Login from './Login';
import { UserInfo } from '../types';
import { Paper } from '@material-ui/core';

import blue from '@material-ui/core/colors/blue';
import lightBlue from '@material-ui/core/colors/lightBlue';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: blue,
    },
});

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: lightBlue,
    },
});

// #006699

type Props = {
    isLoggedIn: boolean,
    userInfo: UserInfo,
    authBackendNames: Array<string>,
    isDarkTheme: boolean,
}


export default class App extends React.Component<Props> {
    render() {
        let { isLoggedIn, userInfo, authBackendNames, isDarkTheme } = this.props;
        return (
            <MuiThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
                <Paper style={{ height: '100%' }}>
                    {isLoggedIn ? <Dashboard userInfo={userInfo} /> : <Login authBackendNames={authBackendNames} />}
                </Paper>
            </MuiThemeProvider>
        )
    }
}
