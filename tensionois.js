/*eslint-env node*/
"use strict";
//init let
let hum1, hum2, hum3;
let hum = [hum1, hum2, hum3];
const strURL1 = "http://localhost:81/JSON?request=getstatus&ref=618";// "Sejour Soilhum-1";
const strURL2 = "http://localhost:81/JSON?request=getstatus&ref=620";// "Sejour Soilhum-2";
const strURL3 = "http://localhost:81/JSON?request=getstatus&ref=616";// "Sejour Soilhum-3";
// Set the headers

function writefile(hum) {
  "use strict";
  const fs = require("fs");
  const dateFormat = require("dateformat");
  const madate = dateFormat(Date.now(), "yyyy/mm/dd HH:MM:ss");
  const path1 = "tensio.csv";
  //let path1 = "C:\\Users\\jeanmarc\\Documents\\tensio.csv";
  const sep = ",";
  const texte = madate + sep + hum[0] + sep + hum[1] + sep + hum[2] + "\r\n";
  //console.log(texte);
  try {
    fs.appendFile(path1, texte, function (err) {
      if (err) {
        return console.log(err);
      }
    });
  } catch (err) {
    console.log("tensionois.js writefile " + madate + " : " + err);
  }
  //console.log("write file ok " + texte);
}

(function get() {
  "use strict";
  const requestP = require('request-promise');
  const myF = require('./noisetfunc.js');
  // Configure the request
	const headers = {
	  "User-Agent": "Super Agent/0.0.1",
	  "Content-Type": "application/x-www-form-urlencoded"
	};
  const options = {
    url: strURL1,
    method: "GET",
    headers: headers
  };
  // Start the request
  requestP(options)
    .then(function (response1) {
      hum1 = JSON.parse(response1).Devices[0].value;
      //console.log("done1 hum1= " + hum1);
      const options = {
        url: strURL2
      };
      requestP(options)
      .then(function (response2) {
        hum2 = JSON.parse(response2).Devices[0].value;
        //console.log("done2 hum2= " + hum2);
        const options = {
        url: strURL3
        };
        requestP(options)
        .then(function (response3) {
        hum3 = JSON.parse(response3).Devices[0].value;
        //console.log("done3 hum3= " + hum3);
        hum = [hum1, hum2, hum3];
        //console.log(hum);
        writefile(hum);
        });
      });
    })
    .catch(function (err) {
      myF.processError('tensionois requestP ', err, 33);
    });
  setTimeout(get, 3600000);
})();