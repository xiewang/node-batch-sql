module.exports = {
    timeFormat: function (time, parrent) {
        const data = new Date(time);
        let cal = (fmt)=> {
            let o = {
                "M+": data.getMonth() + 1, //月份
                "d+": data.getDate(), //日
                "h+": data.getHours(), //小时
                "m+": data.getMinutes(), //分
                "s+": data.getSeconds(), //秒
                "q+": Math.floor((data.getMonth() + 3) / 3), //季度
                "S": data.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        };
        return cal(parrent);
    },
    toDecimal2: function(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    }
}