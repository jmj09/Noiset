/*jslint node: true */
'use strict';

ftpprime();

setInterval(function () {
ftpprime();
}, 120000);//2'

//exports.put = 
function ftpprime() {
//console.log('enter ftpprime');
  let client = require('ftp');
  let fs = require('fs');
  let clftp = new client();
  process.setMaxListeners(0); // OMG, its so simple... :D
  
  clftp.on('ready', function () {
    //console.log('ready event');
    let myfiles = ['annot', 'crue', 'ener', 'ener24', 'mem2000', 'pluie', 'pluie24', 'tensio', 'temp5000'];
    (function ftpnext() {
      clftp.put(myfiles[0] + '.csv', myfiles[0] + '.csv', function (err) {
        if (err) {
          processError('ftpprime-on', err, 21);
        }
        //console.log(myfiles[0]);
        (myfiles = myfiles.slice(1)).length && ftpnext();
      });
    })();
    clftp.end();
  });

  clftp.on('uncaughtException', function (err) {
    console.log("Uncaught exception");
    clftp.destroy();
      return(0);
  });

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
  //console.log('connect');
}

function processError(funcName, err, ligne){
  let dateFormat = require('dateformat');
  let d = new Date();
  let n = dateFormat(d, "yyyy/mm/dd HH:MM:ss");
  console.log(`${funcName} -ligne ${ligne} : ${n} at ${err}`);
  //c.end();
  //setTimeout(function () {}, 20000);
}