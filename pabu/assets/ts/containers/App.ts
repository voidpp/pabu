import { connect } from 'react-redux';
import App from '../components/App';
import { Store } from '../types';

function mapStateToProps(state: Store) {
    const { isDarkTheme } = state;
    return {
        isDarkTheme,
    }
}

export default connect(mapStateToProps)(App);
