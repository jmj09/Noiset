/*jslint node: true */
'use strict';
let client = require('ftp');
let fs = require('fs');

//ftpprime();

exports.put = function ftpprime() {

  let clftp = new client();

  clftp.on('ready', function () {
    let myfiles = ['annot', 'crue', 'ener', 'ener24', 'mem2000', 'pluie', 'pluie24', 'tensio', 'temp5000'];
    (function ftpnext() {
      clftp.put(myfiles[0] + '.csv', myfiles[0] + '.csv', function (err) {
        if (err) {
          processError('ftpprime-on', err, 12);
        }
        (myfiles = myfiles.slice(1)).length && ftpnext();
      });
      clftp.end();
      //fs = undefined;
      //client = undefined;
    })();
  });

  try {
    clftp.connect({
      host: "ftpperso.free.fr",
      port: 21,
      secure: false,
      secureOptions: {},
      user: "meteo.noiset",
      password: "17321414",
      connTimeout: 10000,
      pasvTimeout: 10000,
      keepalive: 10000
    });
  }
  catch(err) {
    processError('ftpprime-connect', err, 34);
  }
}

function processError(func, err, ligne){
  let d = new Date();
  let n = dateFormat(d, "yyyy/mm/dd HH:MM:ss");
  console.log(func + '-ligne' + ligne + ' : ' + n + ' at ' + err);
  c.end();
  process.exit(0);
}
