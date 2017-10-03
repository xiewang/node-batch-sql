ApiClient = require('./taobaosdk/index.js').ApiClient;
var _ = require('lodash');
var Promise = require('bluebird');

module.exports = function () {
    var client = new ApiClient({
        'appkey': '24545248',
        'appsecret': '9e69eb2ab9fa086d31ddf043493a6a49',
        'REST_URL': 'http://gw.api.taobao.com/router/rest'
    });
    client.execute('taobao.tbk.dg.item.coupon.get', {
        'adzone_id': '119412095',
        'platform': '1',
        'cat': '',
        'page_size': '100',
        'q': '女装',
        'page_no': random(100)
    }, function (error, response) {
        if (!error) {
            var data = response.results.tbk_coupon;

        } else {
            console.log(error);
        }

    });
};

function random(count){
    return Math.ceil(Math.random()*count);
}

