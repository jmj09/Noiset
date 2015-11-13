function decrement(){
  "use strict";
  let myfiles = [];
  myfiles = Array.from(new Array(300), (x,i) => i+1);
  (function writeNext() {
    let fse = require("fs.extra");
    fse.copy("netcam/" + myfiles[1] + ".jpg", "netcam/" + myfiles[0] + ".jpg", { replace: true }, function (err) {
      if (err) { console.log("mon erreur " + err);}// i.e. file absent
      //if (myfiles.length === 5) {console.log(myfiles[0]);}
      (myfiles = myfiles.slice(1)).length - 1 && writeNext();
      fse = null;  
    });
  })();
}

function update(){
  "use strict";
  let Jimp = require("jimp");
  Jimp.read("netcam/CurrentImage.jpg").then(function (current) {
    current.resize(1000, 600)      // resize
      .quality(50);                // set JPEG quality
    current.write("netcam/300.jpg",function () {
      //console.log("fic 300 ok");
      decrement();
      Jimp = null;
    });                           // save
  }).catch(function (err) {
      console.error(err);
   });
}

var onFileChange = require("on-file-change");
onFileChange("netcam/CurrentImage.jpg", function(){
  //console.log("fired");
  update();
});
