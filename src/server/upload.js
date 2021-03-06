"use strict";

var fs = require("fs");
var transform = require("./transformCSV.js");
var add = require("./add.js");
var autoadd = require("./autoadd.js");


module.exports = function (req, res, next) {
    var des_file = __dirname + "/../../public/csv/source." + req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
    var response = '';

    fs.rename(req.file.path, des_file, function (err) {
        if (err) throw err;
        fs.unlink(req.file.path, function () {
            if (err) throw err;
            //transform();
            //add()
            //    .then(function () {
            //        response = {
            //            message: 'File uploaded successfully',
            //            filename: req.file.originalname
            //        };
            //        res.end(JSON.stringify(response));
            //    });
            autoadd();
        });
    });
};