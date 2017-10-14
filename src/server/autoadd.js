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
var cate = require('./cate.js');
var sendWeibo = require('./senWeibo.js');

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
    var random1000 = [
        random(10),
        random(30),
        random(50),
        random(60),
        random(70),
        random(80),
        random(90),
        random(100),
        random(1000),
        random(100000)
    ];

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
            'page_size': 100,
            'q': '',
            'page_no': random1000[random(10) - 1]
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
        id = results[0]['max(id)'];
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
            post_category: 6
        };
        warpData();
    });

    var checkExist = function (data) {
        return new Promise(function (resolve, reject) {
            var sql = "SELECT t1.id,t2.meta_value FROM wp_posts t1,wp_postmeta t2 " +
                "WHERE t2.meta_key='item_id' and t1.id = t2.post_id and t2.meta_value=" + data.num_iid;
            connection.query(sql, function (error, results, fields) {
                if (error) {
                    logger.error(error);
                    resolve(false);
                }
                else if (results.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    };

    var warpData = function () {
        var countForAdd = 0;

        var time = 0;
        var interval = setInterval(function () {
            time++
        }, 1000);

        var allForWeibo = [];
        var hasOne = {2: 0, 3: 0};//避免服装类过多
        var fetchAndAdd = function () {
            var all = [];
            fetchData().then(function (result) {
                if (result.length === 0) {
                    fetchAndAdd();
                    return;
                }

                if (result) {
                    var count = 0;
                    result = _.uniq(result, 'num_iid');

                    _.each(result, function (v, k) {
                        checkExist(v)
                            .then(function (res) {
                                var coupon = 0;
                                if (/满(\d{1,})元减(\d{1,})元/.test(v.coupon_info)) {
                                    coupon = v.coupon_info.split('元')[1].substr(1);
                                } else if (/(\d{1,})元无条件券/.test(v.coupon_info)) {
                                    coupon = v.coupon_info.split('元')[0];
                                }
                                v.coupon_info = parseInt(coupon);
                                if (!res
                                    && ((v.volume > 10 && v.coupon_info >= 5)
                                    || ((v.volume > 100 && v.coupon_info >= 3)))
                                    && ((cate(v.category) === 2 && hasOne[2] < 4)
                                    || (cate(v.category) === 3 && hasOne[3] < 4)
                                    || (cate(v.category) !== 2 && cate(v.category) !== 3))) {

                                    hasOne[cate(v.category)]++;
                                    all.push(v);
                                }
                                count++;
                                if (count == result.length) {
                                    _.each(all, function (v1, k1) {
                                        var sqlId = sqlKV.id + 1;
                                        v1.sqlId = sqlId;
                                        allForWeibo.push(v1);

                                        add(v1);
                                    });

                                    countForAdd = countForAdd + all.length;
                                    logger.info('=========each time countForAdd nums============:' + countForAdd);
                                    if (countForAdd < 60 && time < 600) {
                                        fetchAndAdd();
                                    } else {
                                        clearInterval(interval);
                                        logger.info('=========countForAdd nums============:' + countForAdd);

                                        //send weibo
                                        senWeiboL(allForWeibo);
                                        connection.end();
                                    }
                                }


                            });
                        //add(v, k);
                    });
                }
            });
        };
        fetchAndAdd();
    };

    var add = function (data) {
        var coupon = data.coupon_info;
        //if (/满(\d{1,})元减(\d{1,})元/.test(data.coupon_info)) {
        //    coupon = data.coupon_info.split('元')[1].substr(1);
        //} else if (/(\d{1,})元无条件券/.test(data.coupon_info)) {
        //    coupon = data.coupon_info.split('元')[0];
        //}
        sqlKV.id = sqlKV.id + 1;
        sqlKV.hao_leix = data.user_type == '1' ? '天猫' : '淘宝';
        sqlKV.item_id = data.num_iid;
        sqlKV.hao_zhutu = data.pict_url;
        sqlKV.hao_xiaol = data.volume;
        sqlKV.post_content = data.item_description && data.item_description != '' ? data.item_description : data.coupon_info;
        sqlKV.post_title = data.title;
        sqlKV.hao_yuanj = data.zk_final_price;
        sqlKV.hao_xianj = Math.round((data.zk_final_price - coupon) * 100) / 100;
        sqlKV.hao_youh = parseInt(coupon);
        sqlKV.hao_ljgm = data.coupon_click_url;
        sqlKV.hao_zongl = data.coupon_total_count;
        sqlKV.post_category = cate(data.category);
        //logger.info(sqlKV);

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
        });
    }
}

function random(count) {
    return Math.ceil(Math.random() * count);
}

function senWeiboL(items) {
    //send weibo
    var pickedOne = {
        volume: 0
    };
    _.each(items, function (v, k) {
        if (v.volume > pickedOne.volume && v.item_description.length >= 10) {
            pickedOne = v;
        }
    });
    if (pickedOne.pict_url) {
        var message = {
            text: '【' + (pickedOne.user_type == "1" ? "天猫" : "淘宝") + '】' + pickedOne.title + '\n【在售价】' + pickedOne.zk_final_price + '元\n【券后价】' + comm.toDecimal2((Math.round((pickedOne.zk_final_price - pickedOne.coupon_info) * 100) / 100)) + '元\n【下单链接】http://www.996shop.com/bd/' + pickedOne.sqlId + '\n【领券直达】' + pickedOne.coupon_click_url,
            imageUrl: pickedOne.pict_url,
            uri: 'http://www.996shop.com/bd/' + pickedOne.sqlId,
            type: 1,
            reason: pickedOne.item_description
        };
        sendWeibo(message);
    }

}

//start();
module.exports = start;