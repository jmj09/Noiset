/*eslint-env node*/
const schedule = require('node-schedule');
const myF = require('./noisetfunc.js');
const capteur1 = 42; //'pluvio';
const path1 = 'pluie.csv';
const path2 = 'pluie24.csv';
//const path1 = 'C:\\Users\\jeanmarc\\Documents\\pluie.csv';
//const path2 = 'C:\\Users\\jeanmarc\\Documents\\pluie24.essai.csv';
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

const jobFiveMin = schedule.scheduleJob('10 4,9,14,19,24,29,34,39,44,49,54,59 * * * *', function(){
  const requestP = require('request-promise');
  const dateFormat = require('dateformat');
  // Start the request
  requestP(options) 
    .then(function (response) {
      const pluie = JSON.parse(response).Devices[0].value;
      myF.eraseLastLine(path1);
      myF.writeValHour(path2, +dateFormat(Date.now(), 'HH'), pluie - myF.getCumul(path2, +dateFormat(Date.now(), 'HH')));
      myF.writeValDay(path1, pluie);
    })
    .catch(function (err) {
      myF.processError('rainnois request ', err, 25);
    });
});

const jobOnceADay = schedule.scheduleJob('10 1 0 * * *', function(){
  const requestP = require('request-promise');
  // Start the request
  requestP(options) 
    .then(function (response) {
      const firstLine = 'heure,mm\r\n';  
      const pluie = JSON.parse(response).Devices[0].value;
      myF.writeNewFile(path2, firstLine);
      myF.writeValDay(path1, pluie);
    })
    .catch(function (err) {
      myF.processError('rainnois request ', err, 40);
    });
});