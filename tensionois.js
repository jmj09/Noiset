const myF = require('./noisetfunc.js');
const path1 = "./tensio.csv";
const sep = ",";
const sens1 = "618";// "Sejour Soilhum-1";
const sens2 = "620";// "Sejour Soilhum-2";
const sens3 = "616";// "Sejour Soilhum-3";
const strURL = "http://localhost:81/JSON?request=getstatus&ref=";

const options1 = {
    url: strURL + sens1,
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

const options2 = {
    url: strURL + sens2,
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

const options3 = {
    url: strURL + sens3,
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

(function getAll() {
  "use strict";
  Promise.all([myF.getContentProm(options1), myF.getContentProm(options2), myF.getContentProm(options3)])
  .then((values) => {
    const hum1 = JSON.parse(values[0]).Devices[0].value;
    const hum2 = JSON.parse(values[1]).Devices[0].value;
    const hum3 = JSON.parse(values[2]).Devices[0].value;
    const madate = myF.dateNF();
    const texte = `${madate}${sep}${hum1}${sep}${hum2}${sep}${hum3}\r\n`;
    myF.appendToFileProm(path1, texte);
  })
  .catch(function(e) {
    console.log('tensionois.js appendToFileprom ' + e)
    return false;
  });
  setTimeout(getAll, 3600000); //1h
})();