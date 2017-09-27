"use strict";

var fs = require("fs");
//var xlsx = require('node-xlsx');
//var multer  = require('multer');
//var storage = multer.memoryStorage();
//var upload = multer({ storage: storage }).array('file', 12);

module.exports = function (req, res, next) {
    console.log(req.files[0]);  // 上传的文件信息

    var des_file = __dirname + "/" + req.files[0].originalname;
    fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
            }else{
                response = {
                    message:'File uploaded successfully',
                    filename:req.files[0].originalname
                };
            }
            console.log( response );
            res.end( JSON.stringify( response ) );
        });
    });
};