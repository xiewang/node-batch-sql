var xlsx = require('node-xlsx');
var fs = require('fs');
var csv = require('csv');
var _ = require('lodash');

module.exports = function () {
    var workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/../../public/csv/source.xls`));
    var data = workSheetsFromBuffer[0].data;

    var res = [];
    var row1 = ['post_id', 'post_name', 'post_author', 'post_date', 'post_type', 'post_status', 'item_id', 'post_title', 'post_content', 'post_category', 'post_tags', 'hao_yuanj', 'hao_youh', 'hao_xianj', 'hao_xiaol', 'hao_zongl', 'hao_zhutu', 'hao_ljgm', 'hao_leix', 'kouling'];
    res.push(row1);
    _.each(data, function (v, k) {
        //if(k>9000)
        //    return;
        if (k == 0)
            return;
        var row = [];
        row.push('');
        row.push('');
        row.push('');
        row.push('');
        row.push('post');
        row.push('publish');
        row.push(v[0]);
        row.push(v[1].toString().replace(',', '，'));
        row.push(v[17]);

        var cate = '居家';
        switch (v[4]) {
            case '女装/女士精品':
                cate = '女装';
                break;
            case '居家日用':
                cate = '居家';
                break;
            case '零食/坚果/特产':
                cate = '美食';
                break;
            case '洗护清洁剂/卫生巾/纸/香薰':
                cate = '化妆品';
                break;
            case '尿片/洗护/喂哺/推车床':
                cate = '母婴';
                break;
            case '女士内衣/男士内衣/家居服':
                cate = '女装';
                break;
            case 'ZIPPO/瑞士军刀/眼镜':
                cate = '箱包配饰';
                break;
            case '童装/婴儿装/亲子装':
                cate = '母婴';
                break;
            case '美容护肤/美体/精油':
                cate = '化妆品';
                break;
            case '床上用品':
                cate = '居家';
                break;
            case '玩具/童车/益智/积木/模型':
                cate = '母婴';
                break;
            case '童鞋/婴儿鞋/亲子鞋':
                cate = '母婴';
                break;
            case '男装':
                cate = '男装';
                break;
            case '个人护理/保健/按摩器材':
                cate = '居家';
                break;
            case '服饰配件/皮带/帽子/围巾':
                cate = '箱包配饰';
                break;
            case '粮油米面/南北干货/调味品':
                cate = '美食';
                break;
            case '女鞋':
                cate = '女装';
                break;
            case '厨房/烹饪用具':
                cate = '居家';
                break;
            case '家居饰品':
                cate = '居家';
                break;
            case '手表':
                cate = '箱包配饰';
                break;
            case '保健食品/膳食营养补充食品':
                cate = '美食';
                break;
            case '厨房电器':
                cate = '数码家电';
                break;
            case '闪存卡/U盘/存储/移动硬盘':
                cate = '数码家电';
                break;
            case '家庭/个人清洁工具':
                cate = '居家';
                break;
            case '彩妆/香水/美妆工具':
                cate = '化妆品';
                break;
            case '运动/瑜伽/健身/球迷用品':
                cate = '户外运动';
                break;
            case '影音电器':
                cate = '数码家电';
                break;
            case '电子/电工':
                cate = '数码家电';
                break;
            case '水产肉类/新鲜蔬果/熟食':
                cate = '美食';
                break;
            case '居家布艺':
                cate = '居家';
                break;
            case '餐饮具':
                cate = '居家';
                break;
            case '咖啡/麦片/冲饮':
                cate = '美食';
                break;
            case '宠物/宠物食品及用品':
                cate = '居家';
                break;
            case '电脑硬件/显示器/电脑周边':
                cate = '数码家电';
                break;
            case '3C数码配件':
                cate = '数码家电';
                break;
            case '办公设备/耗材/相关服务':
                cate = '居家';
                break;
            case '成人用品/情趣用品':
                cate = '女装';
                break;
            case '箱包皮具/热销女包/男包':
                cate = '箱包配饰';
                break;
            case '酒类':
                cate = '美食';
                break;
            case '饰品/流行首饰/时尚饰品新':
                cate = '箱包配饰';
                break;
            case '书籍/杂志/报纸':
                cate = '居家';
                break;
            case '收纳整理':
                cate = '居家';
                break;
            case '孕妇装/孕产妇用品/营养':
                cate = '母婴';
                break;
            case '生活电器':
                cate = '数码家电';
                break;
            case '鲜花速递/花卉仿真/绿植园艺':
                cate = '居家';
                break;
            case '茶':
                cate = '美食';
                break;
            case '节庆用品/礼品':
                cate = '居家';
                break;
            case '基础建材':
                cate = '居家';
                break;
            case '汽车/用品/配件/改装':
                cate = '汽车用品';
                break;
            case 'OTC药品/医疗器械/计生用品':
                cate = '居家';
                break;
            case '电子词典/电纸书/文化用品':
                cate = '数码家电';
                break;
            case '户外/登山/野营/旅行用品':
                cate = '户外运动';
                break;
            case '传统滋补营养品':
                cate = '美食';
                break;
            case '家装主材':
                cate = '居家';
                break;
            case '美发护发/假发':
                cate = '化妆品';
                break;
            case '住宅家具':
                cate = '居家';
                break;
            case '流行男鞋':
                cate = '男装';
                break;
            case '奶粉/辅食/营养品/零食':
                cate = '母婴';
                break;
            case '珠宝/钻石/翡翠/黄金':
                cate = '箱包配饰';
                break;
            case '运动鞋new':
                cate = '户外运动';
                break;
            case '个性定制/设计服务/DIY':
                cate = '居家';
                break;
            case '模玩/动漫/周边/cos/桌游':
                cate = '居家';
                break;
            case '运动服/休闲服装':
                cate = '户外运动';
                break;
            case '五金/工具':
                cate = '居家';
                break;
            case '运动包/户外包/配件':
                cate = '户外运动';
                break;
            case '音乐/影视/明星/音像':
                cate = '居家';
                break;
            case '乐器/吉他/钢琴/配件':
                cate = '居家';
                break;
            case '自行车/骑行装备/零配件':
                cate = '户外运动';
                break;
            case '电玩/配件/游戏/攻略':
                cate = '数码家电';
                break;
            case '手机':
                cate = '数码家电';
                break;
            case '隐形眼镜/护理液':
                cate = '化妆品';
                break;
            case '网络设备/网络相关':
                cate = '数码家电';
                break;
            case '智能设备':
                cate = '数码家电';
                break;
            case '大家电':
                cate = '数码家电';
                break;
            case '电动车/配件/交通工具':
                cate = '居家';
                break;
            case '特色手工艺':
                cate = '居家';
                break;
            case 'DIY电脑':
                cate = '数码家电';
                break;
            case '数码家电':
                cate = '数码家电';
                break;
            case '度假线路/签证送关/旅游服务':
                cate = '居家';
                break;
            case 'MP3/MP4/iPod/录音笔':
                cate = '数码家电';
                break;
            case '电影/演出/体育赛事':
                cate = '居家';
                break;
            case '商业/办公家具':
                cate = '居家';
                break;
            default:
                cate = '居家';
                break;
        }
        row.push(cate);
        row.push('auto');
        row.push(v[6]);

        try {
            var content = v[17];
            if (/满(\d{1,})元减(\d{1,})元/.test(content)) {
                var coupon = content.split('元')[1].substr(1);
                row.push(coupon);
                row.push(Math.round((v[6] - coupon) * 100) / 100);
            } else if (/(\d{1,})元无条件券/.test(content)) {
                var coupon = content.split('元')[0];
                row.push(coupon);
                row.push(Math.round((v[6] - coupon) * 100) / 100);
            } else {
                row.push('');
                row.push('');
                console.log(content);
            }
        } catch (e) {
            console.log(e)
        }


        row.push(v[7]);
        row.push(v[15]);
        row.push(v[2]);
        row.push(v[21]);

        row.push(v[13]);
        row.push('');
        if ((v[6] - coupon) >= 0) {
            res.push(row);
        }

    });

    var chunkMount = 200;
    var chunks = _.chunk(res, chunkMount);
    _.each(chunks, function (v, k) {
        if (k != 0) {
            chunks[k].unshift(chunks[0][0])
        }
        csv.transform(chunks[k], function (data) {
            data.push(data);
            return data.join(',') + '\n';
        }).pipe(fs.createWriteStream(__dirname + '/../../public/csv/result' + k + '.csv'), {encoding: 'utf8'});
    });
};