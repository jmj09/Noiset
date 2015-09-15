/*jslint node: true */
'use strict';

//init let
let dateFormat = require('dateformat');
let capteur1 = 175; //'Owl.Ener.Cumul.Day';
const sep = ',';
let texte = '';

const path1 = 'ener.csv';
const path2 = 'ener24.csv';
//const path1 = 'C:\\Users\\jeanmarc\\Documents\\ener.csv';
//const path2 = 'C:\\Users\\jeanmarc\\Documents\\ener24.essai.csv';
const strURL1 = 'http://noiset.homeserver.com:81/JSON?request=getstatus&ref=' + capteur1;
// Set the headers
const headers = {
  'User-Agent': 'Super Agent/0.0.1',
  'Content-Type': 'application/x-www-form-urlencoded'
};

function eraseLastline(file) {
  let fs = require('fs');
  let data = fs.readFileSync(file, 'utf8');
  let array = data.toString().split('\r\n');
  array = array.slice(0, array.length - 2);
  let fdesc = fs.openSync(file, 'w');
  array.forEach(function (v) {
  fs.writeSync(fdesc, (v) + '\r\n');
  });
  fs.closeSync(fdesc);
  fs = undefined;
}

function writeEnerday(energy) {
  let fs = require('fs');
  let madate = dateFormat(Date.now(), 'yyyy/mm/dd') + ' 00:00:00';
  texte = madate + sep + energy + '\r\n';
  fs.appendFileSync(path1, texte);
  fs = undefined;
}

function writeEnerhour(energy) {
  let fs = require('fs');
  let myhr = dateFormat(Date.now(), 'HH');
  let lines = fs.readFileSync(path2, 'utf8');
  let lineArray = lines.toString().split('\r\n');
  let myModif = parseInt(myhr);
  lineArray[myModif + 1] = myModif + sep + energy;
  let fdesc = fs.openSync(path2, 'w');
  lineArray.forEach(function (v) {
  fs.writeSync(fdesc, (v) + '\r\n');
  });
  fs.closeSync(fdesc);
  fs = undefined;
}

function getCumul() {
  let fs = require('fs');
  let madate = Date.now();
  let myhr = dateFormat(Date.now(), 'HH');
  let myModif = parseInt(myhr);
  let lines = fs.readFileSync(path2, 'utf8');
  let lineArr = lines.split('\r\n');
  let total = 0;
  let i;
  for (i = 1; i < myModif + 1; i++) {
    let interm = lineArr[i].split(',');
    let sstot = interm[1];
    total += parseInt(sstot, 10);
  }
  //console.log(total);
  fs = undefined;
  return total;
}

function writeEner(energy) {
  let madate = Date.now();
  let mntes = parseInt((dateFormat(madate, 'MM')), 10);
  let hres = parseInt((dateFormat(madate, 'HH')), 10);
  if ((hres === 0) && (mntes < 5)) {
    writeNewFile();
    writeEnerhour(energy - getCumul());
    writeEnerday(energy);
  } else {
    eraseLastline(path1);
    writeEnerhour(energy - getCumul());
    writeEnerday(energy);
  }
}

//exports.get = 
function getEner() {
  let request = require('request');
  // Configure the request
  let options = {
    url: strURL1,
    method: 'GET',
    headers: headers
  };
  // Start the request
  //console.log('avant');
  request(options, function (error, response, body) {
  //console.log(body);
  if (error) { throw error; }
  if (!error && response.statusCode === 200) {
    let ener = JSON.parse(body).Devices[0].value;
    writeEner(ener);
  }
  });
  // Releases memory
  request = undefined;
}

function writeNewFile() {
  let fs = require('fs');
  let lines = [];
  let fdesc = fs.openSync(path2, 'w');
  for (let i = 0; i < 25; i++) {
    if (i == 0) {
      lines[0] = 'heure,kWh';
    } else {
      lines[i] = i + sep + '0';
    }
    fs.writeSync(fdesc, lines[i] + '\r\n');
  }
  fs.closeSync(fdesc);
  fs = undefined;
}

// launch action

getEner();

setInterval(function () {
  getEner();
}, 300000);
/*300000ms = 5' */