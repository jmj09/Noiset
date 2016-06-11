/*eslint-env node*/
"use strict";
(function () {
  const onFileChange = require("on-file-change");
  onFileChange("netcam/CurrentImage.jpg", () => {
    update();
  });
})();

function copyFile(source, target) {
  "use strict";
  return new Promise((resolve, reject) => {
    const fs = require("fs");
    const rd = fs.createReadStream(source);
    rd.on('error', reject);
    const wr = fs.createWriteStream(target);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  });
}

function decrement(){
  "use strict";
  let i = 0, myfiles = [];
  const max = 300;
  for(i = 1; myfiles.push(i++) < max;);
  (function writeNext() {
    copyFile("netcam/" + myfiles[1] + ".jpg", "netcam/" + myfiles[0] + ".jpg")
    .then (() => {(myfiles = myfiles.slice(1)).length - 1 && writeNext();})
    .catch((err) => {return err;});
  })();
}

function update(){
  "use strict";
  const myF = require('./noisetfunc.js');
  const Jimp = require("jimp");
  Jimp.read("netcam/CurrentImage.jpg").then((current) => {
    current.resize(1000, 600)      // resize
      .quality(50);                // set JPEG quality
    current.write("netcam/300.jpg", () => {
      //console.log("fic 300 ok");
    const valErr = decrement();
    if(valErr) {myF.processError("update decrement : ", valErr, 14);}
      //Jimp = null;
    });                           // save
  }).catch((err) => {
      myF.processError("update", err, 18);
   });
}