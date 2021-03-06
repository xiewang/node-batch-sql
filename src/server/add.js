var comm = require('../utils/common');
var mysql = require('mysql');
var _ = require('lodash');
var Promise = require('bluebird');
var rp = require('request-promise');
var log4js = require('log4js');
var config = require('../constants.js');
var csv = require('csv');
var fs = require('fs');

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

var connection = '';
//start();

function start() {
    return new Promise(function(resolve, reject){
        fs.readFile(__dirname + '/../../public/csv/result0.csv', function (err, data) {
            if (err) {
                console.log(err.stack);
                resolve(false);
            }
            try{
                //return csv.parse(data, function(err, data){
                //    console.log(data)
                //    return true;
                //});
                resolve(ConvertToTable(data));
            }catch(e){
                resolve(false);
            }
        });
    });

    function ConvertToTable(data) {
        data = data.toString();
        var table = new Array();
        var rows = new Array();
        rows = data.split("\r\n");
        for (var i = 0; i < rows.length; i++) {
            table.push(rows[i].split(","));
        }
        return table;
    }

    connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        insecureAuth: true
    });
    connection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(start, 2000);
        }
    });
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            start();
        } else {
            throw err;
        }
    });

    var sqlKV = {};
    var sql = "select max(id) from wp_posts";
    var id = 0;
    options.uri = promoteLink;

    connection.query(sql, function (error, results, fields) {
        if (error) {
            logger.error(error);
        }
        id = results[0]['max(id)'] + 1;
        sqlKV = {
            post_author: 1,
            id: id,
            post_date: comm.timeFormat((new Date()).getTime(), 'yyyy-MM-dd hh:mm:ss'),
            post_date_gmt: comm.timeFormat((new Date()).getTime(), 'yyyy-MM-dd hh:mm:ss'),
            post_content: req.body.reason ? req.body.reason : '',
            post_title: title,
            post_status: 'publish',
            comment_status: 'open',
            ping_status: 'open',
            post_name: '',
            post_parent: 0,
            guid: host + '/bd/' + id,
            menu_order: 0,
            post_type: 'post',
            comment_count: 0,
            hao_yuanj: oldPrice,
            hao_xianj: newPrice,
            hao_youh: (oldPrice - newPrice),
            hao_ljgm: promoteLink,
            kouling: kouling,
            hao_leix: '天猫',
            hao_zongl: '1000',
            item_id: '',
            hao_zhutu: '',
            hao_xiaol: '',
            post_category: 49
        };
        add();
    });

    var add = function () {



        sqlKV.hao_leix = res.result.item.tmall == '1' ? '天猫' : '淘宝';
        sqlKV.item_id = res.result.item.itemId;
        sqlKV.hao_zhutu = 'http:' + res.result.item.picUrl;
        sqlKV.hao_xiaol = res.result.item.biz30Day;
        sqlKV.item_id = res.result.item.itemId;
        logger.info(sqlKV);
        var add_post = 'INSERT INTO wp_posts SET `ID` = ' + sqlKV.id +
            ',`post_author` = ' + sqlKV.post_author +
            ',`post_content` = \"' + sqlKV.post_content +
            '\",`post_title` = \"' + sqlKV.post_title +
            '\",`post_date` = \"' + sqlKV.post_date +
            '\",`post_date_gmt` = \"' + sqlKV.post_date_gmt +
            '\",`post_modified` = \"' + sqlKV.post_date +
            '\",`post_modified_gmt` = \"' + sqlKV.post_date_gmt +
            '\",`guid` = \"' + sqlKV.guid+'\"' ;
        var add_meta = 'INSERT INTO wp_postmeta (post_id,meta_key,meta_value) values ' +
            '(' + sqlKV.id + ',"hao_yuanj",' + sqlKV.hao_yuanj + '),' +
            '(' + sqlKV.id + ',"hao_xianj",' + sqlKV.hao_xianj + '),' +
            '(' + sqlKV.id + ',"hao_youh",' + sqlKV.hao_youh + '),' +
            '(' + sqlKV.id + ',"hao_ljgm",\"' + sqlKV.hao_ljgm + '\"),' +
            '(' + sqlKV.id + ',"kouling",\"' + sqlKV.kouling + '\"),' +
            '(' + sqlKV.id + ',"hao_leix",\"' + sqlKV.hao_leix + '\"),' +
            '(' + sqlKV.id + ',"hao_zongl",' + sqlKV.hao_zongl + '),' +
            '(' + sqlKV.id + ',"item_id",' + sqlKV.item_id + '),' +
            '(' + sqlKV.id + ',"hao_zhutu",\"' + sqlKV.hao_zhutu + '\"),' +
            '(' + sqlKV.id + ',"hao_xiaol",' + sqlKV.hao_xiaol + ')' ;
        var add_term_relationships = 'INSERT INTO wp_term_relationships (object_id,term_taxonomy_id,term_order) values ' +
            '(' + sqlKV.id + ','+sqlKV.post_category+',"0")';
        var update_term_taxonomy = 'UPDATE wp_term_taxonomy SET count=count+1 where term_taxonomy_id = '+sqlKV.post_category;


        connection.query(add_post, function (error, results, fields) {
            if (error) {
                logger.error(error);
            }
            logger.info('add_post ' + results.affectedRows + ' rows');
        });
        connection.query(add_meta, function (error, results, fields) {
            if (error) {
                logger.error(error);
            }
            logger.info('add_meta ' + results.affectedRows + ' rows');
        });
        connection.query(add_term_relationships, function (error, results, fields) {
            if (error) {
                logger.error(error);
            }
            logger.info('add_term_relationships ' + results.affectedRows + ' rows');
        });
        connection.query(update_term_taxonomy , function (error, results, fields) {
            if (error) {
                logger.error(error);
            }
            logger.info('update_term_taxonomy ' + results.affectedRows + ' rows');
            response.status(200).send({result:'success',link:sqlKV.guid});
        });

        connection.end();
    }

}

module.exports = start;