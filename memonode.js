function removeLine(arr) {
  "use strict";
  return arr.filter(function (el) { return (el[0].substring(0, 4) === "node"); });
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
(function memonode() {
  "use strict";
  const fs = require("fs");
  const myF = require('./noisetfunc.js');
  const sep = ",";

  const madate = myF.dateNF();
  const path1 = "./node.csv";

  //configure request
  const options = {
    url: "http://127.0.0.1:1000/=rss",
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  myF.getContent(options)
    .then(function (response) {
      const data = JSON.parse(response);
      for (let i = 0; i < data.length; i++) {
        removeEmptyLine(data);
      }
     let bar = removeCol(data, 1);

      bar = bar.sort(sortByCol0);
      bar = removeLine(bar);
      let bcl = 1;
      bar.forEach(function (entry) {
        let texte = madate + sep + parseInt(entry[1], 10).toString() + sep + entry[2].trim() + '\r\n';
        fs.appendFile(path1, texte, function (err) {
          if (err) {
            processError("memonode", err, 98);
            return 0;
          }
        });
        bcl++;
      });

    })
    .catch(function (err) {
      myF.processError('memononode request ', err, 60);
    });
    setTimeout(memonode, 60000);
})();