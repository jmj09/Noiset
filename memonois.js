//main func
(function memonois() {
  const myF = require('./noisetfunc.js');
  const sep = ",";
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
        myF.removeEmptyLine(data);
      }
      let bar = myF.removeCol(data, 1);
      
      bar = bar.sort(myF.sortByCol0);
      //console.log(bar);
      bar = myF.removeLine(bar);
      //console.log(bar);

      let bcl = 1;
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
            ttlnod += parseInt(entry[1], 10);
            break;
          case "HSP":
            ttlhsp += parseInt(entry[1], 10);
            break;
          case "HS3":
            ttlhs3 += parseInt(entry[1], 10);
            break;
          case "ngi":
            ttlngi += parseInt(entry[1], 10);
            break;
          default:
        }
      });
      if (ttlnod === 0) { return 0; }
      const texte = `${madate}${sep}${ttlnod}${sep}${ttlhsp}${sep}${ttlhs3}${sep}${ttlngi}\r\n`;
      const myFirstLine = "date,node,hspi,hs3,nginx";
      myF.appendToFileProm(path1, texte)
        .then(() => {
          myF.sliceFileProm(path1, path2, 3000, myFirstLine)
          .then(() => {return true;})
        })
        .catch(function(e) {
        console.log(e);
        });
    }).catch(function(e) {
        console.log(e);
      });
  setTimeout(memonois, 60000);
})();