import * as React from "react";
import * as ReactDOM from "react-dom";

import CssBaseline from '@material-ui/core/CssBaseline';

import '../scss/app.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Root, { store } from "./containers/Root";
import { fetchProjectList } from "./actions";

library.add(fab, fas);

store.dispatch(fetchProjectList());

ReactDOM.render(
    <React.Fragment>
        <CssBaseline />
        <Root/>
    </React.Fragment>,
    document.getElementById("body")
);
