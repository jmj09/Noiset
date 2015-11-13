/*eslint-env node*/

//init var
var capteur1 = 618; // "Sejour Soilhum-1";
var capteur2 = 620; // "Sejour Soilhum-2";
var capteur3 = 616; // "Sejour Soilhum-3";
var hum1, hum2, hum3;
var strURL1 = "http://localhost:81/JSON?request=getstatus&ref=" + capteur1;
var strURL2 = "http://localhost:81/JSON?request=getstatus&ref=" + capteur2;
var strURL3 = "http://localhost:81/JSON?request=getstatus&ref=" + capteur3;
// Set the headers
var headers = {
  "User-Agent": "Super Agent/0.0.1",
  "Content-Type": "application/x-www-form-urlencoded"
};
var request = require("request");

function writefile() {
  "use strict";
  var fs = require("fs");
  var dateFormat = require("dateformat");
  var madate = dateFormat(Date.now(), "yyyy/mm/dd HH:MM:ss");
  var path1 = "tensio.csv";
  //var path1 = "C:\\Users\\jeanmarc\\Documents\\tensio.csv";
  var sep = ",";
  var texte = madate + sep + hum1 + sep + hum2 + sep + hum3 + "\r\n";
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

function get3() {
  "use strict";
  // Configure the request
  var options = {
    url: strURL3,
    method: "GET",
    headers: headers
  };
  // Start the request
  request(options, function (error, response, body) {
    if (error) {hum3 = 0; }
    if (!error && response.statusCode === 200) {
      hum3 = JSON.parse(body).Devices[0].value;
      writefile();
    }
  });
}

function get2() {
  "use strict";
  // Configure the request
  var options = {
    url: strURL2,
    method: "GET",
    headers: headers
  };
  // Start the request
  request(options, function (error, response, body) {
    if (error) {hum2 = 0; }
    if (!error && response.statusCode === 200) {
      hum2 = JSON.parse(body).Devices[0].value;
      //console.log("done1 lum5= " + lum5);
      get3();
    }
  });
}

//exports.get =
function get1() {
  "use strict";
  // Configure the request
  var options = {
    url: strURL1,
    method: "GET",
    headers: headers
  };
  // Start the request
  request(options, function (error, response, body) {
    if (error) {hum1 = 0; }
    if (!error && response.statusCode === 200) {
      hum1 = JSON.parse(body).Devices[0].value;
      //console.log("done1 temp4= " + temp4);
      get2();
    }
  });
}


// launch action !
get1();
// expecting something close to 1h
setInterval(function () {
  "use strict";
  get1();
}, 3605000);
/*3 600 000 ms = 1h */
