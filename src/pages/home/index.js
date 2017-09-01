import React, { Component } from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            reason: '',
            showTip: false,
            addSuccess: false,
            link: '',
            adding: false
        };
    }

    componentDidMount() {
        //alert(window.clipboardData.getData('Text'));
    }

    _submit() {
        const the = this;
        let success;
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        let options = {
            method: 'POST',
            headers: headers,
            body: 'code='+this.state.code+'&reason='+this.state.reason
        };
        the.setState({adding: true});
        fetch('/add', options).then((response) => {
            if (response.status === 200) {
                success = true;
            } else {
                success = false;
            }
            const json = response.json();
            return json;
        }).then((responseData) => {
            if (success) {
                the.setState({showTip: true});
            }
            if (responseData.result === 'success') {
                the.setState({link: responseData.link});
                the.setState({addSuccess: true});
            } else {
                the.setState({addSuccess: false});
            }
            the.setState({adding: false});
        }).catch((error) => {
            console.log(error);
        });
    }

    _codeChange(event) {
        this.setState({code: event.target.value});
    }

    _reasonChange(event) {
        this.setState({reason: event.target.value});
    }

    render() {
        return (
            <div className="App">
                <div className="header">
                    <span>推荐商品</span>
                </div>
                <div className="section">
                    <label htmlFor="code"><span>联盟代码:</span></label>
                        <textarea name="code" id="" cols="40" rows="10" onChange={this._codeChange.bind(this)}
                                  value={this.state.code}></textarea>
                </div>
                <div className="section">
                    <label htmlFor="reason"><span>推荐理由:</span></label>
                        <textarea name="reason" id="" cols="40" rows="10" onChange={this._reasonChange.bind(this)}
                                  value={this.state.reason}></textarea>
                </div>
                {
                    this.state.showTip ? <div className="section">
                        <span className="tip">{this.state.addSuccess ?
                            <a onClick={location.href=this.state.link}
                               target='_blank'>{this.state.link}</a> : '联盟代码格式不正确'}</span>
                    </div> : null
                }

                <div className="section">
                    {
                        this.state.adding ?
                            <button onClick={this._submit.bind(this)} className="submit" type="button" disabled>
                                提交</button>
                            : <button onClick={this._submit.bind(this)} className="submit" type="button">
                            提交</button>

                    }
                </div>

            </div>
        );
    }
}

export default App;
