/*jslint node: true */
'use strict';
// expecting something close to 6h
cruedor();
setInterval(function () {
  cruedor();
}, 21600000);
/*21600000ms = 6h */

//exports.get = 
function cruedor() {
  let request = require('request');
  let fs = require('fs');
  let dateFormat = require('dateformat');
  
  const strURL = "http://www.vigicrues.gouv.fr/niveau3.php?idstation=415&idspc=14&typegraphe=h&AffProfondeur=72&AffRef=auto&AffPrevi=non&nbrstations=1&ong=2";
   
  // Set the headers
  const headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  // Configure the request
  const options = {
    url: strURL,
    method: 'GET',
    headers: headers
  };

  // Start the request
  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      //exxtract regexp height from answer body
      let re = new RegExp("Bergerac(.*?)'right'>([0-9 \.]+)", "gmi");
      let strOutput = re.exec(body);
      let txtFormatted = strOutput[2];

      let path = "crue.csv";
      //let path = "C:\\Users\\jeanmarc\\Documents\\crue.csv"
      const sep = ",";
      let d = new Date();
      let n = dateFormat(d, "yyyy/mm/dd HH:MM:ss");
      //& "/" & d.getMonth.toString & "/" & d.getDate.toString & " " & d.getHours.toString & ":" & d.getMinutes.toString & ":" & d.getSeconds.toString;
      let line = `${n}${sep}${txtFormatted}\r\n`;
      fs.appendFile(path, line, function (err) {
        if (err) {
          return console.log(err);
        }
        //console.log("done");
      });

      request.close;
      request.delete;
      request = undefined;
      fs.close;
      fs.delete;
      fs = undefined;
      re.close;
      re = undefined;
      strOutput = undefined;
      txtFormatted = undefined;
      line = undefined;
      path = undefined;
      d = undefined;
      n = undefined;
    }
  });
}