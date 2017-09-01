/**
 * Created by lyan2 on 16/9/7.
 */
let keyMirror = function keyMirror(obj) {
    var ret = {};
    var key;
    if (!(obj instanceof Object && !Array.isArray(obj))) return;

    for (key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        ret[key] = key;
    }
    return ret;
};

export default keyMirror;