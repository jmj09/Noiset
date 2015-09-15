/*jslint node: true */
'use strict';
//let mypath = 'C:\\Users\\jeanmarc\\Documents\\netcam\\';
// ok pour la mem


//exports.get = 
function magick() {
  let gm = require('gm'), path = require('path');
  gm(path.join(__dirname, '/netcam/CurrentImage.jpg'))
    .bitdepth(16)
    .resize(1000)
    .quality(40)
    .write(path.join(__dirname, '/netcam/imagminify.jpg'), function (err) {
    if (err) { console.log('erreur write imagminify'); }
    //console.log("done");
    rename();
  });
  gm = undefined;
  path = undefined;
}

function rename() {
  let fs = require('fs');
  let fs2 = require('fs')
  let path = require('path');
  let i;
  let maxim = 390;
  let pathtot3 = path.join(__dirname, '/netcam/imagminify.jpg');
  let pathtot4 = path.join(__dirname, '/netcam/390.jpg');
  //fs.renameSync(pathtot3, pathtot4);
  //fs.createReadStream(pathtot3).pipe(fs.createWriteStream(pathtot4));

  fs.writeFileSync(pathtot4, fs.readFileSync(pathtot3));
  
  for (i = 2; (i < maxim + 1 ) ; i++) {
    let pathtot5 = path.join(__dirname, '/netcam/' + i + '.jpg');
    let pathtot6 = path.join(__dirname, '/netcam/' + (i - 1) + '.jpg');
    //console.log(pathtot5 + ' - ' + pathtot6);
    fs.stat(pathtot5, function(err, stat) {
      //console.log(err);
      if(err == null) {
        //console.log(pathtot5 + ' ok');
        fs.renameSync(pathtot5,pathtot6);
      } 
      if(!(err==null)) {
        //console.log( 'err47:' + err)
        //console.log('Gmjs No such file 38 ');
        //constinue in case of no such file
      } 
      //fs.close;
      //fs = undefined;
    });
  }
}

magick();

// expecting trigger close to 2'
setInterval(function () { magick(); }, 120000);