import * as React from "react";
import * as ReactDOM from "react-dom";

import CssBaseline from '@material-ui/core/CssBaseline';

import '../scss/app.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import Root, { store } from "./containers/Root";
import { fetchProjects, fetchTickingStat, openProject, setDarkTheme } from "./actions";
import { LocalStorageKey } from "./types";

library.add(fab, fas, far);

if (window['initialData'].isLoggedIn) {
    store.dispatch(fetchProjects());
    store.dispatch(fetchTickingStat());
    let openedProjectId = parseInt(window.localStorage.getItem(LocalStorageKey.OPENED_PROJECTID)) || 0;
    if (openedProjectId)
        store.dispatch(openProject(openedProjectId));

    let isDarkTheme = !!(parseInt(window.localStorage.getItem(LocalStorageKey.IS_DARK_THEME)) || 0);
    store.dispatch(setDarkTheme(isDarkTheme));
}

ReactDOM.render(
    <React.Fragment>
        <CssBaseline />
        <Root/>
    </React.Fragment>,
    document.getElementById("body")
);
