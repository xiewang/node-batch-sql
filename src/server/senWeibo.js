"use strict";

var fs = require("fs");
var Promise = require('bluebird');
var rp = require('request-promise');
var request = require('request');
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

/**
 * message{
    text: ''
    imageUrl: ''
    uri:''
}
 *
 */
var send = function (message) {
    message.type = message.type ? message.type : 2;
    return new Promise(function (resolve, rject) {
        fs.readFile(__dirname + '/../../token.text', 'utf-8', function (err, data) {
            if (err) {
                return false
            } else {
                var json = JSON.parse(data);
                var fileUrl = message.imageUrl;
                var filename = message.type + '.png';
                downloadFile(fileUrl, filename, function () {
                    message.token = json['1734550577'];
                    logger.info('======下载成功=====');
                    weibo(message, true);
                    resolve(true)
                });
            }
        })
    });


};

var weibo = function (message,haNext) {
    var options = {
        method: 'post',
        uri: 'https://api.weibo.com/2/statuses/share.json',
        headers: {
            'content-type': 'multipart/form-data'
        },
        formData: {
            pic: {
                value: fs.createReadStream(__dirname + '/' + message.type + '.png'),
                options: {
                    filename: message.type + '.png',
                    contentType: 'image/png'
                }
            },
            access_token: message.token,
            status: message.text
        },
        timeout: 15000,
        json: true
    };
    logger.info(options);
    rp(options)
        .then(function (res) {
            if (res) {
                if (message.uri)
                    comment(message, res.id);
                logger.info('微博发送成功' + message);
            }

        })
        .catch(function (err) {
            logger.error('微博发送失败' + err);
            fs.readFile(__dirname + '/../../token.text', 'utf-8', function (err, data) {
                logger.info('换账号再发');
                var json = JSON.parse(data);
                message.token = json['2163403567'];
                if(haNext)
                    weibo(message,false);
            })

        })
};

var comment = function (message, commentId) {
    var options = {
        method: 'post',
        uri: 'https://api.weibo.com/2/comments/create.json',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Request-Promise'
        },
        qs: {
            comment: message.forComment?message.forComment:'领券&拍：'+message.uri,
            id: commentId,
            access_token: message.token
        },
        timeout: 15000,
        json: true
    };
    logger.info(options);
    rp(options)
        .then(function (res) {
            if (res)
                logger.info('评论发送成功')
        })
        .catch(function (err) {
            logger.error('评论发送失败' + err);
        })
};

var downloadFile = function (uri, filename, callback) {
    var stream = fs.createWriteStream(__dirname + '/' + filename);
    request(uri)
        .on('end', callback)
        .pipe(stream)

};

//var message = {
//    imageUrl : 'http://gaitaobao4.alicdn.com/tfscom/i2/2452347015/TB1CefygPihSKJjy0FlXXadEXXa_!!0-item_pic.jpg',
//    text: '【天猫】M20000超薄充电宝迷你可爱MIUI蘋果6s手机7通用移动电源毫安50000【包邮】\n【在售价】66.90\n【券后价】36.90\n【下单链接】http://www.996shop.com/bd/658988',
//    uri: 'http://www.996shop.com/bd/658988'
//}
//send(message);

module.exports = send;