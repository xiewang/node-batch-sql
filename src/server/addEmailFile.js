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

module.exports = function (req, res, next) {
    var des_file = __dirname + "/../../public/csv/mail.csv";
    var response = '';

    fs.rename(req.file.path, des_file, function (err) {
        if (err) throw err;
        fs.unlink(req.file.path, function () {
            if (err){
                throw err
            } else {
                //var workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/../../public/csv/mail.csv`));
                var csvdata = fs.readFileSync(`${__dirname}/../../public/csv/mail.csv`);

                csv.parse(csvdata, function(err, data){
                    csv.transform(data, function(data){
                        return data.map(function(value){
                            var val = value.toUpperCase();
                            if(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(val)){
                                
                            }
                        });
                    }, function(err, data){
                        csv.stringify(data, function(err, data){
                            process.stdout.write(data);
                        });
                    });
                });
                //var data = workSheetsFromBuffer[0].data;
                //_.each(data, function (v, k) {
                //    if (k != 0){
                //        logger.info(v[2])
                //        //setTimeout(function(){
                //        //    var item = {
                //        //        mail:  v[0],
                //        //        sent: false
                //        //    };
                //        //    fs.readFile(__dirname + '/../../../mail-sender/mails.txt', 'utf-8', function (err, data) {
                //        //        if (err) {
                //        //            logger.error('read mails failure when add'+err);
                //        //            return false
                //        //        } else {
                //        //            var json = [];
                //        //            if(data)
                //        //                json = JSON.parse(data);
                //        //            if(!_.find(json, {mail:mail})){
                //        //                json.push(item);
                //        //                fs.writeFile(__dirname + '/../../../mail-sender/mails.txt', JSON.stringify(json), function (err) {
                //        //                    if (err) {
                //        //                        logger.error('add mails failure'+err);
                //        //                    };
                //        //                });
                //        //            }
                //        //        }
                //        //    });
                //        //},1000*k)
                //    }
                //
                //})
            }

        });
    });

    //res.status(200).send({result:'success'});

};