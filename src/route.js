import React, { Component } from 'react';
import {
    Route,
    Router,
    browserHistory
} from 'react-router';

import Home from './pages/home';
import Upload from './pages/upload';
import Weibo from './pages/weibo';

class DSJRouter extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Home}/>
                <Route/>
                <Route path="/u" component={Upload}/>
                <Route/>
                <Route path="/weibo" component={Weibo}/>
                <Route/>
            </Router>
        );
    }
}

export default DSJRouter;