(function cruedor() {
  const myF = require('./noisetfunc.js');
  const options = {
    url: "http://www.vigicrues.gouv.fr/niveau3.php?CdStationHydro=P514001001&CdEntVigiCru=14&typegraphe=h&AffProfondeur=168&AffRef=tous&AffPrevi=non&nbrstations=1&ong=2",
    method: "GET",
    headers: {
      "User-Agent": "Super Agent/0.0.1",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  myF.getContentProm(options)
    .then(function (response) {
      const re = new RegExp("Bergerac.*?'right'>([0-9 \.]+)", "gmi");
      const txtFormatted = re.exec(response)[1];
      const path = "./crue.csv";
      const line = `${myF.dateNF()},${txtFormatted}\r\n`;
      myF.appendToFileProm(path, line)
        .then(() => {
          return true;
        })
        .catch(function(e) {
        console.log(e);
        });
    }).catch(function(e) {
      console.log(e);
    });
  setTimeout(cruedor, 21600000); //6h
})();