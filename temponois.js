/*eslint-env node*/
/*eslint-env es6*/
/*jslint es6:true*/
/*jshint -W030 */

const myF = require('./noisetfunc.js');

function getVal(sensor) {
  "use strict";
  const strURL = "http://localhost:81/JSON?request=getstatus&ref=";
    const headers = {
      "User-Agent": "Super Agent/0.0.1",
      "Content-Type": "application/json"
    };
    const options = {
      url: strURL + sensor,
      method: "GET",
      headers: headers
    };
    const requestP = require('request-promise');
  return new Promise((resolve, reject) => {
  requestP(options)
    .then(function (response) {
      let val = JSON.parse(response).Devices[0].value;
      resolve(val);
    })
    .catch(function (err) {
        myF.processError('tempo promise ', err, 110);
        reject(err);
    });
  });
}

function adapt(myAdaptVal) {
  "use strict";
  if (myAdaptVal[4] < 1) { myAdaptVal[4] = 0; }
  if (myAdaptVal[4] > 1) { myAdaptVal[4] = Math.round(8 * Math.log(myAdaptVal[4])); }
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  if (((h % 4) > 0) || (m > 4)) {
    myAdaptVal[5] = "nan";
  }
  return myAdaptVal;
}

function writeFile(myVal) {
  "use strict";
  const dateFormat = require("dateformat");
  const fs = require("fs");
  const path1 = "./temp.csv";
  const path2 = "./temp5000.csv";
  //const path1 = "C:\\Users\\jeanmarc\\Documents\\temp.csv";
  //const path2 = "C:\\Users\\jeanmarc\\Documents\\temp5000.csv";
  const myFirstLine = "D,Tempext,Tempint,Tempch,TempSdB,Lumint,Patm";
  const sep = ",";
  const madate = dateFormat(Date.now(), "yyyy/mm/dd HH:MM:ss");
  //console.log(myVal);
  const texte = `${madate}${sep}${myVal[0]}${sep}${myVal[1]}${sep}${myVal[2]}${sep}${myVal[3]}${sep}${myVal[4]}${sep}${myVal[5]}\r\n`;
  //console.log(texte);
  fs.appendFile(path1, texte, function(err) {
    if (err) {
      myF.processError("appendFile", err, 19);
    }
    fs.readFile(path1, "utf8", function(err, data) {
      //console.log("a");
      if (err) { myF.processError("readFile ", err, 23); }
      let myArray = data.toString().split("\r\n");
      if (myArray.length > 3000) {
        myArray = myArray.slice(myArray.length - 3000, myArray.length - 1);
      }
      myArray[0] = myFirstLine;
      fs.open(path2, "w",  function (err, fdesc) {
        if (err) { myF.processError("fs.open ", err, 31); }
        //console.log("b");
        myArray.forEach((v) => {
          if (v !== "") {
            fs.writeSync(fdesc, v + "\r\n", "utf8");
          }
        });
        fs.close(fdesc);
        myArray.length = 0;
      });
    });
  });
}

(function getAll(){
  "use strict";
  let valor = [];
  getVal(460).then(function (results) {
    valor[0] = results;
    getVal(291).then(function (results) {
      valor[1] = results;
      getVal(38).then(function (results) {
        valor[2] = results;
        getVal(515).then(function (results) {
          valor[3] = results;
          getVal(236).then(function (results) {
            valor[4] = results;
            getVal(288).then(function (results) {
              valor[5] = results;
              valor = adapt(valor);
              writeFile(valor);
            });
          });
        });
      });  
    });
  });

  setTimeout(getAll, 300000);
})(); 
