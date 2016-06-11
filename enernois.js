/*eslint-env node*/
//init let-const
'use strict';
const capteur1 = 786; //'Owl.Ener.Cumul.Day';
const path1 = 'ener.csv';
const path2 = 'ener24.csv';
//const path1 = 'C:\\Users\\jeanmarc\\Documents\\ener.csv';
//const path2 = 'C:\\Users\\jeanmarc\\Documents\\ener24.essai.csv';
const strURL1 = 'http://localhost:81/JSON?request=getstatus&ref=' + capteur1;

// Set the headers
const headers = {
  'User-Agent': 'Super Agent/0.0.1',
  'Content-Type': 'application/x-www-form-urlencoded'
};
const options = {
  url: strURL1,
  method: 'GET',
  headers: headers
};
const requestP = require('request-promise');
const myF = require('./noisetfunc.js');
const schedule = require('node-schedule');

// launch action
const jobFiveMin = schedule.scheduleJob('10 4,9,14,19,24,29,34,39,44,49,54,59 * * * *', function(){
  const dateFormat = require('dateformat');
  requestP(options)
  .then(function (response) {
    const ener = JSON.parse(response).Devices[0].value;
    myF.eraseLastLine(path1);
    myF.writeValHour(path2, +dateFormat(Date.now(), 'HH'), ener - myF.getCumul(path2, +dateFormat(Date.now(), 'HH')));
    myF.writeValDay(path1, ener);
  })
  .catch(function (err) {
    myF.processError('jobFiveMin request ', err, 31);
  });
});

const jobOnceADay = schedule.scheduleJob('10 1 0 * * *', function(){
  requestP(options)
  .then(function (response) {
    const firstLine= 'heure,kWh\r\n';
    const ener = JSON.parse(response).Devices[0].value;
    myF.writeNewFile(path2, firstLine);
    myF.writeValDay(path1, ener);
  })
  .catch(function (err) {
    myF.processError('jobOnceADay request', err, 56);
  });
});