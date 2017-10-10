import React, { Component } from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: ''
        };
    }

    componentDidMount() {
    }

    openAU() {
        window.open('https://api.weibo.com/oauth2/authorize?client_id=3994075567&redirect_uri=http://www.996shop.com&response_type=code');
    }

    _codeChange(event) {
        this.setState({code: event.target.value});
    }

    storeCode() {
        let success;
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const code = this.state.code.split('?')[1].split('=')[1];
        let options = {
            method: 'POST',
            headers: headers,
            body: 'code='+code
        };

        fetch('/storeCode', options).then((response) => {
            if (response.status === 200) {
                success = true;
                const json = response.json();
                return json;
            } else {
                success = false;
                return {};
            }
        }).then((responseData) => {
            if (success) {
                alert('success')
            }

        }).catch((error) => {
            console.log(error);
        });

    }

    render() {
        return (
            <div className="App">
                <div className="header">
                    <span>微博</span>
                </div>
                <div>
                    <button onClick={this.openAU}>验证授权</button>
                </div>
                <div>
                    <input type="text" value={this.state.code} onChange={this._codeChange.bind(this)}/>
                    <button onClick={this.storeCode.bind(this)} >存code</button>
                </div>
            </div>
        );
    }
}

export default App;
