var express = require('express')
var app = express()
var add = require('./src/server')
var upload = require('./src/server/upload.js')
var storeCode = require('./src/server/storeCode.js')
var test = require('./src/server/test.js')
var addEmail = require('./src/server/addEmail.js')

var bodyParser = require('body-parser')
var multer = require('multer');
var path = multer({dest: __dirname + '/public'});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.post('/add', add);
app.post('/upload', path.single('file'), upload);
app.post('/storeCode', storeCode);
app.get('/test', test);
app.get('/addmail', addEmail);

app.listen(3001, function () {
    console.log('Mock Data Server on port %d', 3001)
})