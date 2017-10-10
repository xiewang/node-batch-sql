"use strict";

var fs = require("fs");

module.exports = function (req, res, next) {
    fs.writeFile('code.text', req.body.code, function(err){
        if(err) throw err;
        res.status(200).send({result:'success'});
    });
};