"use strict";

var fs = require("fs");
var send = require('./senWeibo.js');
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

module.exports = function (req, response, next) {
    var options = {
        method: 'post',
        uri: 'https://api.weibo.com/oauth2/access_token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Request-Promise'
        },
        qs: {
            client_id: '***',
            client_secret: '***',
            redirect_uri: 'http://www.996shop.com',
            grant_type: 'authorization_code',
            code: req.body.code
        },
        json: true
    };
    rp(options)
        .then(function (res) {
            if (res){
                fs.writeFile('token.text', res.access_token, function(err){
                    if(err) throw err;
                    response.status(200).send({result:'success'});
                });
            }
        })
        .catch(function (err) {
            logger.error(err);
        })

};