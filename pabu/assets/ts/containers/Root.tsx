import * as React from 'react'
import { Provider } from 'react-redux'
import configureStore from '../store'
import App from '../containers/App';

export const store = configureStore();

export default class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}
