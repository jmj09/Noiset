/*eslint-env node*/

//remove line
function removeLine(arr) {
  "use strict";
  return arr.filter(function (el) { return (el[0].substring(0, 4) === "node" || el[0].substring(0, 4) === "HSPI" || el[0].substring(0, 4) === "HS3."); });
}

//remove col
function removeCol(array, remIdx) {
  "use strict";
  return array.map(function (arr) {
    return arr.filter(function (idx) { return idx !== remIdx; });
  });
}

//sort on first col
function sortByCol0(a, b) {
  "use strict";
  let x = a[0];
  let y = b[0];
  return ((x > y) ? -1 : ((x < y) ? 1 : 0));
}

//remove empty line based on first col
function removeEmptyLine(arr) {
  "use strict";
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] === "") {
      arr.splice(i, 1);
      return arr;
    }
  }
}

//main func
(function memonois() {
  "use strict";
  const requestP = require('request-promise');
  const fs = require("fs");
  const dateFormat = require("dateformat");
  const myF = require('./noisetfunc.js');
  const sep = ",";
  let texte = "";
  const madate = dateFormat(Date.now(), "yyyy/mm/dd HH:MM:ss");
  const path1 = "./mem.csv";
  const path2 = "./mem2000.csv";
  //let path1 = "C:\\Users\\jeanmarc\\Documents\\mem.csv";
  //let path2 = "C:\\Users\\jeanmarc\\Documents\\mem3000.csv";

  //configure request
  const options = {
    url: "http://127.0.0.1:1000/=rss",
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  requestP(options) 
    .then(function (response) {
      const data = JSON.parse(response);
      const longo = data.length;
      let i;
      for (i = 0; i < longo; i++) {
        removeEmptyLine(data);
      }
      let bar = removeCol(data, 1);
      bar = bar.sort(sortByCol0);
      bar = removeLine(bar);
      let bcl = 1;
      //console.log(bar);
      bar.forEach(function (entry) {
        entry[0] = entry[0].substring(0, 3) + bcl;
        bcl++;
      });
      let ttlioj = 0;
      let ttlngi = 0;
      let ttlhs3 = 0;
      bar.forEach(function (entry) {
        switch (entry[0].substring(0, 3)) {
          case "nod":
            ttlioj += parseInt(entry[2], 10);
            break;
          case "HSP":
            ttlngi += parseInt(entry[2], 10);
            break;
          case "HS3":
            ttlhs3 += parseInt(entry[2], 10);
            break;
          default:
        }
      });
      //console.log(ttlioj + " - " + ttlngi + " - " + ttlhs3);
      if (ttlioj === 0) { return 0; }
      texte = `${madate}${sep}${ttlioj}${sep}${ttlngi}${sep}${ttlhs3}\r\n`;
      //console.log(texte);
      fs.appendFile(path1, texte, function (err) {
        if (err) {
          processError("memonois", err, 104);
          return 0;
        }
        fs.readFile(path1, "utf8", function (err, dotum) {
          if (err) {
            processError("memonois", err, 109);
            return 0;
          }
          let myarray = dotum.split("\r\n");
          let fin = [];
          if (myarray.length > 3000) {
            fin = myarray.slice(myarray.length - 3000, myarray.length - 1);
          } else {
            fin = myarray;
          }
          fin[0] = "date,node,HSPI,hs3";
          const fdesc = fs.openSync(path2, "w");
          fin.forEach(function (v) {
            fs.writeSync(fdesc, (v) + "\r\n");
          });
          fs.close(fdesc);
          /*dateFormat = undefined;
          fdesc = undefined;*/
          fin.length = 0;
          myarray.length = 0;
          /*bar = undefined;
          data = undefined;*/
        });
      });
    })
    .catch(function (err) {
      myF.processError('cruedor request ', err, 33);
    });
  setTimeout(memonois, 1200000);
})();