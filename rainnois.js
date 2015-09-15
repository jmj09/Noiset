/*jslint node: true */
'use strict';

//init let
let dateFormat = require('dateformat');
const sep = ',';
const path1 = 'pluie.csv';
const path2 = 'pluie24.csv';
//const path1 = 'C:\\Users\\jeanmarc\\Documents\\rain.csv';
//const path2 = 'C:\\Users\\jeanmarc\\Documents\\rain24.csv';

function eraseLastline(file) {
  let fs = require('fs');
  let dotum = fs.readFileSync(file, 'utf8');
  let array = dotum.toString().split('\r\n');
  array = array.slice(0, array.length - 2);
  let fdesc = fs.openSync(file, 'w');
  array.forEach(function (v) {
    fs.writeSync(fdesc, (v) + '\r\n');
  });
  fs.closeSync(fdesc);
  fs = undefined;
}

function writeRainday(raindrop) {
  let texte = '';
  let fs = require('fs');
  let madate = dateFormat(Date.now(), 'yyyy/mm/dd') + ' 00:00:00';
  texte = madate + sep + raindrop + '\r\n';
  fs.appendFileSync(path1, texte);
  fs = undefined;
}

function writeRainhour(raindrop) {
  let fs = require('fs');
  let myhr = dateFormat(Date.now(), 'HH');
  let lines = fs.readFileSync(path2, 'utf8');
  let lineArray = lines.toString().split('\r\n');
  let myModif = parseInt(myhr, 10);
  lineArray[myModif + 1] = myModif + sep + raindrop;
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
  let myModif = parseFloat(myhr);
  let lines = fs.readFileSync(path2, 'utf8');
  let lineArr = lines.split('\r\n');
  let total = 0;
  let i;
  for (i = 1; i < myModif + 1; i++) {
    let interm = lineArr[i].split(',');
    let sstot = interm[1];
    total += parseFloat(sstot, 10);
  }
  //console.log(total);
  fs = undefined;
  total = Math.round(total * 10) / 10
  return total;
}

function writeRain(raindrop) {
  let madate = Date.now();
  let mntes = parseInt((dateFormat(madate, 'MM')), 10);
  let hres = parseInt((dateFormat(madate, 'HH')), 10);
  if ((hres === 0) && (mntes < 5)) {
    writeNewFile();
    writeRainday(0);
  } else {
    eraseLastline(path1);
    let diff = raindrop - getCumul();
    diff = Math.round(diff * 10) / 10;
    writeRainhour(diff);
    writeRainday(raindrop);
  }
}

//exports.get = 
function getRain() {
  const strURL1 = 'http://noiset.homeserver.com:81/JSON?request=getstatus&ref=42';
  let request = require('request');
  // Configure the request
  // Set the headers
  const headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  let options = {
    url: strURL1,
    method: 'GET',
    headers: headers
  };
  // Start the request
  request(options, function (error, response, body) {
    if (error) { throw error; }
    if (!error && response.statusCode === 200) {
      let rainQ = JSON.parse(body).Devices[0].value;
      rainQ = Math.round(rainQ * 10) / 10;
      writeRain(rainQ);
    }
  });
    request = undefined;
}

function writeNewFile() {
  let fs = require('fs');
  let lines = [];
  let fdesc = fs.openSync(path2, 'w');
  for (let i = 0; i < 25; i++) {
    lines[i] = (i - 1) + sep + '0';
  }
  lines[0] = 'heure,mm';

  lines.forEach(function (v) {
    fs.writeSync(fdesc, (v) + '\r\n');
  });
  fs.close(fdesc);
  fs = undefined;  
}

// launch action
getRain();

setInterval(function () {
  getRain();
}, 300000);
/*300000ms = 5' */