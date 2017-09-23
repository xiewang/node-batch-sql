ApiClient = require('./taobaosdk/index.js').ApiClient;
var Promise = require('bluebird');

const client = new ApiClient({
    'appkey': '24545248',
    'appsecret': '9e69eb2ab9fa086d31ddf043493a6a49',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});
client.execute('taobao.tbk.coupon.get', {
    'me': 'ACpKjLd51vsN%2BoQUE6FNzD%2FIVJnwr3XmJ8I4kT0WNq1aYBW0e1yb1ffiXcqNMyU%2Fq9ZzFzkS1vTgY2pvFtHSBhpywujSvOp2nUIklpPPqYJ%2F4hbdijd0dbNaaMDqjmgyGcJ29LMwOGAbtq7U6vS1BP0ieyMHFfd4'
}, function (error, response) {
    if (!error)
        console.log(response.data.coupon_total_count);
    else
        console.log(error);
});

