"use strict";

var fs = require("fs");
var Promise = require('bluebird');
var rp = require('request-promise');
var log4js = require('log4js');
log4js.configure({
    appenders: {
        out: {type: 'stdout'},
        app: {type: 'file', filename: 'application.log'}
    },
    categories: {
        default: {appenders: ['out', 'app'], level: 'debug'}
    }
});
var logger = log4js.getLogger();
logger.level = 'debug';

var send = function () {
    fs.readFile(__dirname+'/../../token.text', 'utf-8', function (err, data) {
        if (err) {
            console.log(__dirname)
            return false
        } else {
            getToken(data);
        }
    })

};

var getToken = function (data) {
    var options = {
        method: 'post',
        uri: 'https://api.weibo.com/2/statuses/share.json',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        formData: {
            access_token: data,
            status: 'bandaowang'
        },
        timeout: 15000
    };
    rp(options)
        .then(function (res) {
            if (res)
                logger.info(res)
        })
        .catch(function (err) {
            logger.error(err);
        })
};
send();

module.exports = send;