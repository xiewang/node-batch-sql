ApiClient = require('./taobaosdk/index.js').ApiClient;
var _ = require('lodash');
var Promise = require('bluebird');
var comm = require('../utils/common');
var mysql = require('mysql');
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

function fetchData() {
    return new Promise(function (resolve, reject) {
        var client = new ApiClient({
            'appkey': '24545248',
            'appsecret': '9e69eb2ab9fa086d31ddf043493a6a49',
            'REST_URL': 'http://gw.api.taobao.com/router/rest'
        });
        client.execute('taobao.tbk.dg.item.coupon.get', {
            'adzone_id': '119412095',
            'platform': '1',
            'cat': '',
            'page_size': '100',
            'q': '',
            'page_no': random(100)
        }, function (error, response) {
            if (!error) {
                var data = response.results.tbk_coupon;
                resolve(data);
            } else {
                console.log(error);
                resolve(false);
            }
        });
    });

};

function start() {
    var host = 'http://996shop.com';
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
            post_content: '',
            post_title: '',
            post_status: 'publish',
            comment_status: 'open',
            ping_status: 'open',
            post_name: '',
            post_parent: 0,
            guid: host + '/bd/' + id,
            menu_order: 0,
            post_type: 'post',
            comment_count: 0,
            hao_yuanj: '',
            hao_xianj: '',
            hao_youh: '',
            hao_ljgm: '',
            kouling: '',
            hao_leix: '天猫',
            hao_zongl: '1000',
            item_id: '',
            hao_zhutu: '',
            hao_xiaol: '',
            post_category: 49
        };
        warpData();
    });

    var warpData = function () {
        fetchData().then(function (res) {
            if (res) {
                _.each(function (v, k) {
                    add(v);
                })

            }
        });
    };

    var add = function (data) {
        var coupon = 0;
        if (/满(\d{1,})元减(\d{1,})元/.test(data.coupon_info)) {
            coupon = data.coupon_info.split('元')[1].substr(1);
        } else if (/(\d{1,})元无条件券/.test(data.coupon_info)) {
            coupon = data.coupon_info.split('元')[0];
        }

        sqlKV.hao_leix = data.user_type == '1' ? '天猫' : '淘宝';
        sqlKV.item_id = data.num_iid;
        sqlKV.hao_zhutu = data.pict_url;
        sqlKV.hao_xiaol = data.volume;
        sqlKV.post_content = data.item_description;
        sqlKV.post_title = data.title;
        sqlKV.hao_yuanj = data.zk_final_price;
        sqlKV.hao_xianj = Math.round((data.zk_final_price - coupon) * 100) / 100;
        sqlKV.hao_youh = coupon;
        sqlKV.hao_ljgm = data.coupon_click_url;
        sqlKV.hao_zongl = data.coupon_total_count;
        sqlKV.post_category = '';
        logger.info(sqlKV);

        var add_post = 'INSERT INTO wp_posts SET `ID` = ' + sqlKV.id +
            ',`post_author` = ' + sqlKV.post_author +
            ',`post_content` = \"' + sqlKV.post_content +
            '\",`post_title` = \"' + sqlKV.post_title +
            '\",`post_date` = \"' + sqlKV.post_date +
            '\",`post_date_gmt` = \"' + sqlKV.post_date_gmt +
            '\",`post_modified` = \"' + sqlKV.post_date +
            '\",`post_modified_gmt` = \"' + sqlKV.post_date_gmt +
            '\",`guid` = \"' + sqlKV.guid + '\"';
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
            '(' + sqlKV.id + ',"hao_xiaol",' + sqlKV.hao_xiaol + ')';
        var add_term_relationships = 'INSERT INTO wp_term_relationships (object_id,term_taxonomy_id,term_order) values ' +
            '(' + sqlKV.id + ',' + sqlKV.post_category + ',"0")';
        var update_term_taxonomy = 'UPDATE wp_term_taxonomy SET count=count+1 where term_taxonomy_id = ' + sqlKV.post_category;


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
        connection.query(update_term_taxonomy, function (error, results, fields) {
            if (error) {
                logger.error(error);
            }
            logger.info('update_term_taxonomy ' + results.affectedRows + ' rows');
            response.status(200).send({result: 'success', link: sqlKV.guid});
        });

        connection.end();
    }
}

function random(count) {
    return Math.ceil(Math.random() * count);
}


module.exports = start;