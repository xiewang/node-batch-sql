import React, { Component } from 'react';
import  Upload from 'rc-upload';

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
        this.uploaderProps = {
            action: '/mail',
            data: { },
            headers: {
                Authorization: '',
            },
            multiple: true,
            beforeUpload(file) {
                console.log('beforeUpload', file.name);
            },
            onStart: (file) => {
                console.log('onStart', file.name);
                // this.refs.inner.abort(file);
            },
            onSuccess(file) {
                alert('onSuccess', file);
            },
            onProgress(step, file) {
                console.log('onProgress', Math.round(step.percent), file.name);
            },
            onError(err) {
                alert('onError', err);
            },
        };
    }

    componentDidMount() {
    }


    render() {
        return (
            <div className="App">
                <div className="header">
                    <span>上传mail.txt</span>
                </div>
                <div className="section">
                    <label htmlFor="code"><span>txt:</span></label>
                    <Upload {...this.uploaderProps} ref="inner"><a>点击上传</a></Upload>
                </div>
            </div>
        );
    }
}

export default App;
