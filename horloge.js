'use strict';
const schedule = require('node-schedule');

function writeNewFile(file, content) {
  'use strict';
  const fs = require('fs');
  const fdesc = fs.openSync(file, 'w');
  fs.writeSync(fdesc, content);
  fs.closeSync(fdesc);
  return true;
}

const jobFiveMin = schedule.scheduleJob('10 0,15,30,45,47,50,52,55,57,59 * * * *', function(){
  const dateFormat = require('dateformat');
  const content = "il est " + dateFormat(Date.now(), 'HH') + " heures " + dateFormat(Date.now(), 'MM') + " minutes ";
  const file = ("speak.txt");
  //console.log(content);
  writeNewFile(file, content);
});