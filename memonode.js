(function memonode() {
  'use strict';
  const fs = require('fs');
  const myF = require('./noisetfunc.js');
  const sep = ',';
  const madate = myF.dateNF();
  const path1 = './node.csv';
  const options = {
    url: 'http://127.0.0.1:1000/=rss',
    method: 'GET',
    headers: {
      'User-Agent': 'Noiset Agent',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  myF.getContentProm(options)
    .then(function (response) {
      const data = JSON.parse(response);
      for (let i = 0; i < data.length; i++) {
        myF.removeEmptyLine(data);
      }
      let bar = data; //myF.removeCol(data, 1);
      bar = bar.sort(myF.sortByCol0);
      bar = myF.removeLine(bar);
      let bcl = 1;
      bar.forEach(function (entry) {
        let texte = `${madate}${sep}${parseInt(entry[1], 10).toString()}${sep}${entry[2].trim()}\r\n`;
        fs.appendFile(path1, texte, function (err) {
          if (err) {
            myF.processError('memonode', err, 34);
            return 0;
          }
        });
        bcl = bcl + 1;
      });
    })
    .catch(function (err) {
      myF.processError('memononode request ', err, 39);
    });
    setTimeout(memonode, 60000);
})();