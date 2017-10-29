"use strict";

var fs = require('fs');
var _ = require('lodash');
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

module.exports = function (req, res, next) {
    var mail = req.query.mail;
    var item = {
        mail: mail,
        sent: false
    };
    fs.readFile(__dirname + '/../../../mail-sender/mails.txt', 'utf-8', function (err, data) {

        if (err) {
            logger.error('read mails failure when add'+err);
            return false
        } else {
            var json = [];
            if(data)
                json = JSON.parse(data);
            if(!_.find(json, {mail:mail})){
                json.push(item);
                fs.writeFile(__dirname + '/../../../mail-sender/mails.txt', JSON.stringify(json), function (err) {
                    if (err) {
                        logger.error('add mails failure'+err);
                    };
                });
            }
        }
    });
    res.status(200).send({result:mail});
};