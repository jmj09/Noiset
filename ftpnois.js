//exports.put =

function processError(funcName, err, ligne){
  "use strict";
  let dateFormat = require("dateformat");
  let d = new Date();
  let n = dateFormat(d, "yyyy/mm/dd HH:MM:ss");
  console.log(`${funcName} - ligne ${ligne} : ${n} at ${err}`);
  //setTimeout(function () {}, 10000);
}

function ftpprime() {
  "use strict";
//console.log("enter ftpprime");
  let Client = require("ftp");
  let fs = require("fs");
  let clftp = new Client();
  //clftp.setMaxListeners(0); // unlimited listeners

  clftp.on("ready", function () {
    //console.log("ready event");
    let myfiles = ["annot", "crue", "ener", "ener24", "mem2000", "pluie", "pluie24", "tensio", "temp5000"];
    (function ftpnext() {
      fs.access(myfiles[0] + ".csv", function (err) {
        if (err) {
          processError("file access pb ", err, 26);
          myfiles = myfiles.slice(1);
          ftpnext();
        } else {
          clftp.put(myfiles[0] + ".csv", myfiles[0] + ".csv", function (err) {
            //console.log(myfiles[0]);
            if (err) {
            processError("file access pb ", err, 33);
            }
            (myfiles = myfiles.slice(1)).length && ftpnext();
            if(!myfiles.length) {clftp.end();}
          });
        }
      });
    })();
  });

  clftp.on("error", function (err) {
    processError("Error",err,37);
    clftp.destroy();
    return(0);
  });

  clftp.connect({
    host: "ftpperso.free.fr",
    port: 21,
    secure: false,
    user: "meteo.noiset",
    password: "17321414",
    connTimeout: 10000,
    pasvTimeout: 10000,
    keepalive: 10000
  });

  //setTimeout(ftpprime, 300000);
};


ftpprime();
setInterval(function () {
ftpprime();
}, 300000);//2"
