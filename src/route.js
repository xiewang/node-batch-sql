import React, { Component } from 'react';
import {
    Route,
    Router,
    browserHistory
} from 'react-router';

import Home from './pages/home';
import Upload from './pages/upload';
import Weibo from './pages/weibo';
import Mail from './pages/mail';

class DSJRouter extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Home}/>
                <Route path="/u" component={Upload}/>
                <Route path="/weibo" component={Weibo}/>
                <Route path="/mail" component={Mail}/>
            </Router>
        );
    }
}

export default DSJRouter;