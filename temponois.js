﻿/*eslint-env node*/
process.env.NODE_ENV = "production";
//init global let
var spi = 0;
var myNextVal = [];

function writefile(myVal) {
  "use strict";
  let dateFormat = require("dateformat");
  const path1 = "./temp.csv";
  const path2 = "./temp5000.csv";
  //const path1 = "C:\\Users\\jeanmarc\\Documents\\temp.csv";
  //const path2 = "C:\\Users\\jeanmarc\\Documents\\temp5000.csv";
  const myFirstLine = "D,Tempext,Tempint,Tempch,TempSdB,Lumint,Patm";
  const sep = ",";
  let fs = require("fs");
  let madate = dateFormat(Date.now(), "yyyy/mm/dd HH:MM:ss");
  //console.log(myVal);
  let texte = `${madate}${sep}${myVal[0]}${sep}${myVal[1]}${sep}${myVal[2]}${sep}${myVal[3]}${sep}${myVal[4]}${sep}${myVal[5]}\r\n`;
  //console.log(texte);
  fs.appendFile(path1, texte, function (err) {
    if (err) {
      return console.log(err);
    }  
    fs.readFile(path1, "utf8", function (err, data) {
      //console.log("a");
      if (err) { throw err; }
      let myArray = data.toString().split("\r\n");
      if (myArray.length > 3000) {
        myArray = myArray.slice(myArray.length - 3000, myArray.length - 1);
      }
      myArray[0] = myFirstLine;
      fs.open(path2, "w", function (err, fdesc) {
        if (err) { throw err; }
      //console.log("b");
        myArray.forEach(function (v) {
          if (v !== "") {
            fs.writeSync(fdesc, (v) + "\r\n", "utf8");
          }
        });
        fs.close(fdesc);
        //console.log("c");

        myArray.length = 0;
        fs = undefined;
        dateFormat = undefined;
        texte = undefined;
        madate = undefined;
      });
    });
  });
}

function adapt(myAdaptVal) {
  "use strict";
  if (myAdaptVal[4] < 1) { myAdaptVal[4] = 0; }
  if (myAdaptVal[4] > 1) { myAdaptVal[4] = Math.round(8 * Math.log(myAdaptVal[4])); }
  let d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();
  if (((h % 4) > 0) || (m > 4)) {
    myAdaptVal[5] = "nan";
  }
  return myAdaptVal;
}

function getnext() {
  "use strict";
  //console.log("a");
  let request = require("request");
  const strURL = "http://localhost:81/JSON?request=getstatus&ref=";
  let capteurs = [460, 291, 38, 515, 605, 288];
  //"Balcon Rfx.Os1.Temp";"Sejour Rfx.Os5.Temp";"Chambre Rfx.Os2.Temp";
  //"SdB Aeon.Radar.Temp";"Sejour Aeon.Radar.Luminance";"Sejour Rfx.Os5.Barometer";
  const headers = {
    "User-Agent": "Super Agent/0.0.1",
    "Content-Type": "application/json"
  };
  let options = {
    url: strURL + capteurs[spi],
    method: "GET",
    headers: headers
  };
  if (spi == 6) {
    request = undefined;
    myNextVal = adapt(myNextVal);
    writefile(myNextVal);
    return 0;
  } else {
    request(options, function (error, response, body) {
       //console.log("b");
       //console.log(body);
      if (error) { throw error; }
      myNextVal[spi] = JSON.parse(body).Devices[0].value;
      //console.log( myNextVal[spi]);
      spi += 1;
      (capteurs = capteurs.slice(1)).length && getnext();
    });
  }
}

function init(){
  "use strict";
  spi = 0;
  myNextVal = [0, 0, 0, 0, 0, 0];
  getnext();
  return(0);
}

init();
setInterval(function () { init(); }, 300000); //5"
