import * as React from 'react';

import Dashboard from '../containers/Dashboard';
import Login from './Login';
import {UserInfo} from '../types';

type Props = {
    isLoggedIn: boolean,
    userInfo: UserInfo,
    authBackendNames: Array<string>,
}

export default class App extends React.Component<Props> {
    render() {
        let {isLoggedIn, userInfo, authBackendNames} = this.props;
        return <div>{isLoggedIn ? <Dashboard userInfo={userInfo} /> : <Login authBackendNames={authBackendNames}/>}</div>;
    }
}
