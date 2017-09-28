"use strict";

var fs = require("fs");

module.exports = function (req, res, next) {
    var des_file = __dirname + "/../../public/" + req.file.originalname;
    var response = '';

    fs.rename(req.file.path, des_file, function(err) {
        if (err) throw err;
        fs.unlink(req.file.path, function() {
            if (err) throw err;
            response = {
                message:'File uploaded successfully',
                filename:req.file.originalname
            };
            res.end( JSON.stringify( response ) );
        });
    });
};