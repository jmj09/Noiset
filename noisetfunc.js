/*eslint-env node*/

exports.writeNewFile = function(file, header) {
  'use strict';
  const sep = ',';
  const fs = require('fs');
  let lanes = [];
  const fdesc = fs.openSync(file, 'w');
  let i;
  fs.writeSync(fdesc, header);
  for (i = 1; i < 24; i++) {
    lanes[i] = i + sep + '0';
    fs.writeSync(fdesc, lanes[i] + '\r\n');
  }
  fs.closeSync(fdesc);
  lanes.length = 0;
  return true;
};

exports.eraseLastLine = function (file) {
  'use strict';
  const fs = require('fs');
  const data = fs.readFileSync(file, 'utf8');
  let array = data.toString().split('\r\n');
  array = array.slice(0, array.length - 2);
  const fdesc = fs.openSync(file, 'w');
  array.forEach(function (v) {
    fs.writeSync(fdesc, (v) + '\r\n');
  });
  fs.closeSync(fdesc);
  return true;
};

exports.writeValDay = function (file, energy) {
  'use strict';
  const sep = ',';
  const dateFormat = require('dateformat');
  const madate = dateFormat(Date.now(), 'yyyy/mm/dd') + ' 00:00:00';
  const texte = madate + sep + energy + '\r\n';
  const fs = require('fs');
  fs.appendFileSync(file, texte);
  return true;
};

exports.writeValHour = function (file, line, energy) {
  'use strict';
  const sep = ',';
  const dateFormat = require('dateformat');
  const fs = require('fs');
  const lanes = fs.readFileSync(file, 'utf8');
  let lineArray = lanes.toString().split('\r\n');
  lineArray[line + 1] = line + sep + energy;
  lineArray.length = 24;
  const fdesc = fs.openSync(file, 'w');
  lineArray.forEach(function (v) {
    fs.writeSync(fdesc, (v) + '\r\n');
  });
  fs.closeSync(fdesc);
  return true;
};

exports.getCumul = function (file, hour) {
  'use strict';
  const fs = require('fs');
  const lanes = fs.readFileSync(file, 'utf8');
  const lineArr = lanes.split('\r\n');
  let total = 0;
  let i;
  for (i = 1; i < hour + 1; i++) {
    let interm = lineArr[i].split(',');
    let sstot = interm[1];
    total += parseFloat(sstot, 10);
  }
  return total.toFixed(2);
};

exports.sliceFile= function(fileLong, fileShort, numLines, firstLine, callback) {
  const fs = require('fs');
  fs.readFile(fileLong, "utf8", function(err, data) {
    //console.log("a");
    if (err) { _this.processError("readFile", err, 38); }
    else {
      let myArray = data.toString().split("\r\n");
      if (myArray.length > numLines) {
        myArray = myArray.slice(myArray.length - numLines, myArray.length - 1);
      }
      myArray[0] = firstLine;
      fs.open(fileShort, "w",  function (err, fdesc) {
        if (err) { _this.processError("fs.open", err, 44); }
        //console.log("b");
        myArray.forEach((v) => {
          if (v !== "") {
            fs.writeSync(fdesc, v + "\r\n", "utf8");
          }
        });
        fs.close(fdesc);
        //console.log(texte);
        //console.log("c");
        myArray.length = 0;
        callback && callback();
        return true;
      });
    }
  });
};

exports.appendToFile = function(file, texte){
  const fs = require('fs');
  fs.appendFile(file, texte, function(err) {
    if (err) {
      _this.processError("appendFile", err, 32);
    }
  });
};

exports.processError = function(funcName, err, ligne){
  const dateFormat = require("dateformat");
  const d = new Date();
  const n = dateFormat(d, "yyyy/mm/dd HH:MM:ss");
  console.log(`${funcName} - ligne ${ligne} : ${n} at ${err}`);
};