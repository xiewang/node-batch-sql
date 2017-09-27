import React, { Component } from 'react';
import {
    Route,
    Router,
    browserHistory
} from 'react-router';

import Home from './pages/home';
import Upload from './pages/upload';

class DSJRouter extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Home}/>
                <Route/>
                <Route path="/u" component={Upload}/>
                <Route/>
            </Router>
        );
    }
}

export default DSJRouter;