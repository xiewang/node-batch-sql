import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import Route from './route';

import './index.css';

window.f7 = new window.Framework7({
    pushState: true,
});

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Route />
    </Provider>,
    document.getElementById('root')
);
