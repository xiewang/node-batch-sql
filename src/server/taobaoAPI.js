ApiClient = require('./taobaosdk/index.js').ApiClient;
var Promise = require('bluebird');

const client = new ApiClient({
    'appkey': '24545248',
    'appsecret': '9e69eb2ab9fa086d31ddf043493a6a49',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});
client.execute('taobao.tbk.dg.item.coupon.get', {
    'adzone_id':'119412095',
    'platform':'1',
    'cat':'',
    'page_size':'100',
    'q':'女装',
    'page_no':'1'
}, function (error, response) {
    if (!error)
        console.log(response.data.coupon_total_count);
    else
        console.log(error);
});

