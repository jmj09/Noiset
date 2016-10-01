/*eslint-env node*/

(function ftpProcess() {
  "use strict";
  const Client = require("ftp");
  const myF = require('./noisetfunc.js');
  const clftp = new Client();
  const fs = require("fs");
  clftp.on("ready", function () {
    let myfiles = ["annot", "crue", "ener", "ener24", "mem2000", "pluie", "pluie24", "tensio", "temp5000"];
    (function ftpnext() {
      fs.access(myfiles[0] + ".csv", function (err) {
        if (err) {
          myF.processError("file access pb ", err, 13);
          myfiles = myfiles.slice(1);
          ftpnext();
        } else {
          clftp.put(myfiles[0] + ".csv", myfiles[0] + ".csv", function (err) {
            if (err) {
              myF.processError("clftp.put ", err, 19);
              clftp.end();
            }
            else {
              (myfiles = myfiles.slice(1)).length && ftpnext();
              //console.log("done " + myfiles[0]);
              if(!myfiles.length) {clftp.end();}
            }
          });
        }
      });
    })();
  });

  clftp.on("error", function (err) {
    myF.processError("clftp.on",err,32);
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
  setTimeout(ftpProcess, 300000);
})();