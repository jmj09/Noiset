/*jslint node: true */
'use strict';

function jimpjs(){
  let fse = require('fs.extra');
  let myfiles = [];
  for (let i = 1; i < 301; i++){
    myfiles.push(i);
  }
  (function writeNext() {
    fse.copy('netcam/' + myfiles[1] + '.jpg', 'netcam/' + myfiles[0] + '.jpg', { replace: true }, function (err) {
      if (err) {
        // i.e. file absent
      }
      (myfiles = myfiles.slice(1)).length - 1 && writeNext();
    });
  })();
}

function update(){
  let Jimp = require('jimp');
  let img = new Jimp('netcam/CurrentImage.jpg', function (err, img) {
    img.resize(1000, 600, function(err, img){
      img.quality(40, function (err, img){
        img.write('netcam/300.jpg', function (err, img){
          if(err){console.log('file 100 pb');}
          //console.log('file 100 ok');
          setTimeout(function(){jimpjs()}, 2000);
          img = undefined;
        });
      });
    });
  });
}

let onFileChange = require("on-file-change");
onFileChange('netcam/CurrentImage.jpg', function()
{
    update();
});

