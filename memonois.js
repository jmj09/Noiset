/*eslint-env node*/

//remove line
function removeLine(arr) {
  "use strict";
  return arr.filter(function (el) { return (el[0].substring(0, 4) === "node" || el[0].substring(0, 4) === "HSPI" || el[0].substring(0, 4) === "HS3." || el[0].substring(0, 4) === "ngin"); });
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
  const myF = require('./noisetfunc.js');
  const sep = ",";
  let texte = "";
  const madate = myF.dateNF();
  const path1 = "./mem.csv";
  const path2 = "./mem2000.csv";
  const options = {
    url: "http://127.0.0.1:1000/=rss",
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  myF.getContentProm(options)
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
      let ttlnod = 0;
      let ttlhsp = 0;
      let ttlhs3 = 0;
      let ttlngi = 0;
      bar.forEach(function (entry) {
        switch (entry[0].substring(0, 3)) {
          case "nod":
            ttlnod += parseInt(entry[2], 10);
            break;
          case "HSP":
            ttlhsp += parseInt(entry[2], 10);
            break;
          case "HS3":
            ttlhs3 += parseInt(entry[2], 10);
            break;
          case "ngi":
            ttlngi += parseInt(entry[2], 10);
            break;
          default:
        }
      });
      if (ttlnod === 0) { return 0; }
      texte = `${madate}${sep}${ttlnod}${sep}${ttlhsp}${sep}${ttlhs3}${sep}${ttlngi}\r\n`;

      const myFirstLine = "date,node,hspi,hs3,nginx";
      myF.appendToFileProm(path1, texte)
        .then(() => {
          myF.sliceFileProm(path1, path2, 3000, myFirstLine)
          .then(() => {return true;})
        })
        .catch(function(e) {
        console.log(e);
        });
    });
  setTimeout(memonois, 60000);
})();