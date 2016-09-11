exports.writeValHour = function (file, line, val) {
  'use strict';
  const sep = ',';
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        let lineArray = data.toString().split('\r\n');
        lineArray[line] = line + sep + val;
        lineArray.length = 24;
        let myLongText = '';
        lineArray.forEach( (v) => {
          myLongText = myLongText + v + '\r\n';
        });
        fs.writeFile(file, myLongText, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(true);
          }
        });
      }
    });
  });
};

exports.getCumul = (file, hour) => {
  'use strict';
  const fs = require('fs');
  const lanes = fs.readFileSync(file, 'utf8');
  const lineArr = lanes.split('\r\n');
  let total = 0;
  let i;
  for (i = 1; i < hour + 1; i+=1) {
    let interm = lineArr[i].split(',');
    let sstot = interm[1];
    total += parseFloat(sstot, 10);
  }
  return total.toFixed(2);
};

exports.processError = (funcName, err, ligne) => {
  'use strict';
  const stepd = "/";
  const steph = ":";
  const space = " ";
  const dateNow = new Date();
  const num = `${dateNow.getFullYear()}${stepd}${n(dateNow.getMonth()+1)}`
   + `${stepd}${n(dateNow.getDate())}${space}${n(dateNow.getHours())}`
   + `${steph}${n(dateNow.getMinutes())}${steph}${n(dateNow.getSeconds())}`;
  console.log(`${funcName} - ligne ${ligne} : ${num} at ${err}`);
};

exports.dateNF = () => {
  'use strict';
  const stepd = "/";
  const steph = ":";
  const space = " ";
  const dateNow = new Date();
  const dft = `${dateNow.getFullYear()}${stepd}${n(dateNow.getMonth()+1)}`
   + `${stepd}${n(dateNow.getDate())}${space}${n(dateNow.getHours())}`
   + `${steph}${n(dateNow.getMinutes())}${steph}${n(dateNow.getSeconds())}`;
  return dft;
};

function n(num){
  'use strict';
  return num > 9 ? "" + num: "0" + num;
}

exports.dateHH = () => {
  'use strict';
  const dateNow= new Date();
  const dft=`${n(dateNow.getHours())}`;
  return dft;
};

exports.dateZZ = () => {
  'use strict';
  const stepd = "/";
  const dateNow= new Date();
  const dft=`${dateNow.getFullYear()}${stepd}`
   + `${n(dateNow.getMonth()+1)}${stepd}${n(dateNow.getDate())}`;
  return dft;
};

exports.getContent = (addr) => {
  'use strict';
  return new Promise((resolve, reject) => {
    const lib = require('http');
    const request = lib.get(addr.url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        resolve(body.join(''));
        body.length = 0;
      });
    });
  });
};

exports.test = () => {
  const myF = require('./noisetfunc.js');
  console.log("enter");
  const path1 = 'ener.csv';
  const ener = 100;
  const sep = ",";
  const dateNow = myF.dateZZ();
  const madate = `${dateNow} 00:00:00`;
  console.log(dateNow);
  const texte = madate + sep + ener + '\r\n';
  console.log(texte);
  myF.appendToFileProm(path1, texte);
};

exports.appendToFileProm = (file, texte) => {
  'use strict';
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    fs.appendFile(file, texte, (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(true);
      }
    });
  });
};

exports.eraseLastLineProm = function(file) {
  'use strict';
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        let array = data.toString().split('\r\n');
        array = array.slice(0, array.length - 2);
        let myLongText = '';
        array.forEach( (v) => {
          myLongText = myLongText + v + '\r\n';
        });
        fs.writeFile(file, myLongText, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(true);
          }
        });
      }
    });
  });
}

exports.writeNewFileProm = function(file, header) {
  'use strict';
  const sep = ',';
  const fs = require('fs');
  let lanes = [];
  const fdesc = fs.openSync(file, 'w');
  let i;
  return new Promise((resolve, reject) => {
    let myLongText = header;
    for (i = 1; i < 24; i++) {
      myLongText = myLongText + i + sep + '0' + '\r\n';
    }
    fs.writeFile(file, myLongText, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(true);
      }
    });
  });
};

exports.sliceFileProm = function(fileLong, fileShort, numLines, firstLine) {
  'use strict';
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    fs.readFile(fileLong, "utf8", (err, data) => {
      //console.log("a");
      if (err) { reject(err); }
      else {
        let myArray = data.toString().split("\r\n");
        if (myArray.length > numLines) {
          myArray = myArray.slice(myArray.length - numLines-1, myArray.length-1);
        }
        myArray[0] = firstLine;
        fs.open(fileShort, "w",  (err, fdesc) => {
          if (err) { reject(err); }
          //console.log("b");
          myArray.forEach((v) => {
            if (v !== "") {
              fs.writeSync(fdesc, v + "\r\n", "utf8");
            }
          });
          fs.close(fdesc);
          myArray.length = 0;
          resolve(true);
        });
      }
    });
  });
};