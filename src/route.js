import React, { Component } from 'react';
import {
    Route,
    Router,
    browserHistory
} from 'react-router';

import Home from './pages/home';

class DSJRouter extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Home}/>
                <Route/>
            </Router>
        );
    }
}

export default DSJRouter;