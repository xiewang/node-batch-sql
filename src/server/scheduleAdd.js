var schedule = require("node-schedule");
var mission = require("./autoadd.js");

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
var minute = [0, 20, 40];
var hour = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

rule.minute = minute;

rule.hour = hour;

var j = schedule.scheduleJob(rule, function () {
    mission();
});