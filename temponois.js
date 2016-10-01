const myF = require('./noisetfunc.js');
const path1 = "./temp.csv";
const path2 = "./temp5000.csv";
const sep = ",";

function writeFile(myVal) {
  "use strict";
  const myFirstLine = "D,Tempext,Tempint,Tempch,TempSdB,Lumint,Patm";
  const madate = myF.dateNF();
  const texte = `${madate}${sep}${myVal[0]}${sep}${myVal[1]}${sep}${myVal[2]}${sep}${myVal[3]}${sep}${myVal[4]}${sep}${myVal[5]}\r\n`;
  myF.appendToFileProm(path1, texte)
  .then(() => {
    myF.sliceFileProm(path1, path2, 3000, myFirstLine)
    .then(() => {return true;})
  })
  .catch(function(e) {
  console.log(e);
  });
}

(function getAll(){
  "use strict";
  const sensor = [460, 291, 38, 515, 236];
  const strURL = "http://localhost:81/JSON?request=getstatus&ref=";
  const strPAS = "http://127.0.0.1:1000/=pas";
  const valor = [];
  const options = [];
  for (let i = 0; i<6; i++){
    options.push({url: "",
    method: "GET",
    headers: {
      "User-Agent": "Noiset Agent",
      "Content-Type": "application/x-www-form-urlencoded"
    }});
  }
  for (let i = 0; i < sensor.length; i++){options[i].url = strURL + sensor[i];}
  options[5].url = strPAS;
  let promises = [];
  options.forEach((myoption) => {promises.push(myF.getContentProm(myoption));})
  Promise.all(promises).then((values) => {
    for (let i = 0; i < sensor.length; i++){valor[i] = (JSON.parse(values[i]).Devices[0].value).toFixed(1);}
    valor[5] =  (parseFloat(JSON.parse(values[5])) + 3.7).toFixed(2);
    if (valor[4] < 1) { valor[4] = 0; }
    if (valor[4] > 1) { valor[4] = Math.round(8 * Math.log(valor[4])); }
    writeFile(valor);
  }, (raisonRejet) => {
    console.log(raisonRejet);
    valor = [0,0,0,0,0,0];
    writeFile(valor);
  });
  setTimeout(getAll, 300000);
})();