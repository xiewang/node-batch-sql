import React, { Component } from 'react';
import  Upload from 'rc-upload';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        location.href = 'https://api.weibo.com/oauth2/authorize?client_id=3994075567&redirect_uri=http://www.996shop.com&response_type=code'
    }


    render() {
        return (
            <div className="App">
                <div className="header">
                    <span>微博</span>
                </div>

            </div>
        );
    }
}

export default App;
