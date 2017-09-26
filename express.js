var express = require('express')
var app = express()
var add = require('./src/server'
var upload = require('./src/server/upload.js')
var bodyParser = require('body-parser')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/add', add);
app.post('/upload', upload);

app.listen(3001, function () {
    console.log('Mock Data Server on port %d', 3001)
})