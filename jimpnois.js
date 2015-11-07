/*jslint node: true */
'use strict';

/************************************************/
/* file copy a file list decrementing file name */
/* from 300 to 1.jpg should rename instead      */
/************************************************/
function jimpjs(){
  let myfiles = [];
  myfiles = Array.from(new Array(300), (x,i) => i+1);
  (function writeNext() {
    let fse = require('fs.extra');
    fse.copy('netcam/' + myfiles[1] + '.jpg', 'netcam/' + myfiles[0] + '.jpg', { replace: true }, function (err) {
      if (err) { console.log('mon erreur ' + err);}// i.e. file absent
      //console.log(myfiles[0]);
      (myfiles = myfiles.slice(1)).length - 1 && writeNext();
      fse = null;
    });
  })();
}

/************************************************/
/* read jpg file, resize and reducequality      */
/* as a promise then save                       */
/************************************************/
function update(){
  let Jimp = require('jimp');
  Jimp.read('netcam/CurrentImage.jpg').then(function (current) {
      current.resize(1000, 600)      // resize
           .quality(50)              // set JPEG quality
           .write('netcam/300.jpg'); // save
  }).catch(function (err) {
      console.error(err);
  });
}

/************************************************/
/* file change check and when triggered         */
/* copy file and decrement file names           */
/************************************************/
let onFileChange = require('on-file-change');
onFileChange('netcam/CurrentImage.jpg', function()
{
    //console.log('fired');
    update();
    jimpjs();
});