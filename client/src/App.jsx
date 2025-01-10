import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import SetMenusPage from './components/SetMenusPage';

const App = () => (
    <Provider store={store}>
        <SetMenusPage />
    </Provider>
);

export default App;
