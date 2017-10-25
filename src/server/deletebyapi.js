var mysql = require('mysql');
var _ = require('lodash');
var Promise = require('bluebird');
var rp = require('request-promise');
var log4js = require('log4js');
var config = require('../constants.js');
var ApiClient = require('./taobaosdk/index.js').ApiClient;

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
    connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        insecureAuth: true
    });
    // connection.connect();
    connection.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(start, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            start();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });

    //var sql = "SELECT wp.id,pm.meta_value FROM wp_postmeta pm LEFT JOIN wp_posts wp ON wp.ID = pm.post_id WHERE post_title = '夏季韩版长袖防晒衣女开衫中长款大码宽松沙滩雪纺披肩超薄款外套' and meta_key = 'hao_ljgm'";
    //var sql = "SELECT t1.id,t5.meta_value FROM wp_posts t1, wp_postmeta t5 WHERE t1.id = t5.post_id AND t1.post_status = 'publish' AND t1.post_type = 'post'  AND t5.meta_key='hao_ljgm' AND t1.id !=32322 ";
    var sql = "SELECT DISTINCT t1.id,t5.meta_value FROM wp_posts t1, wp_term_relationships t2, wp_postmeta t5 WHERE t1.id=t2.object_id AND t1.id = t5.post_id AND t1.post_status = 'publish' AND t1.post_type = 'post'  AND t5.meta_key='hao_ljgm' AND t1.id !=32322 AND t2.term_taxonomy_id!=49 AND t2.term_taxonomy_id!=62 ";
    connection.query(sql, function (error, results, fields) {
        if (error) {
            logger.error(error);
        }
        logger.info('The solution is: ', results.length);
        if (results.length === 0) {
            connection.end();
        } else {
            //connection.end();
            deleteData(results);
        }
    });
}


function deleteDataDirect(results) {
    var del_post = 'DELETE FROM wp_posts WHERE ID = ';
    var del_meta = 'DELETE FROM wp_postmeta WHERE post_id = ';
    _.each(results, function (v, k) {
        connection.query(del_post + v['id'], function (error, results, fields) {
            if (error) {
                logger.error(error);
            }
            logger.info('deleted ' + results.affectedRows + ' rows');
        });
        connection.query(del_meta + v['id'], function (error, results, fields) {
            if (error) throw error;
            logger.info('deleted ' + results.affectedRows + ' rows');
        });
    });
    connection.end();
}

function deleteData(results) {
    var del_post = 'DELETE FROM wp_posts WHERE ID = ';
    var del_meta = 'DELETE FROM wp_postmeta WHERE post_id = ';
    var del_term_relationships = 'DELETE FROM wp_term_relationships WHERE object_id = ';
    //var update_term_taxonomy = 'UPDATE wp_term_taxonomy SET count=count-1 where term_taxonomy_id = ';

    var cates = {};
    _.each(results, function (v, k) {
        var del = function (v, k) {
            var couponLink = v['meta_value'];
            var temp = couponLink.split('?');
            temp = couponLink.replace(temp[0] + '?', '');
            var params = temp.split('&');
            var me = '';
            _.each(params, function (v, k) {
                var vv = v.split('=');
                if (vv[0] == 'e') {
                    me = vv[1];
                }
            });
            var client = new ApiClient({
                'appkey': '24545248',
                'appsecret': '9e69eb2ab9fa086d31ddf043493a6a49',
                'REST_URL': 'http://gw.api.taobao.com/router/rest'
            });

            var sqldelete = function () {
                connection.query(del_post + v['id'], function (error, results, fields) {
                    if (error) {
                        logger.error(error);
                    }
                    logger.info(k + 'deleted post ' + v['id'] + ':' + results.affectedRows + ' rows');
                });
                connection.query(del_meta + v['id'], function (error, results, fields) {
                    if (error) {
                        logger.error(error);
                    }
                    logger.info(k + 'deleted meta ' + v['id'] + ':' + results.affectedRows + ' rows');
                });

                connection.query('SELECT * FROM wp_term_relationships WHERE object_id = ' + v['id'], function (error, results, fields) {
                    if (error) {
                        logger.error(error);
                    }
                    logger.info('The wp_term_relationships is: ', results);
                    if (results.length !== 0) {
                        _.each(results, function (v, k) {
                            cates[v['term_taxonomy_id']] = cates[v['term_taxonomy_id']] ? ++cates[v['term_taxonomy_id']] : 1;

                        });
                    }
                });

                connection.query(del_term_relationships + v['id'], function (error, results, fields) {
                    if (error) {
                        logger.error(error);
                    }
                    logger.info(k + 'deleted del_term_relationships' + results.affectedRows + ' rows');
                });
            }
            client.execute('taobao.tbk.coupon.get', {
                'me': me
            }, function (error, response) {
                try {
                    if (!error) {
                        if (!(response.data.coupon_total_count && response.data.coupon_total_count > 0)) {

                            sqldelete();
                        } else {
                            console.log('a' + JSON.stringify(response))
                        }
                    } else {
                        sqldelete();
                        logger.error('error' + JSON.stringify(error));
                    }
                } catch (e) {
                    sqldeleteRelated();
                }

            });

        };
        setTimeout(function () {
            del(v, k);
        }, k * 100);


    });

    var sqldeleteRelated = function () {
        logger.info('cates: ' + JSON.stringify(cates));
        _.each(cates, function (v, k) {
            var term_taxonomy_id = k;
            connection.query('UPDATE wp_term_taxonomy SET count=count-' + v + ' where term_taxonomy_id = ' + term_taxonomy_id, function (error, results, fields) {
                if (error) {
                    logger.error(error);
                }
                logger.info('term_taxonomy_id ' + term_taxonomy_id + ': update wp_term_taxonomy' + results.affectedRows + ' rows');
            });
        });

        connection.end();
    };
    setTimeout(function () {
        sqldeleteRelated();
    }, results.length * 100);
}


module.exports = start;
//connection.end();