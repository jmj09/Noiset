/*eslint-env node*/
"use strict";

(function cruedor() {
  "use strict";
  const requestP = require('request-promise');
  const dateFormat = require("dateformat");
  const myF = require('./noisetfunc.js');
  const fs = require("fs");
  const strURL = "http://www.vigicrues.gouv.fr/niveau3.php?CdStationHydro=P514001001&CdEntVigiCru=14&typegraphe=h&AffProfondeur=168&AffRef=tous&AffPrevi=non&nbrstations=1&ong=2";
  // Set the headers
  const headers = {
    "User-Agent": "Super Agent/0.0.1",
    "Content-Type": "application/x-www-form-urlencoded"
  };
  // Configure the request
  const options = {
    url: strURL,
    method: "GET",
    headers: headers
  };

  // Start the request
  requestP(options) 
    .then(function (response) {
      //extract regexp height from answer response
      const re = new RegExp("Bergerac(.*?)'right'>([0-9 \.]+)", "gmi");
      const strOutput = re.exec(response);
      const txtFormatted = strOutput[2];
      const path = "crue.csv";
      //let path = "C:\\Users\\jeanmarc\\Documents\\crue.csv"
      const sep = ",";
      const d = new Date();
      const n = dateFormat(d, "yyyy/mm/dd HH:MM:ss");
      const line = `${n}${sep}${txtFormatted}\r\n`;
      fs.appendFile(path, line, function (err) {
        if (err) {
          myF.processError("appendFile", err, 37);
        }
      });
    })
    .catch(function (err) {
      myF.processError('cruedor request ', err, 24);
    });
      setTimeout(cruedor, 21600000); //6h
})();