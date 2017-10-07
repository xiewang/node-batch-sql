var schedule = require("node-schedule");
var mission = require("./autoadd.js");

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];

rule.hour = 0;

rule.minute = 0;

//var j = schedule.scheduleJob(rule, function(){
//
//    mission();
//
//});
mission();