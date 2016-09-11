let fs = require("fs");
(function () {
  const onFileChange = require("on-file-change");
  onFileChange("netcam/CurrentImage.jpg", () => {
    update();
  });
})();

function copyFile(source, target) {
  return new Promise(function(resolve, reject) {
      var rd = fs.createReadStream(source);
      rd.on('error', reject);
      var wr = fs.createWriteStream(target);
      wr.on('error', reject);
      wr.on('finish', resolve);
      rd.pipe(wr);
  });
}

function decrement(){
  let i = 0, myfiles = [];
  const max = 300;
  for(i = 1; myfiles.push(i++) < max;);
  (function copyNext() {
    let mySource = "netcam/" + myfiles[1] + ".jpg";
    let myTarget = "netcam/" + myfiles[0] + ".jpg";
    copyFile(mySource, myTarget)
    .then (() => {
      (myfiles = myfiles.slice(1)).length - 1 && copyNext();
      })
    .catch(function(e){
      console.log('catch ligne 34 : ' + e);
    });
  })();
}

function update(){
  const tufu = require("tufu-fix");
  tufu("./netcam/CurrentImage.jpg").resize(1000, 600).compress(20).save("./netcam/300.jpg");
  decrement();
}