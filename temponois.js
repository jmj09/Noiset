/*jslint node: true */
'use strict';

//init let and const
let dateFormat = require('dateformat');
let request = require('request');
let val = [];
let spin = 0;

function writefile() {
  //const path1 = 'temp2.csv';
  //const path2 = 'temp50002.csv';
  const path1 = 'C:\\Users\\jeanmarc\\Documents\\temp.csv';
  const path2 = 'C:\\Users\\jeanmarc\\Documents\\temp5000.csv';
  const myFirstLine = 'D,Tempext,Tempint,Tempch,TempSdB,Lumint,Patm';
  const sep = ',';
  let texte = '';
  let fs = require('fs');
  let madate = dateFormat(Date.now(), 'yyyy/mm/dd HH:MM:ss')
  texte = madate + sep + val[0] + sep + val[1] + sep + val[2] + sep + val[3] + sep + val[4] + sep + val[5] + '\r\n';
  fs.appendFile(path1, texte, function (err) {
    if (err) {
      return console.log(err);
    }
    fs.readFile(path1, 'utf8', function (err, data) {
      if (err) { throw err; }
      let myArray = data.toString().split('\r\n');
      //console.log(myArray);
      if (myArray.length > 3000) {
        myArray = myArray.slice(myArray.length - 3000, myArray.length - 1);
      }
      myArray[0] = myFirstLine;
      let fdesc = fs.openSync(path2, 'w');
      myArray.forEach(function (v) {
        fs.writeSync(fdesc, (v) + '\r\n');
      });
      myArray = undefined;
      fs = undefined;
      process.exit(0);
    });

  });
  //console.log('write file ok ' + texte);
}

function adapt() {
  if (val[4] < 1) { val[4] = 0; }
  if (val[4] > 1) { val[4] = Math.round(8 * Math.log(val[4])); }
  let d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();
  if (((h % 4) > 0) || (m > 4)) {
    val[5] = 'nan';
  }
}

exports.get = function getnext() {
  const strURL = 'http://noiset.homeserver.com/JSON?request=getstatus&ref=';
  let capteurs = [460, 291, 38, 515, 605, 288];
  //'Balcon Rfx.Os1.Temp';'Sejour Rfx.Os5.Temp';'Chambre Rfx.Os2.Temp';
  //'SdB Aeon.Radar.Temp';'Sejour Aeon.Radar.Luminance';'Sejour Rfx.Os5.Barometer';
  const headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  let options = {
    url: strURL + capteurs[spin],
    method: 'GET',
    headers: headers
  };

  request(options, function (error, response, body) {
    val[spin] = JSON.parse(body).Devices[0].value;
    spin += 1;
    (capteurs = capteurs.slice(1)).length && getnext();
    if (spin == 6) {
      adapt();
      writefile();
    }
  });
}
