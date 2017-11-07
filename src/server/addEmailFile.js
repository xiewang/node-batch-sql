"use strict";

var fs = require("fs");
var add = require("./add.js");
var autoadd = require("./autoadd.js");
var xlsx = require('node-xlsx');
var csv = require('csv');
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
var stringifier = csv.stringify();

module.exports = function (req, res, next) {
    var des_file = __dirname + "/../../public/csv/mail.csv";
    var response = '';

    fs.rename(req.file.path, des_file, function (err) {
        if (err) throw err;
        fs.unlink(req.file.path, function () {
            if (err) {
                throw err
            } else {
                var mails = [];
                var csvdata = fs.readFileSync(`${__dirname}/../../public/csv/mail.csv`);

                csv.parse(csvdata, function (err, data) {
                    var dataL = data.length;
                    var count = 0;
                    csv.transform(data, function (data) {
                        count++;
                        data.map(function (value) {
                            if (/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)) {
                                mails.push(value.toLowerCase());
                            }
                        });
                        if (count === dataL)
                            handleMails(mails);
                    }, function (err, data) {
                        logger.error('csv transform '+err);
                    });
                    //handleMails(mails);
                });

            }

        });
    });

    var handleMails = function (mails) {
        var data = _.sortedUniq(mails);
        if (data.length > 0)
            _.each(data, function (v, k) {
                logger.info(v);
                setTimeout(function () {
                    var item = {
                        mail: v,
                        sent: false
                    };
                    fs.readFile(__dirname + '/../../../mail-sender/mails.txt', 'utf-8', function (err, data) {
                        if (err) {
                            logger.error('read mails failure when add' + err);
                            return false
                        } else {
                            var json = [];
                            if (data)
                                json = JSON.parse(data);
                            if (!_.find(json, {mail: v})) {
                                json.push(item);
                                fs.writeFile(__dirname + '/../../../mail-sender/mails.txt', JSON.stringify(json), function (err) {
                                    if (err) {
                                        logger.error('add mails failure' + err);
                                    }
                                });
                            }
                        }
                    });
                }, 1000 * k)

            })
    };

    res.status(200).send({result: 'success'});

};